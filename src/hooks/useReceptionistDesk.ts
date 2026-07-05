"use client";

import { useEffect } from "react";
import { useTable, useUpdate } from "@refinedev/core";

export interface BookingRecord {
  id: string;
  patient_name: string;
  phone: string;
  reason: string;
  status: "pending" | "confirmed" | "cancelled" | "checked-in";
}

export function useReceptionistDesk() {
  const { tableQuery, result } = useTable<BookingRecord>({
    resource: "bookings",
    sorters: {
      initial: [{ field: "created_at", order: "desc" }]
    }
  });

  const { mutate } = useUpdate();

  // Listen for local changes to trigger instantaneous table updates across layout tabs
  useEffect(() => {
    const handleRefresh = () => {
      tableQuery.refetch();
    };

    window.addEventListener("local-data-update", handleRefresh);
    return () => {
      window.removeEventListener("local-data-update", handleRefresh);
    };
  }, [tableQuery]);

  const bookings = result?.data ?? [];
  const isLoading = tableQuery?.isLoading ?? false;

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
    handleStatusUpdate
  };
}