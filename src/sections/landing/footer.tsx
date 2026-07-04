"use client";

import React from "react";
import { Activity, Shield, Globe, MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export default function LandingFooter() {
  const verifiedNetworks = [
    { name: "BlueCross BlueShield", plan: "PPO / EPO Eligible", style: "text-blue-800" },
    { name: "Aetna Health", plan: "Managed Choice Network", style: "text-slate-800 font-black tracking-tight" },
    { name: "UnitedHealthcare", plan: "Select Plus Approved", style: "text-emerald-700 font-bold" },
    { name: "Cigna Healthcare", plan: "Open Access Plus", style: "text-sky-800 font-medium" },
    { name: "Humana Care", plan: "Choice PPO Premium", style: "text-slate-600 font-semibold tracking-wide" },
    { name: "Kaiser Permanente", plan: "Affiliated Direct Route", style: "text-cyan-700 font-bold" },
  ];

  return (
    <footer className="w-full bg-slate-50/60 text-slate-600 border-t border-slate-200/80 relative z-10 mt-auto backdrop-blur-md">
      
      {/* Premium Static Matrix Grid (Replaced the broken marquee) */}
      <div className="w-full py-10 border-b border-slate-200/60 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center lg:text-left mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Verified Intake Coverage
            </p>
            <h4 className="text-sm font-extrabold text-slate-800 mt-1">
              Accepted Insurance Carrier Direct Routing
            </h4>
          </div>
          
          {/* Organized Multi-column Block Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {verifiedNetworks.map((brand, idx) => (
              <div 
                key={idx} 
                className="bg-white/80 border border-slate-200/50 rounded-2xl p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <span className={`${brand.style} text-xs block truncate`}>
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium  mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  {brand.plan}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 pb-12 border-b border-slate-200/80">
          
          {/* Column A: MedVA Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Activity className="h-4 w-4" />
              </div>
              St. Mary's General
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Automated Virtual Assistant dispatch matrix. Connecting digital outpatient entries to board-certified medical practitioners flawlessly.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg w-fit">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              MedVA Desk Control: Online
            </div>
          </div>

          {/* Column B: Contact Details (Updated to Premium Beverly Hills Mock Location) */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800">Campus Contact Details</p>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>8900 Wilshire Blvd,<br />Suite 250, Beverly Hills, CA 90211</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <a href="tel:+13105550199" className="hover:text-blue-600 transition-colors font-medium text-slate-700">+1 (310) 555-0199</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <a href="mailto:assist@stmarysmedva.org" className="hover:text-blue-600 transition-colors font-medium text-slate-700">assist@stmarysmedva.org</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-slate-500">VA Triage Queue: <span className="text-blue-600 font-semibold">Active 24/7</span></span>
              </li>
            </ul>
          </div>

          {/* Column C: Glassmorphic Geolocation Mock Map */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800">Campus Geolocation</p>
            
            <div className="relative w-full h-36 rounded-2xl bg-white border border-slate-200 overflow-hidden group cursor-pointer shadow-sm hover:border-blue-300 transition-all duration-300 flex items-center justify-center">
              {/* Soft Grid Lines */}
              <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:14px_24px]" />
              
              {/* Soft Center Blur */}
              <div className="absolute w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              {/* Active Marker Pin */}
              <div className="relative flex flex-col items-center gap-1.5 z-10">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-white group-hover:-translate-y-0.5 transition-transform">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold tracking-wide text-slate-700 bg-white/95 px-2 py-0.5 border border-slate-200 rounded-md shadow-sm">
                  Wilshire Medical Complex
                </span>
              </div>

              {/* Hover Effect Layer */}
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/[0.02] transition-colors duration-300" />
            </div>
            <p className="text-[10px] text-slate-400 italic text-right">Click to generate navigation route</p>
          </div>

        </div>

        {/* Sub-Footer Compliance Row */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} St. Mary's Medical Center. All rights reserved.</p>
          <div className="flex gap-6 text-slate-500">
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-blue-500" /> Patient Privacy Secured</span>
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-blue-500" /> HIPAA Compliant Records</span>
          </div>
        </div>
      </div>
    </footer>
  );
}