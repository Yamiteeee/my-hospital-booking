import React from "react";

// --- Form & Booking Domain Types ---
export interface BookingFormData {
  patient_name: string;
  phone: string;       
  department: string;
  preferredDate: string;
  preferredTime: string;
  urgency: string;
  doctorId?: string; // 🌟 FIXED: Added this so your form components can look up doctor selections safely!
}

export interface Patient {
  id: string;
  patient_name: string;
  phone: string;
  reason: string;
  normalized_reason?: string;
}

export interface Booking {
  id: string;
  doctorId: string;
  timeSlot: string;
  patient_name: string;
  reason: string;
  status: "pending" | "checked-in" | "cancelled";
}

export interface Doctor {
 id: string;
  badge_id?: string; // 🌟 Support both column naming conventions safely
  name?: string;
  specialty: string;
  breaks: string[];
  profiles?: {
    name: string;
  };
}

// --- Component Prop Types ---
export interface QuickBookingFormProps {
  showQuickBook: boolean;
  bookingStep: "form" | "success";
  formData: BookingFormData;
  // Using React.SetStateAction generic ensures custom hook state and local useState bindings both pass perfectly
  setFormData: React.Dispatch<React.SetStateAction<any>>; 
  isLoading: boolean;
  handleBookingSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetBookingForm: () => void;
  selectId: string;
}

// --- Chatbot Domain Types ---
export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export type ChatbotStep = "name" | "phone" | "reason" | "date" | "time" | "complete";

export interface ChatbotBookingData {
  patient_name: string;
  phone: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
}