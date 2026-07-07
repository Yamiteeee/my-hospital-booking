"use client";

import { useState } from "react";
import { useCreate, useList } from "@refinedev/core";
import { normalizeIncomingReason } from "@/utils/normalization";
import { BookingFormData, Doctor } from "@/types";

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

  const { result, query } = useList<Doctor>({
    resource: "doctors",
    pagination: { mode: "off" }
  });

  const rawDoctorsList = result?.data || [];

  const uniqueSpecialties = Array.from(
    new Set(
      rawDoctorsList
        .map((doc: any) => {
          if (!doc) return null;
          const value = doc.specialty || doc.Specialty || "";
          return typeof value === "string" ? value.trim() : null;
        })
        .filter((specialty): specialty is string => !!specialty)
    )
  ).sort();

  const { mutate, mutation } = useCreate();
  const isLoading = mutation.isPending || query.isLoading;

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 🌟 UPDATED: Ensure submission is blocked if phone value isn't supplied
    if (!formData.patient_name || !formData.phone || !formData.department || !formData.preferredDate || !formData.preferredTime) return;

    const calculatedToken = normalizeIncomingReason(formData.department);

    mutate(
      {
        resource: "bookings",
        values: {
          patient_name: formData.patient_name,
          phone: formData.phone.trim(), // 🌟 FIXED: Passes the user input phone value directly to Supabase
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
          console.error("❌ Refine booking submit failed!", err?.message);
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
    resetBookingForm,
    specialties: uniqueSpecialties
  };
}