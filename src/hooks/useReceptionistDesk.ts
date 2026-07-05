"use client";

import { useEffect } from "react";
import { useTable, useUpdate } from "@refinedev/core";
//  Import your strict mapping token contract
import { NormalizedReason } from "@/utils/normalization";

export interface BookingRecord {
  id: string;
  patient_name: string;
  phone: string;
  reason: string;
  //  STRUCTURAL CONFORMANCE: Add the normalized reason layer to the row interface
  normalized_reason?: NormalizedReason;
  status: "pending" | "confirmed" | "cancelled" | "checked-in";
  doctorId: string | null;
  timeSlot: string | null; // e.g., "09:00", "14:00"
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  breaks: string[]; // array of blocked hour strings, e.g. ["12:00", "13:00"]
}

export const CLINIC_DOCTORS: Doctor[] = [
  { id: "doc-1", name: "Dr. Sarah Jenkins", specialty: "Cardiology", breaks: ["12:00"] },
  { id: "doc-2", name: "Dr. Marcus Vance", specialty: "Neurology", breaks: ["13:00"] },
  { id: "doc-3", name: "Dr. Elena Rostova", specialty: "General Triage", breaks: ["12:00", "12:30"] },
];

export const OPERATIONAL_HOURS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

export function useReceptionistDesk() {
  const { tableQuery, result } = useTable<BookingRecord>({
    resource: "bookings",
    sorters: { initial: [{ field: "created_at", order: "desc" }] }
  });

  const { mutate } = useUpdate();

  useEffect(() => {
    const handleRefresh = () => { tableQuery.refetch(); };
    window.addEventListener("local-data-update", handleRefresh);
    return () => { window.removeEventListener("local-data-update", handleRefresh); };
  }, [tableQuery]);

  const bookings = result?.data ?? [];
  const isLoading = tableQuery?.isLoading ?? false;

  const handleDispatchAppointment = (id: string, doctorId: string, timeSlot: string) => {
    mutate({
      resource: "bookings",
      id: id,
      values: { 
        status: "confirmed",
        doctorId: doctorId,
        timeSlot: timeSlot
      },
      mutationMode: "optimistic",
    });
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
    isLoading,
    handleStatusUpdate,
    handleDispatchAppointment
  };
}