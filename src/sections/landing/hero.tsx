"use client";

import React, { useState, useId, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, ShieldCheck, Sparkles, Stethoscope, CheckCircle2 
} from "lucide-react";
import { HospitalImages } from "@/providers/image-provider";
import { UNIQUE_DEPARTMENTS, TELEMETRY_METRICS } from "@/providers/data-providers/landingData";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

function TelemetryItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const animatedValue = useAnimatedCounter({ target });
  return (
    <div className="flex flex-col items-center sm:items-start transform-gpu transition-transform duration-200 hover:scale-[1.02]">
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
        {animatedValue.toLocaleString()}{suffix}
      </p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

interface LandingHeroProps {
  onBookNow: () => void;
}

export interface LandingHeroRef {
  triggerQuickBook: () => void;
}

export const LandingHero = forwardRef<LandingHeroRef, LandingHeroProps>(({ onBookNow }, ref) => {
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    patientName: "",
    department: "",
    urgency: "routine",
    preferredDate: ""
  });

  const selectId = useId();

  // Expose function to parent via ref to handle the header action
  useImperativeHandle(ref, () => ({
    triggerQuickBook: () => {
      setShowQuickBook(true);
      setTimeout(() => {
        const targetElement = document.getElementById("booking-form-anchor");
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 60);
    }
  }));

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.department || !formData.preferredDate) return;
    setBookingStep("success");
  };

  const resetBookingForm = () => {
    setFormData({ patientName: "", department: "", urgency: "routine", preferredDate: "" });
    setBookingStep("form");
    setShowQuickBook(false);
  };

  return (
    <section id="intake" className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-20 lg:pt-24 lg:pb-24 grid lg:grid-cols-12 gap-16 items-start relative z-10">
      <div className="space-y-8 text-center lg:text-left lg:col-span-7 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 shadow-sm text-blue-700 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" /> 
          <span className="text-blue-500/80 font-medium">Assistant Gateway</span> Instant Intake Allocation
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
          One-Click Request. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
            Managed by Experts.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
          Submit your medical appointment booking instantly. Our dedicated Virtual Assistants and clinical reception desk will screen your files and route you seamlessly to the right specialist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
          <Button 
            size="lg" 
            onClick={onBookNow}
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 text-sm font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all duration-150 transform hover:-translate-y-0.5 gap-2 group transform-gpu"
          >
            Launch Standard Booking Portal
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => setShowQuickBook(!showQuickBook)}
            className={`px-8 py-6 text-sm font-bold rounded-xl transition-all duration-150 shadow-sm border-slate-200 transform-gpu ${showQuickBook ? 'bg-blue-50 text-blue-600 border-blue-200 scale-[0.98]' : 'bg-white hover:bg-slate-50 text-slate-600 hover:-translate-y-0.5'}`}
          >
            {showQuickBook ? "Cancel Quick Form" : "1-Click Express Booking Request"}
          </Button>
        </div>

        <div id="booking-form-anchor" className="scroll-mt-24">
          {showQuickBook && (
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
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800 transition-colors duration-150"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor={selectId} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Specialty Wing</label>
                      <select 
                        id={selectId}
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800 transition-colors duration-150"
                      >
                        <option value="">Select Wing...</option>
                        {UNIQUE_DEPARTMENTS.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
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

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2 text-xs py-5 shadow-md transition-all duration-150 transform active:scale-[0.99] transform-gpu">
                    Send Request to Reception Desk
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
          )}
        </div>

        <div id="telemetry" className="pt-10 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-center sm:text-left">
          {TELEMETRY_METRICS.map((metric, idx) => (
            <TelemetryItem key={idx} target={metric.target} suffix={metric.suffix} label={metric.label} />
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 relative w-full h-[420px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 p-2 bg-slate-50 animate-in fade-in zoom-in-95 duration-300 ease-out will-change-transform transform-gpu">
        <div className="relative w-full h-full rounded-2xl overflow-hidden group">
          <Image 
            src={HospitalImages.heroBackground} 
            alt="Premium Modern Clinical Campus Architecture"
            fill
            priority={true}
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 460px"
            className="object-cover scale-[1.01] filter brightness-[0.97] group-hover:scale-105 transition-transform duration-300 ease-out will-change-transform transform-gpu"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 border border-slate-200 shadow-xl flex items-center gap-4 transform hover:scale-[1.02] transition-transform duration-150 will-change-transform transform-gpu">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-900 tracking-tight">MedVA Co-Pilot Active</p>
              <p className="text-[10px] text-slate-500 font-medium">Streamlined Receptionist Workflow Automation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

LandingHero.displayName = "LandingHero";