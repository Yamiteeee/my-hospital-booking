"use client";

import { useState } from "react";
import { useGetIdentity, useLogout, useList, useUpdate, useCreate, useDelete } from "@refinedev/core";
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
  const { mutate: deleteLeave } = useDelete(); 
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  
  const { data: identity, isLoading: identityLoading } = useGetIdentity<UseDoctorIdentity>();

  // Get the normalized active doctor ID string
  const activeDoctorId = (identity?.badge_id || identity?.id || "").toUpperCase();

  // 🚀 TRUE REAL-TIME FIXED:
  // We filter ONLY by this doctor's ID. When doctorId becomes null on the server,
  // it instantly drops out of this subscription channel, forcing an immediate UI removal!
  const { result: bookingsResult, query: bookingsQuery } = useList<BookingRecord>({
    resource: "bookings",
    filters: [
      { field: "doctorId", operator: "eq", value: activeDoctorId },
      { field: "preferredDate", operator: "eq", value: selectedDate }
    ],
    queryOptions: { 
      enabled: !!activeDoctorId,
    },
    liveMode: "auto",
  });

  // 🚀 REAL-TIME: Stream updates to this doctor's core profile record
  const { result: doctorInfo, query: doctorQuery } = useList<Doctor>({
    resource: "doctors",
    filters: [{ field: "badge_id", operator: "eq", value: activeDoctorId }],
    queryOptions: { enabled: !!activeDoctorId },
    liveMode: "auto",
  });

  // 🚀 REAL-TIME: Fetch and live-update upcoming leaves for this doctor
  const { result: leavesResult, query: leavesQuery } = useList({
    resource: "leaves",
    filters: [{ field: "badge_id", operator: "eq", value: activeDoctorId }],
    queryOptions: { enabled: !!activeDoctorId },
    liveMode: "auto",
  });

  const currentDoctor = doctorInfo?.data?.[0];

  // ⚡ SIMPLIFIED CLEAN ARRAY RENDERING:
  // Since the real-time server filter guarantees only this doctor's current day bookings 
  // live in this array, we just pass the data straight through.
  const dailyAppointments = bookingsResult?.data || [];

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

  const setOffWorkHour = async (hour: string | null) => {
    const doctorIdentifier = currentDoctor?.id || currentDoctor?.badge_id || activeDoctorId;
    if (!doctorIdentifier) return;

    updateDoctor({
      resource: "doctors",
      id: doctorIdentifier,
      values: { off_work_hour: hour },
      mutationMode: "optimistic",
      successNotification: () => ({
        message: hour ? `Off-work cutoff time configured for ${hour}` : "Off-work configuration cleared",
        type: "success"
      })
    });
  };

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

  const cancelLeave = (leaveId: string) => {
    deleteLeave({
      resource: "leaves",
      id: leaveId,
      mutationMode: "optimistic",
      successNotification: () => ({
        message: "Leave Cancelled. Roster Restored.",
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
    dailyAppointments, 
    doctorLeaves: leavesResult?.data || [], 
    handleEndShift,
    handleStatusUpdate: updateBookingStatus,
    toggleBreak,
    requestLeave, 
    cancelLeave,
    setOffWorkHour,
  };
}