"use client";

import React, { useId, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { HospitalImages } from "@/providers/image-provider";
import { TELEMETRY_METRICS } from "@/providers/data-providers/landingData";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { useRefineFormSubmission } from "@/hooks/useRefineFormSubmission";
import { QuickBookingForm } from "@/components/QuickBookingForm";

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
  const selectId = useId();
  
  // 🌟 FIXED: Destructured 'specialties' from your hook bundle here
  const {
    showQuickBook,
    setShowQuickBook,
    bookingStep,
    formData,
    setFormData,
    isLoading,
    handleBookingSubmit,
    resetBookingForm,
    specialties // <-- Gathered from database rows
  } = useRefineFormSubmission();

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
          <QuickBookingForm
            showQuickBook={showQuickBook}
            bookingStep={bookingStep}
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
            handleBookingSubmit={handleBookingSubmit}
            resetBookingForm={resetBookingForm}
            selectId={selectId}
            specialties={specialties} // 🌟 FIXED: Explicitly passing down the dynamic data here!
          />
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