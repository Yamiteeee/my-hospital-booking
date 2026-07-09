"use client";

import { useState, useEffect } from "react";
import { useTable, useList, useUpdate } from "@refinedev/core";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { SPECIALTY_ROUTING_MAP } from "@/utils/normalization";
import { BookingRecord, Doctor } from "@/types";

export const OPERATIONAL_HOURS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

export function useReceptionistDesk() {
  // 🔄 Destructured rollbackBookingToQueue here
  const { updateBookingStatus, dispatchToDoctorSlot, rollbackBookingToQueue } = useBookingOperations();
  const { mutate: updateDoctorMutation } = useUpdate();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedPatient, setSelectedPatient] = useState<BookingRecord | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = useState<string>(""); 

  // 🚀 REAL-TIME: Stream incoming triage records and status updates
  const { tableQuery } = useTable<BookingRecord>({
    resource: "bookings",
    sorters: { initial: [{ field: "created_at", order: "desc" }] },
    liveMode: "auto", // 🌟 Synchronizes the central patient pipeline
  });

  // 🚀 REAL-TIME: Stream status changes, breaks, and off-work caps for medical staff
  const { result: doctorsResult, query: doctorsQuery } = useList<Doctor>({
    resource: "doctors",
    pagination: { mode: "off" },
    liveMode: "auto", // 🌟 Synchronizes dynamic availability and roster profiles
  });

  // 🚀 TRUE REAL-TIME FIXED: 
  // Explicitly binding selectedDate into queryOptions dependencies array forces Refine 
  // to instantly hot-reload WebSocket rooms when the calendar view pivots.
const { result: leavesResult } = useList({
    resource: "leaves",
    filters: [{ field: "leave_date", operator: "eq", value: selectedDate }],
    pagination: { mode: "off" },
    liveMode: "auto", 
    // 🌟 Cleaned up: Refine tracks 'selectedDate' automatically via the filters array above!
  });

  const bookings = tableQuery?.data?.data ?? [];
  const doctors = doctorsResult?.data ?? [];
  const activeLeaves = leavesResult?.data ?? [];

  useEffect(() => {
    if (!activeDoctorTab && doctors.length > 0) {
      const firstId = doctors[0].badge_id || doctors[0].id;
      if (firstId) setActiveDoctorTab(firstId);
    }
  }, [doctors, activeDoctorTab]);

  const currentDoctor = doctors.find((d) => d.id === activeDoctorTab || d.badge_id === activeDoctorTab) || doctors[0];
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

    // Guard checking if doctor is on leave right before dispatch execution
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

  // 🔄 UI Event Handler exposed directly to your dashboard component
  const handleCancelAndResetBooking = (bookingId: string) => {
    rollbackBookingToQueue(bookingId);
  };

  return {
    bookings, doctors, pendingQueue, activeLeaves, 
    isLoading: tableQuery?.isLoading || doctorsQuery?.isLoading,
    selectedPatient, setSelectedPatient, activeDoctorTab, setActiveDoctorTab,
    currentDoctor, isDepartmentMismatch: getDepartmentMismatchForBooking(selectedPatient),
    getDepartmentMismatchForBooking, handleStatusUpdate: updateBookingStatus,
    handleDoctorAvailabilityUpdate, dispatchToSlot, selectedDate, setSelectedDate,
    
    // 🔄 Exposed method for the UI's "Undo/Cancel" buttons
    handleCancelAndResetBooking
  };
}