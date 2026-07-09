"use client";

import { useState } from "react";
import { useList } from "@refinedev/core";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { BookingFormData, Doctor } from "@/types";

export function useRefineFormSubmission() {
  const { submitNewBooking } = useBookingOperations();
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState<BookingFormData>({
    patient_name: "", phone: "", department: "", urgency: "routine", preferredDate: "", preferredTime: ""
  });

  //  REAL-TIME: Keep the specialty mapping options synced automatically
  const { result, query } = useList<Doctor>({
    resource: "doctors",
    pagination: { mode: "off" },
    liveMode: "auto" //  Live streams metadata to the registration dropdown
  });

  const uniqueSpecialties = Array.from(
    new Set((result?.data || []).map((doc) => doc?.specialty?.trim()).filter(Boolean))
  ).sort();

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.phone || !formData.department || !formData.preferredDate || !formData.preferredTime) return;

    submitNewBooking(
      formData.patient_name,
      formData.phone,
      `Department Target: ${formData.department}. Urgency Level: ${formData.urgency}`,
      formData.preferredDate,
      formData.preferredTime,
      {
        onSuccess: () => setBookingStep("success")
      }
    );
  };

  const resetBookingForm = () => {
    setFormData({ patient_name: "", phone: "", department: "", urgency: "routine", preferredDate: "", preferredTime: "" });
    setBookingStep("form");
    setShowQuickBook(false);
  };

  return {
    showQuickBook, setShowQuickBook, bookingStep, formData, setFormData,
    isLoading: query.isLoading, handleBookingSubmit, resetBookingForm, specialties: uniqueSpecialties
  };
}