"use client";

import { useTable, useUpdate, useList } from "@refinedev/core";
import { NormalizedReason } from "@/utils/normalization";

export interface BookingRecord {
  id: string;
  patient_name: string;
  phone: string;
  reason: string;
  normalized_reason?: NormalizedReason;
  status: "pending" | "confirmed" | "cancelled" | "checked_in" | "present" | "completed";
  doctorId: string | null;   
  badge_id: string | null;   
  timeSlot: string | null;
  preferredDate?: string;
  completed_at?: string | null; 
}

export interface Doctor {
  id: string;
  badge_id: string; 
  name: string;
  specialty: string;
  breaks: string[];
  availability_status: "available" | "lunch_break" | "rest_time" | "early_out"; 
}

export const OPERATIONAL_HOURS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

export function useReceptionistDesk() {
  // 1. Live-fetch bookings from Supabase
  const { tableQuery } = useTable<BookingRecord>({
    resource: "bookings",
    sorters: { initial: [{ field: "created_at", order: "desc" }] }
  });

  // 2. Live-fetch doctors from Supabase
  const { result: doctorsResult, query: doctorsQuery } = useList<Doctor>({
    resource: "doctors",
    pagination: { mode: "off" } 
  });

  const { mutate } = useUpdate();

  const bookings = tableQuery?.data?.data ?? [];
  const doctors = doctorsResult?.data ?? [];
  const isLoading = tableQuery?.isLoading || doctorsQuery?.isLoading;



const handleDispatchAppointment = (
    id: string, 
    doctorBadgeId: string, 
    timeSlot: string, 
    preferredDate: string,
    onSuccessCallback?: () => void
  ) => {
    mutate(
      {
        resource: "bookings",
        id: id,
        values: { 
          status: "pending", // 🌟 CHANGED from "confirmed" to match your database check constraints
          doctorId: doctorBadgeId, 
          timeSlot: timeSlot,      
          preferredDate: preferredDate 
        },
        mutationMode: "optimistic",
      },
      {
        onSuccess: () => {
          if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
          console.error("Critical dispatch error caught during transaction payload sync:", error);
        }
      }
    );
  };

  
  // Automatically builds/injects full ISO strings when consultation finishes
  const handleStatusUpdate = (id: string, nextStatus: BookingRecord["status"]) => {
    const updateValues: Record<string, any> = { status: nextStatus };

    if (nextStatus === "completed") {
      updateValues.completed_at = new Date().toISOString();
    }

    mutate({
      resource: "bookings",
      id: id,
      values: updateValues,
      mutationMode: "optimistic",
    });
  };

  // Modifies a doctor's duty availability status flags
  const handleDoctorAvailabilityUpdate = (doctorId: string, nextAvailability: Doctor["availability_status"]) => {
    mutate({
      resource: "doctors",
      id: doctorId,
      values: { availability_status: nextAvailability },
      mutationMode: "optimistic",
    });
  };

  return {
    bookings,
    doctors, 
    isLoading,
    handleStatusUpdate,
    handleDoctorAvailabilityUpdate, 
    handleDispatchAppointment 
  };
}