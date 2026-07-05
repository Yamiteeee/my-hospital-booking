"use client";

import { useState } from "react";
import { useCreate } from "@refinedev/core";
import { normalizeIncomingReason } from "@/utils/normalization";
import { BookingFormData } from "@/types"; // Import type to keep state fully verified

export function useRefineFormSubmission() {
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "success">("form");
  
  // Explicitly typing this ensures your state hook matches the types contract perfectly
  const [formData, setFormData] = useState<BookingFormData>({
    patient_name: "",
    phone: "",
    department: "", 
    urgency: "routine",
    preferredDate: "",
    preferredTime: "" // <-- 1. Added Preferred Time to State
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
          // <-- 2. Injected time window into the Refine reason summary field 
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
        onError: (err) => {
          console.error("Refine booking submit failed:", err);
        }
      }
    );
  };

  const resetBookingForm = () => {
    // <-- 3. Cleaned state resetting variables
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