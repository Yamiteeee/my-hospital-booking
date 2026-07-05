import { useState } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { useReceptionistDesk, CLINIC_DOCTORS, BookingRecord } from "@/hooks/useReceptionistDesk";
import { SPECIALTY_ROUTING_MAP } from "@/utils/normalization";

export function useDispatchEngine() {
  const { data: authStatus, isPending: authChecking } = useIsAuthenticated();
  const { bookings, isLoading, handleStatusUpdate, handleDispatchAppointment } = useReceptionistDesk();
  
  const [selectedPatient, setSelectedPatient] = useState<BookingRecord | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = useState<string>(CLINIC_DOCTORS[0].id);

  // Find active physician
  const currentDoctor = CLINIC_DOCTORS.find(d => d.id === activeDoctorTab) || CLINIC_DOCTORS[0];

  // Unified Security Lookup for selected patient
  const targetSpecialty = selectedPatient?.normalized_reason 
    ? SPECIALTY_ROUTING_MAP[selectedPatient.normalized_reason] 
    : null;
    
  const isDepartmentMismatch = targetSpecialty !== null && currentDoctor.specialty !== targetSpecialty;

  // Pending queue filtering
  const pendingQueue = bookings.filter(b => b.status === "pending" || !b.status);

  // Utility to verify matching specialties for any row allocation
  const getDepartmentMismatchForBooking = (booking: BookingRecord | undefined) => {
    if (!booking?.normalized_reason) return null;
    const filledDept = SPECIALTY_ROUTING_MAP[booking.normalized_reason];
    return filledDept !== null && currentDoctor.specialty !== filledDept;
  };

  const dispatchToSlot = (hour: string) => {
    if (!selectedPatient || isDepartmentMismatch) return;
    handleDispatchAppointment(selectedPatient.id, currentDoctor.id, hour);
    setSelectedPatient(null);
  };

  return {
    isAuthenticated: authStatus?.authenticated ?? false,
    authChecking,
    bookings,
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
    dispatchToSlot
  };
}