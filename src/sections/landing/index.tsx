"use client";

import React, { useRef } from "react";
import Image from "next/image";
import LandingHeader from "./header";
import { LandingHero, LandingHeroRef } from "./hero";
import LandingFooter from "./footer";
import { 
  ShieldCheck, ClipboardSignature, PhoneCall, AlertTriangle, CalendarCheck2 
} from "lucide-react";
import { HospitalImages } from "@/providers/image-provider";

interface LandingSectionProps {
  onBookNow: () => void;
}

export default function LandingSection({ onBookNow }: LandingSectionProps) {
  const heroRef = useRef<LandingHeroRef>(null);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("intake") || href.includes("booking")) {
      e.preventDefault();
      // Execute the quick form opening and scrolling logic isolated inside Hero component
      heroRef.current?.triggerQuickBook();
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 relative overflow-x-hidden flex flex-col antialiased content-visibility-auto">
      
      {/* Background Ambience Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 pointer-events-none opacity-70 filter blur-2xl transform-gpu" />
      <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 pointer-events-none opacity-60 filter blur-2xl transform-gpu" />

      {/* Sub-file Header Link Component call */}
      <LandingHeader onNavClick={handleNavClick} />

      <main className="flex-grow">
        
        {/* Sub-file Hero & Form Controller call */}
        <LandingHero ref={heroRef} onBookNow={onBookNow} />

        {/* MedVA Workflow Architecture Section */}
        <section id="workflow" className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-32 relative z-10">
          <div className="max-w-2xl mb-12 text-center lg:text-left space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Operational Workflow</h2>
            <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">How We Coordinate Your Care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col group hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-150 p-5 gap-4 transform hover:-translate-y-1 will-change-transform transform-gpu">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                <Image 
                  src={HospitalImages.emergencyCare}
                  alt="Online intake form interface layout"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-200 will-change-transform transform-gpu"
                />
              </div>
              <div className="space-y-2 flex-grow flex flex-col justify-start">
                <div className="inline-flex h-8 w-8 bg-blue-50 text-blue-600 rounded-lg items-center justify-center border border-blue-100 shrink-0">
                  <ClipboardSignature className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">1. Simple Intake Request</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Select your required department and preferred time slot. Securely submit your initial details in under a minute without parsing complex medical jargon.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col group hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-150 p-5 gap-4 transform hover:-translate-y-1 will-change-transform transform-gpu">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                <Image 
                  src={HospitalImages.VirtualAssistant}
                  alt="Medical coordination assistant team desk"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-200 will-change-transform transform-gpu"
                />
              </div>
              <div className="space-y-2 flex-grow flex flex-col justify-start">
                <div className="inline-flex h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg items-center justify-center border border-indigo-100 shrink-0">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">2. Assistant Verification</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  A dedicated virtual assistant reviews your request, verifies your insurance coverage details directly with the carrier, and prepares your clinical chart.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col group hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-150 p-5 gap-4 transform hover:-translate-y-1 will-change-transform transform-gpu">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                <Image 
                  src={HospitalImages.doctorTeam}
                  alt="Medical specialist staff review"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-200 will-change-transform transform-gpu" 
                />
              </div>
              <div className="space-y-2 flex-grow flex flex-col justify-start">
                <div className="inline-flex h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg items-center justify-center border border-emerald-100 shrink-0">
                  <CalendarCheck2 className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">3. Physician Confirmation</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Your verified records are attached cleanly to the receiving physician's schedule, booking your consultation slot instantly with zero operational administrative delays.
                </p>
              </div>
            </div>

            {/* Crisis Disclaimer Banner */}
            <div className="md:col-span-3 bg-amber-50/50 border border-amber-200/60 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-150">
              <div className="space-y-1 max-w-3xl">
                <h3 className="font-bold text-sm text-amber-900 tracking-tight flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" /> Medical Emergency Notice
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  This system manages scheduled outpatient coordination and general clinic intakes. If you are experiencing a life-threatening medical emergency, please bypass this portal and call 911 or visit the nearest emergency room immediately.
                </p>
              </div>
              <div className="flex gap-4 items-center whitespace-nowrap text-[10px] font-bold uppercase text-slate-400 tracking-wider md:border-l md:border-slate-200 md:pl-6">
                <span className="flex items-center gap-1.5 text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-600" /> HIPAA Secure Platform</span>
              </div>
            </div>

          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}