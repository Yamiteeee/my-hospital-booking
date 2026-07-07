"use client";

import { useState } from "react";
import { useCreate } from "@refinedev/core";
import { normalizeIncomingReason } from "@/utils/normalization";
import { BookingFormData } from "@/types";

export function useRefineFormSubmission() {
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "success">("form");
  
  const [formData, setFormData] = useState<BookingFormData>({
    patient_name: "",
    phone: "",
    department: "", 
    urgency: "routine",
    preferredDate: "",
    preferredTime: ""
  });

  const { mutate, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.department || !formData.preferredDate || !formData.preferredTime) return;

    const calculatedToken = normalizeIncomingReason(formData.department);

    mutate(
      {
        resource: "bookings",
        values: {
          patient_name: formData.patient_name,
          phone: formData.phone || "N/A (Web Portal Intake)",
          reason: `Department Target: ${formData.department}. Urgency level: ${formData.urgency}. Target Window: ${formData.preferredDate} @ ${formData.preferredTime}`,
          normalized_reason: calculatedToken, 
          status: "pending",
          created_at: new Date().toISOString()
        }
      },
      {
        onSuccess: () => {
          setBookingStep("success");
        },
        onError: (err: any) => {
          // Expose the deep structure of the database / API response error
          console.error("❌ Refine booking submit failed!");
          console.error("Message:", err?.message);
          console.error("Details:", err?.response?.data || err?.body || err);
        }
      }
    );
  };

  const resetBookingForm = () => {
    setFormData({ 
      patient_name: "", 
      phone: "", 
      department: "", 
      urgency: "routine", 
      preferredDate: "",
      preferredTime: "" 
    });
    setBookingStep("form");
    setShowQuickBook(false);
  };

  return {
    showQuickBook,
    setShowQuickBook,
    bookingStep,
    formData,
    setFormData,
    isLoading, 
    handleBookingSubmit,
    resetBookingForm
  };
}