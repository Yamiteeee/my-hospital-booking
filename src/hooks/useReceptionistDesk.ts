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
  doctorId: string | null;   // Stays for frontend backwards compatibility 
  badge_id: string | null;   // 🌟 ADDED: Relates directly to your new database structural primary key
  timeSlot: string | null;
  preferredDate?: string;
}

export interface Doctor {
  badge_id: string; // 🌟 CHANGED: Replaced 'id' with your custom string 'badge_id' (e.g. 'DOC-1')
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

  // 2. Live-fetch doctors from Supabase
  const { result: doctorsResult, query: doctorsQuery } = useList<Doctor>({
    resource: "doctors",
    pagination: { mode: "off" } 
  });

  const { mutate } = useUpdate();

  // Pure data streams from the server mapped via your platform wrappers
  const bookings = tableQuery?.data?.data ?? [];
  const doctors = doctorsResult?.data ?? [];
  const isLoading = tableQuery?.isLoading || doctorsQuery?.isLoading;

  const handleDispatchAppointment = (
    id: string, 
    doctorBadgeId: string, // 🌟 UPDATED: Expecting 'DOC-1' style badge strings
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
          badge_id: doctorBadgeId, // 🌟 UPDATED: Sends to your updated database relationship key
          doctorId: doctorBadgeId, // Keeps fallback populated if your table still queries both
          timeSlot: timeSlot,
          preferredDate: preferredDate
        },
        mutationMode: "optimistic",
      },
      {
        onSuccess: () => {
          if (onSuccessCallback) onSuccessCallback();
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