"use client";

import { useState } from "react";
import { useCreate } from "@refinedev/core";
import { normalizeIncomingReason } from "@/utils/normalization";

export function useRefineFormSubmission() {
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "success">("form");
  
  const [formData, setFormData] = useState({
    patient_name: "",
    phone: "",
    department: "", // Drops in direct UI string from your select input
    urgency: "routine",
    preferredDate: ""
  });

  const { mutate, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.department || !formData.preferredDate) return;

    //  UNIFIED PIPELINE: Use the exact same engine as the chatbot!
    const calculatedToken = normalizeIncomingReason(formData.department);

    mutate(
      {
        resource: "bookings",
        values: {
          patient_name: formData.patient_name,
          phone: formData.phone || "N/A (Web Portal Intake)",
          reason: `Department Target: ${formData.department}. Urgency level: ${formData.urgency}. Target Date: ${formData.preferredDate}`,
          normalized_reason: calculatedToken, // Secure relational row binding
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
    setFormData({ patient_name: "", phone: "", department: "", urgency: "routine", preferredDate: "" });
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