"use client";

import { useState } from "react";
import { useGetIdentity, useLogout, useList, useUpdate, useCreate } from "@refinedev/core";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { useRouter } from "next/navigation";
import { BookingRecord, Doctor } from "@/types";

export interface UseDoctorIdentity {
  id?: string;
  badge_id?: string;
  name: string;
}

export function useDoctor() {
  const router = useRouter();
  const { updateBookingStatus } = useBookingOperations();
  const { mutate: logout } = useLogout();
  const { mutate: updateDoctor } = useUpdate();
  const { mutate: createLeave } = useCreate(); 
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const { data: identity, isLoading: identityLoading } = useGetIdentity<UseDoctorIdentity>();

  const activeDoctorId = (identity?.badge_id || identity?.id || "").toUpperCase();

  // Load ONLY appointments dispatched directly to this doctor
  const { result: bookingsResult, query: bookingsQuery } = useList<BookingRecord>({
    resource: "bookings",
    filters: [
      { field: "doctorId", operator: "eq", value: activeDoctorId },
      { field: "preferredDate", operator: "eq", value: selectedDate },
      { field: "status", operator: "ne", value: "cancelled" }
    ],
    queryOptions: { enabled: !!activeDoctorId }
  });

  const { result: doctorInfo, query: doctorQuery } = useList<Doctor>({
    resource: "doctors",
    filters: [{ field: "badge_id", operator: "eq", value: activeDoctorId }],
    queryOptions: { enabled: !!activeDoctorId }
  });

  // Fetch upcoming leaves for this doctor
  const { result: leavesResult, query: leavesQuery } = useList({
    resource: "leaves",
    filters: [{ field: "badge_id", operator: "eq", value: activeDoctorId }],
    queryOptions: { enabled: !!activeDoctorId }
  });

  const currentDoctor = doctorInfo?.data?.[0];

  const toggleBreak = async (hour: string) => {
    const doctorIdentifier = currentDoctor?.id || currentDoctor?.badge_id || activeDoctorId;
    if (!doctorIdentifier) return;

    const currentBreaks = (currentDoctor?.breaks as string[]) || [];
    let updatedBreaks: string[];

    if (currentBreaks.includes(hour)) {
      updatedBreaks = currentBreaks.filter((b) => b !== hour);
    } else {
      updatedBreaks = [...currentBreaks, hour];
    }

    updateDoctor({
      resource: "doctors",
      id: doctorIdentifier,
      values: { breaks: updatedBreaks },
    });
  };

  // 🌟 Dynamic Off-Work Selection Function
  const setOffWorkHour = async (hour: string | null) => {
    const doctorIdentifier = currentDoctor?.id || currentDoctor?.badge_id || activeDoctorId;
    if (!doctorIdentifier) return;

    updateDoctor({
      resource: "doctors",
      id: doctorIdentifier,
      values: { off_work_hour: hour }, // Stores string (e.g. "14:00") or null
      mutationMode: "optimistic",
      successNotification: () => ({
        message: hour ? `Off-work cutoff time configured for ${hour}` : "Off-work configuration cleared",
        type: "success"
      })
    });
  };

  // Dynamic Leave Request Function
  const requestLeave = (dateString: string, reason: string = "Personal Leave") => {
    if (!activeDoctorId) return;
    
    createLeave({
      resource: "leaves",
      values: {
        badge_id: activeDoctorId,
        leave_date: dateString,
        reason: reason
      },
      successNotification: () => ({
        message: "Leave Scheduled Successfully",
        type: "success"
      })
    });
  };

  const handleEndShift = () => {
    logout({}, {
      onSuccess: () => {
        router.push("/login");
        router.refresh();
      }
    });
  };

  return {
    identity,
    identityLoading: identityLoading || bookingsQuery.isLoading || doctorQuery.isLoading || leavesQuery.isLoading,
    selectedDate,
    setSelectedDate,
    currentDoctor: currentDoctor || { badge_id: activeDoctorId, name: identity?.name || "Physician Staff", specialty: "General Clinic", breaks: [], off_work_hour: null },
    dailyAppointments: bookingsResult?.data || [],
    doctorLeaves: leavesResult?.data || [], 
    handleEndShift,
    handleStatusUpdate: updateBookingStatus,
    toggleBreak,
    requestLeave, 
    setOffWorkHour, // 🌟 Exposed the off-work configuration method
  };
}