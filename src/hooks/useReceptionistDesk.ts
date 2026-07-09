"use client";

import { useState, useEffect } from "react";
import { useTable, useList, useUpdate } from "@refinedev/core";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { SPECIALTY_ROUTING_MAP } from "@/utils/normalization";
import { BookingRecord, Doctor } from "@/types";
import { supabaseClient } from "@/providers/Supabase/Client";

export const OPERATIONAL_HOURS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

export function useReceptionistDesk() {
  const { updateBookingStatus, dispatchToDoctorSlot, rollbackBookingToQueue } = useBookingOperations();
  const { mutate: updateDoctorMutation } = useUpdate();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });


  useEffect(() => {
  const channel = supabaseClient
    .channel("receptionist-daily-schedules-sync")
    .on(
      "postgres_changes",
      {
        event: "*", // Catches INSERT, UPDATE, and DELETE
        schema: "public",
        table: "daily_schedules",
      },
      () => {
        // Tells Refine's react-query cache to silently pull down the fresh rows
        dailySchedulesQuery.refetch();
      }
    )
    .subscribe();

  return () => {
    supabaseClient.removeChannel(channel);
  };
}, [selectedDate]); // re-binds cleanly if they switch days
  
  const [selectedPatient, setSelectedPatient] = useState<BookingRecord | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = useState<string>(""); 

  // 🚀 REAL-TIME: Stream incoming triage records and status updates
  const { tableQuery } = useTable<BookingRecord>({
    resource: "bookings",
    sorters: { initial: [{ field: "created_at", order: "desc" }] },
    liveMode: "auto",
  });

  // 🚀 REAL-TIME: Stream baseline profile details, breaks, etc.
  const { result: doctorsResult, query: doctorsQuery } = useList<Doctor>({
    resource: "doctors",
    pagination: { mode: "off" },
    liveMode: "auto",
  });

  // 🚀 REAL-TIME: Fetch and stream the active overrides from the new single-day table
  const { result: dailySchedulesResult, query: dailySchedulesQuery } = useList({
    resource: "daily_schedules",
    filters: [{ field: "schedule_date", operator: "eq", value: selectedDate }],
    pagination: { mode: "off" },
    liveMode: "auto",
  });

  // 🚀 REAL-TIME: Fetch leaves for the targeted calendar date context
  const { result: leavesResult, query: leavesQuery } = useList({
    resource: "leaves",
    filters: [{ field: "leave_date", operator: "eq", value: selectedDate }],
    pagination: { mode: "off" },
    liveMode: "auto",
  });

  const bookings = tableQuery?.data?.data ?? [];
  const doctors = doctorsResult?.data ?? [];
  const activeLeaves = leavesResult?.data ?? [];
  const dailySchedules = dailySchedulesResult?.data ?? [];

  useEffect(() => {
    if (!activeDoctorTab && doctors.length > 0) {
      const firstId = doctors[0].badge_id || doctors[0].id;
      if (firstId) setActiveDoctorTab(firstId);
    }
  }, [doctors, activeDoctorTab]);

  // Find base doctor profile matching active tab row
  const rawDoctor = doctors.find((d) => d.id === activeDoctorTab || d.badge_id === activeDoctorTab) || doctors[0];
  
  // ⚡ COMPOSITION LAYER: Inject the day-specific off_work_hour tracking row if it exists
  const currentDoctor = (() => {
    if (!rawDoctor) return null;
    const targetBadgeId = rawDoctor.badge_id || rawDoctor.id;
    const matchedSchedule = dailySchedules.find((s: any) => s.badge_id === targetBadgeId);
    return {
      ...rawDoctor,
      off_work_hour: matchedSchedule ? matchedSchedule.off_work_hour : null
    };
  })();

  const pendingQueue = bookings.filter((b) => (b.status === "pending" || !b.status) && !b.doctorId && !b.timeSlot);

  const getDepartmentMismatchForBooking = (booking: BookingRecord | null) => {
    if (!booking?.normalized_reason || !currentDoctor) return false;
    const targetDept = SPECIALTY_ROUTING_MAP[booking.normalized_reason as keyof typeof SPECIALTY_ROUTING_MAP];
    return targetDept && currentDoctor.specialty !== targetDept;
  };

  const dispatchToSlot = (hour: string) => {
    if (!selectedPatient || !currentDoctor) return;
    const targetDocId = currentDoctor.badge_id || currentDoctor.id;
    if (getDepartmentMismatchForBooking(selectedPatient)) return;

    const isDoctorOnLeave = activeLeaves.some(
      (leave: any) => leave.badge_id === targetDocId && leave.leave_date === selectedDate
    );
    if (isDoctorOnLeave) return;

    dispatchToDoctorSlot(selectedPatient.id, targetDocId, hour, selectedDate, () => {
      setSelectedPatient(null);
    });
  };

  const handleDoctorAvailabilityUpdate = (doctorId: string, nextAvailability: Doctor["availability_status"]) => {
    updateDoctorMutation({
      resource: "doctors",
      id: doctorId,
      values: { availability_status: nextAvailability },
      mutationMode: "optimistic",
    });
  };

  const handleCancelAndResetBooking = (bookingId: string) => {
    rollbackBookingToQueue(bookingId);
  };

  return {
    bookings, 
    doctors, 
    pendingQueue, 
    activeLeaves, 
    isLoading: tableQuery?.isLoading || doctorsQuery?.isLoading || dailySchedulesQuery?.isLoading || leavesQuery?.isLoading,
    selectedPatient, 
    setSelectedPatient, 
    activeDoctorTab, 
    setActiveDoctorTab,
    currentDoctor, 
    isDepartmentMismatch: getDepartmentMismatchForBooking(selectedPatient),
    getDepartmentMismatchForBooking, 
    handleStatusUpdate: updateBookingStatus,
    handleDoctorAvailabilityUpdate, 
    dispatchToSlot, 
    selectedDate, 
    setSelectedDate,
    handleCancelAndResetBooking
  };
}