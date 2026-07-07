"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Stethoscope, CheckCircle2 } from "lucide-react";
import { QuickBookingFormProps } from "@/types";

const FORM_TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM"
];

interface DynamicQuickBookingFormProps extends QuickBookingFormProps {
  specialties?: string[];
}

export function QuickBookingForm({
  showQuickBook,
  bookingStep,
  formData,
  setFormData,
  isLoading,
  handleBookingSubmit,
  resetBookingForm,
  selectId,
  specialties = [], 
}: DynamicQuickBookingFormProps) {
  if (!showQuickBook) return null;

  return (
    <div className="mt-6 p-6 bg-white border border-blue-100 rounded-3xl shadow-xl text-left animate-in fade-in slide-in-from-top-2 duration-150 ease-out relative overflow-hidden will-change-transform transform-gpu">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
      
      {bookingStep === "form" ? (
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-blue-600" /> Direct Assistant Dispatch Intake
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Full Name</label>
              <input 
                type="text" 
                required
                placeholder="John Doe"
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800 transition-colors duration-150"
              />
            </div>
          {/* 🌟 FULLY EXPLICIT WINGS DROPDOWN */}
          <div className="space-y-1">
            <label htmlFor={selectId} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Specialty Wing</label>
            <select 
              id={selectId}
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800 transition-colors duration-150"
            >
              <option value="">
                {(!specialties || specialties.length === 0) ? "Loading Wings..." : "Select Wing..."}
              </option>
              {specialties && specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requested Date</label>
              <input 
                type="date" 
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Time Window</label>
              <select 
                required
                value={formData.preferredTime || ""}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800 transition-colors duration-150"
              >
                <option value="">Select Target Time...</option>
                {FORM_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urgency Status</label>
              <select 
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800 transition-colors duration-150"
              >
                <option value="routine">Routine Check-Up</option>
                <option value="urgent">Urgent Follow-Up</option>
              </select>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2 text-xs py-5 shadow-md transition-all duration-150 transform active:scale-[0.99] transform-gpu">
            {isLoading ? "Dispatching Intake..." : "Send Request to Reception Desk"}
          </Button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-150">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">Request Dispatched to MedVA Queue</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Our administrative assistants are matching your file options against physician timetables right now.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={resetBookingForm} className="text-xs px-4 py-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Dismiss Form
          </Button>
        </div>
      )}
    </div>
  );
}