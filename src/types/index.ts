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

//  RECONCILED: Matches the Supabase status check constraints and your hook properties
export interface BookingRecord {
  id: string;
  patient_name: string;
  phone: string;
  reason: string;
  normalized_reason?: string;
  status: "pending" | "confirmed" | "cancelled" | "checked_in" | "present" | "completed";
  doctorId: string | null;   
  badge_id: string | null;   
  timeSlot: string | null;
  preferredDate?: string;
  completed_at?: string | null; 
}

// Alias to maintain full backward compatibility with any older visual components referencing 'Booking'
export type Booking = BookingRecord;

//  RECONCILED: Includes availability status fields to fix component rendering tracks
export interface Doctor {
  id: string;
  badge_id: string; // Made standard for matching operations
  name: string;
  specialty: string;
  breaks: string[];
  availability_status: "available" | "lunch_break" | "rest_time" | "early_out"; 
  profiles?: {
    name: string;
  };
  off_work_hour?: string | null;
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