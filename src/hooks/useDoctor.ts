"use client";

import { useState } from "react";
import { useGetIdentity, useLogout, useList } from "@refinedev/core";
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

  const { result: doctorInfo } = useList<Doctor>({
    resource: "doctors",
    filters: [{ field: "badge_id", operator: "eq", value: activeDoctorId }],
    queryOptions: { enabled: !!activeDoctorId }
  });

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
    identityLoading: identityLoading || bookingsQuery.isLoading,
    selectedDate,
    setSelectedDate,
    currentDoctor: doctorInfo?.data?.[0] || { badge_id: activeDoctorId, name: identity?.name || "Physician Staff", specialty: "General Clinic" },
    dailyAppointments: bookingsResult?.data || [],
    handleEndShift,
    handleStatusUpdate: updateBookingStatus,
  };
}