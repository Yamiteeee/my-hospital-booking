import { useState } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { useReceptionistDesk, BookingRecord, Doctor } from "@/hooks/useReceptionistDesk";
import { SPECIALTY_ROUTING_MAP } from "@/utils/normalization";

export function useDispatchEngine() {
  const { data: authStatus, isPending: authChecking } = useIsAuthenticated();
  
  // Pull dynamic doctors list right out of the hook!
  const { bookings, doctors, isLoading, handleStatusUpdate, handleDispatchAppointment } = useReceptionistDesk();
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedPatient, setSelectedPatient] = useState<BookingRecord | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = useState<string>("DOC-1"); // 🌟 UPDATED: Set string default to badge style

  // 🌟 FIXED: Changed 'd.id' to 'd.badge_id' and updated the safe fallback template object
  const currentDoctor = doctors.find((d: Doctor) => d.badge_id === activeDoctorTab) || doctors[0] || { badge_id: "", name: "", specialty: "", breaks: [] };

  const targetSpecialty = selectedPatient?.normalized_reason 
    ? SPECIALTY_ROUTING_MAP[selectedPatient.normalized_reason] 
    : null;
    
  const isDepartmentMismatch = targetSpecialty !== null && currentDoctor.specialty !== targetSpecialty;

  const pendingQueue = bookings.filter(b => b.status === "pending" || !b.status);

  const getDepartmentMismatchForBooking = (booking: BookingRecord | undefined) => {
    if (!booking?.normalized_reason) return null;
    const filledDept = SPECIALTY_ROUTING_MAP[booking.normalized_reason];
    return filledDept !== null && currentDoctor.specialty !== filledDept;
  };

  const dispatchToSlot = (hour: string) => {
    if (!selectedPatient || isDepartmentMismatch) return;
    
    // 🌟 FIXED: Changed 'currentDoctor.id' to 'currentDoctor.badge_id' to pass correct string type
    handleDispatchAppointment(
      selectedPatient.id, 
      currentDoctor.badge_id, 
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
    doctors, // Expose doctors down to UI layout components!
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
    dispatchToSlot,
    selectedDate,
    setSelectedDate
  };
}