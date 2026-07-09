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
  const { updateBookingStatus, dispatchToDoctorSlot } = useBookingOperations();
  const { mutate: updateDoctorMutation } = useUpdate();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedPatient, setSelectedPatient] = useState<BookingRecord | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = useState<string>(""); 

  const { tableQuery } = useTable<BookingRecord>({
    resource: "bookings",
    sorters: { initial: [{ field: "created_at", order: "desc" }] }
  });

  const { result: doctorsResult, query: doctorsQuery } = useList<Doctor>({
    resource: "doctors",
    pagination: { mode: "off" } 
  });

  const bookings = tableQuery?.data?.data ?? [];
  const doctors = doctorsResult?.data ?? [];

  useEffect(() => {
    if (!activeDoctorTab && doctors.length > 0) {
      const firstId = doctors[0].badge_id || doctors[0].id;
      if (firstId) setActiveDoctorTab(firstId);
    }
  }, [doctors, activeDoctorTab]);

  const currentDoctor = doctors.find((d) => d.id === activeDoctorTab || d.badge_id === activeDoctorTab) || doctors[0];
  const pendingQueue = bookings.filter((b) => b.status === "pending" || !b.status);

  const getDepartmentMismatchForBooking = (booking: BookingRecord | null) => {
    if (!booking?.normalized_reason || !currentDoctor) return false;
    const targetDept = SPECIALTY_ROUTING_MAP[booking.normalized_reason as keyof typeof SPECIALTY_ROUTING_MAP];
    return targetDept && currentDoctor.specialty !== targetDept;
  };

  const dispatchToSlot = (hour: string) => {
    if (!selectedPatient || !currentDoctor) return;
    const targetDocId = currentDoctor.badge_id || currentDoctor.id;
    if (getDepartmentMismatchForBooking(selectedPatient)) return;

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

  return {
    bookings, doctors, pendingQueue,
    isLoading: tableQuery?.isLoading || doctorsQuery?.isLoading,
    selectedPatient, setSelectedPatient, activeDoctorTab, setActiveDoctorTab,
    currentDoctor, isDepartmentMismatch: getDepartmentMismatchForBooking(selectedPatient),
    getDepartmentMismatchForBooking, handleStatusUpdate: updateBookingStatus,
    handleDoctorAvailabilityUpdate, dispatchToSlot, selectedDate, setSelectedDate
  };
}