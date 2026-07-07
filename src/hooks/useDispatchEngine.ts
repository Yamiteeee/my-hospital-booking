"use client";

import { useState, useEffect } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { useReceptionistDesk, BookingRecord } from "@/hooks/useReceptionistDesk";
import { SPECIALTY_ROUTING_MAP } from "@/utils/normalization";

export function useDispatchEngine() {
  const { data: authStatus, isPending: authChecking } = useIsAuthenticated();
  
  const { 
    bookings, 
    doctors, 
    isLoading, 
    handleStatusUpdate, 
    handleDoctorAvailabilityUpdate, // 🌟 Pull hook reference 
    handleDispatchAppointment 
  } = useReceptionistDesk();
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedPatient, setSelectedPatient] = useState<BookingRecord | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = useState<string>(""); 

  useEffect(() => {
    if (!activeDoctorTab && doctors && doctors.length > 0) {
      const firstDoctorId = (doctors[0] as any).id || (doctors[0] as any).badge_id;
      if (firstDoctorId) {
        setActiveDoctorTab(firstDoctorId);
      }
    }
  }, [doctors, activeDoctorTab]);

  // Match current doctor profile safely
  const currentDoctor = doctors.find((d: any) => d.id === activeDoctorTab || d.badge_id === activeDoctorTab) 
    || doctors[0] 
    || { id: "", badge_id: "", name: "", specialty: "", breaks: [], availability_status: "available" };

  const targetSpecialty = selectedPatient?.normalized_reason 
    ? SPECIALTY_ROUTING_MAP[selectedPatient.normalized_reason as keyof typeof SPECIALTY_ROUTING_MAP] 
    : null;
    
  const isDepartmentMismatch = targetSpecialty !== null && currentDoctor.specialty !== targetSpecialty;

  const pendingQueue = bookings.filter((b: BookingRecord) => b.status === "pending" || !b.status);

  const getDepartmentMismatchForBooking = (booking: BookingRecord | undefined) => {
    if (!booking?.normalized_reason) return null;
    const filledDept = SPECIALTY_ROUTING_MAP[booking.normalized_reason as keyof typeof SPECIALTY_ROUTING_MAP];
    return filledDept !== null && currentDoctor.specialty !== filledDept;
  };

  const dispatchToSlot = (hour: string) => {
    if (!selectedPatient || isDepartmentMismatch) return;
    
    const targetDoctorIdentifier = currentDoctor.badge_id || currentDoctor.id || (currentDoctor as any).id;
    
    if (!targetDoctorIdentifier) {
      console.error("Critical: Could not resolve a valid doctor identifier string.");
      return;
    }
    
    handleDispatchAppointment(
      selectedPatient.id, 
      targetDoctorIdentifier, 
      hour, 
      selectedDate,
      () => {
        setSelectedPatient(null);
      }
    );
  };

  return {
    isAuthenticated: authStatus?.authenticated ?? false,
    authChecking,
    bookings,
    doctors, 
    pendingQueue,
    isLoading,
    selectedPatient,
    setSelectedPatient,
    activeDoctorTab, 
    setActiveDoctorTab,
    currentDoctor,
    targetSpecialty,
    isDepartmentMismatch,
    getDepartmentMismatchForBooking,
    handleStatusUpdate,
    handleDoctorAvailabilityUpdate, // 🌟 Exposed clean interface proxy to parent layouts
    dispatchToSlot,
    selectedDate,
    setSelectedDate
  };
}