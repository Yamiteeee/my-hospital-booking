"use client";

import { useTable, useUpdate, useList } from "@refinedev/core";
import { NormalizedReason } from "@/utils/normalization";

export interface BookingRecord {
  id: string;
  patient_name: string;
  phone: string;
  reason: string;
  normalized_reason?: NormalizedReason;
  status: "pending" | "confirmed" | "cancelled" | "checked-in";
  doctorId: string | null;   // Frontend backward compatibility reference
  badge_id: string | null;   // Maps directly to database relational configurations
  timeSlot: string | null;
  preferredDate?: string;
}

export interface Doctor {
  id: string;
  badge_id: string; // Relates to alphanumeric structural identifiers (e.g. 'doc-1')
  name: string;
  specialty: string;
  breaks: string[];
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
// 2. Live-fetch doctors from Supabase (Destructured using your version's properties)
  const { result: doctorsResult, query: doctorsQuery } = useList<Doctor>({
    resource: "doctors",
    pagination: { mode: "off" } 
  });

  const { mutate } = useUpdate();

  // Pure data streams from the server mapped via your platform wrappers
  const bookings = tableQuery?.data?.data ?? [];
  
  // 🌟 FIXED: Pulling data out of 'result' and loading state out of 'query'
  const doctors = doctorsResult?.data ?? [];
  const isLoading = tableQuery?.isLoading || doctorsQuery?.isLoading;

const handleDispatchAppointment = (
    id: string, 
    doctorBadgeId: string, // Holds the string value like 'doc-1'
    timeSlot: string, 
    preferredDate: string,
    onSuccessCallback?: () => void
  ) => {
    mutate(
      {
        resource: "bookings",
        id: id,
        values: { 
          status: "confirmed",
          doctorId: doctorBadgeId, // 🌟 FIXED: Maps directly to your 'doctorId' column string (e.g. 'doc-1')
          timeSlot: timeSlot,      // Maps to camelCase 'timeSlot'
          preferredDate: preferredDate // Maps to camelCase 'preferredDate'
          // ❌ REMOVED badge_id since it doesn't exist in your bookings table schema
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

  const handleStatusUpdate = (id: string, nextStatus: BookingRecord["status"]) => {
    mutate({
      resource: "bookings",
      id: id,
      values: { status: nextStatus },
      mutationMode: "optimistic",
    });
  };

  return {
    bookings,
    doctors, 
    isLoading,
    handleStatusUpdate,
    handleDispatchAppointment 
  };
}