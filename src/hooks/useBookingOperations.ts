"use client";

import { useCreate, useUpdate } from "@refinedev/core";
import { normalizeIncomingReason } from "@/utils/normalization";
import { BookingRecord } from "@/types";

export function useBookingOperations() {
  const { mutate: createMutation } = useCreate();
  const { mutate: updateMutation } = useUpdate();

  // Unified payload structure for patient creation (Chatbot & Quick Form)
  const submitNewBooking = (
    patientName: string,
    phone: string,
    rawReason: string,
    date: string,
    time: string,
    callbacks?: { onSuccess?: () => void; onError?: (err: any) => void }
  ) => {
    createMutation({
      resource: "bookings",
      values: {
        patient_name: patientName,
        phone: phone.trim(),
        reason: `${rawReason}. Target Window: ${date} @ ${time}`,
        normalized_reason: normalizeIncomingReason(rawReason),
        status: "pending",
        created_at: new Date().toISOString(),
      },
    }, callbacks);
  };

  // Unified payload updater for processing booking queue states
  const updateBookingStatus = (id: string, nextStatus: BookingRecord["status"]) => {
    const values: Record<string, any> = { status: nextStatus };
    if (nextStatus === "completed") {
      values.completed_at = new Date().toISOString();
    }

    updateMutation({
      resource: "bookings",
      id,
      values,
      mutationMode: "optimistic",
    });
  };

  // Unified payload configuration for calendar grid scheduling
  const dispatchToDoctorSlot = (
    id: string,
    doctorBadgeId: string,
    timeSlot: string,
    preferredDate: string,
    onSuccessCallback?: () => void
  ) => {
    updateMutation({
      resource: "bookings",
      id,
      values: {
        status: "pending",
        doctorId: doctorBadgeId,
        timeSlot: timeSlot,
        preferredDate: preferredDate,
      },
      mutationMode: "optimistic",
    }, {
      onSuccess: () => {
        if (onSuccessCallback) onSuccessCallback();
      }
    });
  };

  return { submitNewBooking, updateBookingStatus, dispatchToDoctorSlot };
}