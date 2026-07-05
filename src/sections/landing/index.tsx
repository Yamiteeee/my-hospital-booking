"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import LandingFooter from "./footer";
import { 
  ArrowRight, ShieldCheck, Activity, Sparkles, 
  ShieldAlert, Layers, Users, Zap, 
  Stethoscope, CheckCircle2, ArrowUpRight, ShieldEllipsis
} from "lucide-react";
import { HospitalImages } from "@/providers/image-provider";

function AnimatedCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

interface LandingSectionProps {
  onBookNow: () => void;
}

export default function LandingSection({ onBookNow }: LandingSectionProps) {
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    patientName: "",
    department: "",
    urgency: "routine",
    preferredDate: ""
  });

  const uniqueDepartments = [
    { id: "cardio", name: "Cardiovascular Medicine" },
    { id: "ortho", name: "Orthopedics & Joint Care" },
    { id: "peds", name: "Pediatrics & Neonatal Care" },
    { id: "neuro", name: "Neurological Sciences" }
  ];

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
    <div className="min-h-screen bg-[#ffffff] font-sans text-slate-900 selection:bg-blue-100 relative overflow-hidden flex flex-col">
      
      {/* SaaS Ambient Decorative Blur Background Filters */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/0 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-20%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[700px] h-[700px] rounded-full bg-blue-600/5 blur-[140px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-tight text-slate-900">St. Mary's</span>
              <span className="text-[9px] text-blue-600 font-bold tracking-widest uppercase">MedVA Desk Control</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#intake" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">1-Click Intake</a>
            <a href="#workflow" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">VA Dispatch Pipeline</a>
            <a href="#telemetry" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">Desk Metrics</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/receptionist" 
              className="text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 transition-all px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-2 group"
            >
              Receptionist Portal
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section id="intake" className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-20 lg:pt-24 lg:pb-24 grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/70 border border-blue-100 shadow-sm text-blue-700 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" /> 
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
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-300 transform hover:-translate-y-0.5 gap-2 group"
              >
                Launch Standard Booking Portal
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowQuickBook(!showQuickBook)}
                className={`px-8 py-6 text-sm font-bold rounded-xl transition-all shadow-sm border-slate-200 ${showQuickBook ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white hover:bg-slate-50 text-slate-600'}`}
              >
                {showQuickBook ? "Cancel Quick Form" : "1-Click Express Booking Request"}
              </Button>
            </div>

            {/* Quick Express Booking Form Field Container */}
            {showQuickBook && (
              <div className="mt-6 p-6 bg-white border border-blue-100 rounded-3xl shadow-xl text-left animate-in fade-in slide-in-from-top-4 duration-300 relative overflow-hidden">
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
                          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Specialty Wing</label>
                        <select 
                          required
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800 transition-colors"
                        >
                          <option value="">Select Wing...</option>
                          {uniqueDepartments.map((d) => (
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
                          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800"
                        >
                          <option value="routine">Routine Check-Up</option>
                          <option value="urgent">Urgent Follow-Up</option>
                        </select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-xl mt-2 text-xs py-5">
                      Send Request to Reception Desk
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">Request Dispatched to MedVA Queue</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Our administrative assistants are matching your file options against physician timetables right now.
                      </p>
                    </div>
                    <Button type="button" variant="outline" onClick={resetBookingForm} className="text-xs px-4 py-2 border-slate-200 rounded-lg">
                      Dismiss Form
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Cleaned & Fixed Mobile Layout Telemetry Row */}
            <div id="telemetry" className="pt-10 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  <AnimatedCounter target={45} suffix="s" />
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Avg VA Sorting Time</p>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  <AnimatedCounter target={99} suffix=".8%" />
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Doctor Routing Rate</p>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  <AnimatedCounter target={12} suffix=" min" />
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total Patient Wait Time</p>
              </div>
            </div>
          </div>

          {/* Dynamic Image Hero Banner Visuals */}
          <div className="lg:col-span-5 relative w-full h-[420px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 p-2 bg-slate-50/50 backdrop-blur-md">
            <div className="relative w-full h-full rounded-2xl overflow-hidden group">
              <Image 
                src={HospitalImages.heroBackground} 
                alt="Premium Modern Clinical Campus Architecture"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover scale-[1.02] filter brightness-[0.97] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-xl flex items-center gap-4 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 tracking-tight">MedVA Co-Pilot Active</p>
                  <p className="text-[10px] text-slate-500 font-medium">Streamlined Receptionist Workflow Automation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Architecture Description */}
        <section id="workflow" className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 pb-32 relative z-10">
          <div className="max-w-2xl mb-16 text-center lg:text-left space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Administrative Flowchart</h2>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">How The MedVA Ecosystem Works.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Box 1: Patient One-Click Action */}
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-3xl flex flex-col group hover:border-blue-200 hover:bg-white transition-all duration-300 shadow-sm overflow-hidden p-6 gap-5">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                <Image 
                  src={HospitalImages.emergencyCare}
                  alt="Seamless modern medical interface workflow layout"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              
              <div className="space-y-3 flex-grow flex flex-col justify-start">
                <div className="inline-flex h-9 w-9 bg-blue-50 text-blue-600 rounded-lg items-center justify-center border border-blue-100 shadow-inner shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">1. Instant Intake Request</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Patients select a generic department slot with a single click. No complex forms or long medical history fields required upfront.
                </p>
              </div>
            </div>

            {/* Bento Box 2: VA Dispatch Dashboard */}
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-3xl flex flex-col group hover:border-blue-200 hover:bg-white transition-all duration-300 shadow-sm overflow-hidden p-6 gap-5">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                <Image 
                  src={HospitalImages.VirtualAssistant}
                  alt="Central medical coordination hub infrastructure"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              
              <div className="space-y-3 flex-grow flex flex-col justify-start">
                <div className="inline-flex h-9 w-9 bg-indigo-50 text-indigo-600 rounded-lg items-center justify-center border border-indigo-100 shadow-inner shrink-0">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">2. Assistant Verification</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  The receptionist or remote virtual assistant takes the inbound ticket, confirms insurance coverage, sorts urgency level, and updates scheduling parameters.
                </p>
              </div>
            </div>

            {/* Bento Box 3: Doctor Allocation Output */}
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-3xl flex flex-col group hover:border-blue-200 hover:bg-white transition-all duration-300 shadow-sm overflow-hidden p-6 gap-5">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                <Image 
                  src={HospitalImages.doctorTeam}
                  alt="Certified medical specialist practitioner staff team"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top group-hover:scale-105 transition-all duration-500" 
                />
              </div>
              
              <div className="space-y-3 flex-grow flex flex-col justify-start">
                <div className="inline-flex h-9 w-9 bg-emerald-50 text-emerald-600 rounded-lg items-center justify-center border border-emerald-100 shadow-inner shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">3. Physician Pipeline Lock</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Once verified, the receptionist locks the date and pushes the clean package directly to the doctor’s operational calendar.
                </p>
              </div>
            </div>

            {/* Large Horizontal Bottom Block regarding safety guidelines */}
            <div className="md:col-span-3 bg-slate-50/60 border border-slate-200/80 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-200 hover:bg-white transition-all duration-300 shadow-sm">
              <div className="space-y-2 max-w-2xl">
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-600" /> Crisis & Emergency Disclaimer
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Our remote virtual assistant queues handle elective consultations and scheduled outpatient operations. For physical critical emergencies or ambulance dispatch, call 911 immediately.
                </p>
              </div>
              <div className="flex gap-4 items-center whitespace-nowrap text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                <span className="flex items-center gap-1"><ShieldEllipsis className="h-4 w-4 text-blue-500" /> HIPAA Validated</span>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Reusable Clean Light Footer */}
      <LandingFooter />

    </div>
  );
}