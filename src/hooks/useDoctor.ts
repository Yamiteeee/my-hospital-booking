"use client";

import { useState, useEffect, useRef } from "react";
import { useGetIdentity, useLogout, useList, useUpdate, useCreate, useDelete } from "@refinedev/core";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { useRouter } from "next/navigation";
import { BookingRecord, Doctor } from "@/types";
import { supabaseClient } from "@/providers/Supabase/Client";

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
  
  // 🎯 SOURCE OF TRUTH STATE: Safe from React Query's internal auto-refetch cache loops
  const [dailyAppointments, setDailyAppointments] = useState<BookingRecord[]>([]);
  const isInitialLoad = useRef<Record<string, boolean>>({});

  const { data: identity, isLoading: identityLoading } = useGetIdentity<UseDoctorIdentity>();

  // Get the normalized active doctor ID string
  const activeDoctorId = (identity?.badge_id || identity?.id || "").toUpperCase();

  // Baseline fetch - NO liveMode here. We handle streaming explicitly to avoid cache collisions.
  const { result: bookingsResult, query: bookingsQuery } = useList<BookingRecord>({
    resource: "bookings",
    filters: [
      { field: "doctorId", operator: "eq", value: activeDoctorId },
      { field: "preferredDate", operator: "eq", value: selectedDate }
    ],
    queryOptions: { 
      enabled: !!activeDoctorId,
    }
  });

  // Track calendar date changes and sync initial data payload exactly once per date switch
  const cacheKey = `${activeDoctorId}-${selectedDate}`;
  useEffect(() => {
    if (bookingsResult?.data && !isInitialLoad.current[cacheKey]) {
      setDailyAppointments(bookingsResult.data);
      isInitialLoad.current[cacheKey] = true;
    }
  }, [bookingsResult, cacheKey]);

  // Reset tracking flag if the date shifts
  useEffect(() => {
    if (activeDoctorId) {
      isInitialLoad.current[cacheKey] = false;
      bookingsQuery.refetch().then((res) => {
        if (res.data?.data) setDailyAppointments(res.data.data);
      });
    }
  }, [selectedDate, activeDoctorId]);

  // 🔥 EXPLICIT EVENT BROADCASTER LAYER
  useEffect(() => {
    if (!activeDoctorId) return;

    const channel = supabaseClient
      .channel(`doctor-bookings-stream-${activeDoctorId}-${selectedDate}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          const oldRecord = payload.old as Partial<BookingRecord>;
          const newRecord = payload.new as BookingRecord;

          // Action 1: Row hard deleted on database level
          if (payload.eventType === "DELETE") {
            setDailyAppointments((prev) => prev.filter((b) => b.id !== oldRecord.id));
            return;
          }

          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            const belongsToMe = 
              newRecord.doctorId?.toUpperCase() === activeDoctorId && 
              newRecord.preferredDate === selectedDate;

            if (belongsToMe) {
              setDailyAppointments((prev) => {
                const exists = prev.some((b) => b.id === newRecord.id);
                if (exists) {
                  return prev.map((b) => (b.id === newRecord.id ? newRecord : b));
                }
                return [...prev, newRecord];
              });
            } else {
              // ⚡ INSTANT EVICTION: Handles doctorId reassignment or setting to null
              setDailyAppointments((prev) => prev.filter((b) => b.id !== newRecord.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [activeDoctorId, selectedDate]);

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

  const cancelLeave = (leaveId: string | number) => {
    console.log("🚀 cancelLeave real-time execution wrapper. Target ID:", leaveId);

    if (!leaveId || leaveId === "undefined") {
      console.error("❌ Aborted! Missing leave selection target.");
      return;
    }

    const numericId = Number(leaveId);

    deleteLeave({
      resource: "leaves",
      id: numericId,
      mutationMode: "optimistic",
      successNotification: () => ({
        message: "Leave Cancelled. Schedule Restored Successfully.",
        type: "success"
      }),
      errorNotification: (error) => ({
        message: `Sync Error: ${error?.message || "Check network connections"}`,
        type: "error"
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
    dailyAppointments, // ⚡ Fed by state array tracking manual removals directly
    doctorLeaves: leavesResult?.data || [], 
    handleEndShift,
    handleStatusUpdate: updateBookingStatus,
    toggleBreak,
    requestLeave, 
    cancelLeave,
    setOffWorkHour,
  };
}