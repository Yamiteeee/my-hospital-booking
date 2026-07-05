"use client";

import React from "react";
import { 
  Activity, Shield, Globe, MapPin, Phone, Mail, Clock, 
  Building2, Heart, Sparkles 
} from "lucide-react";

// Import decoupled data configuration
import { CORPORATE_SPONSORS, CAMPUS_CONTACTS } from "@/providers/data-providers/footerData";

function SponsorCard({ company }: { company: typeof CORPORATE_SPONSORS[number] }) {
  const IconComponent = company.icon;
  return (
    <div className="bg-white border border-slate-200/50 rounded-2xl p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between cursor-pointer transform-gpu">
      <div className="flex items-center gap-2">
        <div className={`h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 ${company.style}`}>
          <IconComponent className="h-3 w-3" />
        </div>
        <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-blue-600 transition-colors">
          {company.name}
        </span>
      </div>
      <span className="text-[9px] text-slate-400 font-medium tracking-wide uppercase mt-3 block">
        {company.desc}
      </span>
    </div>
  );
}

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    /* Removed backdrop-blur-md entirely to restore 60 FPS scrolling performance */
    <footer className="w-full bg-slate-50 text-slate-600 border-t border-slate-200/80 relative z-10 mt-auto content-visibility-auto contain-intrinsic-size-[600px]">
      
      {/* Premium Corporate Sponsors Grid */}
      <div className="w-full py-10 border-b border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center lg:text-left mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 flex items-center justify-center lg:justify-start gap-1">
              <Sparkles className="h-3 w-3" /> Corporate Affiliates
            </p>
            <h4 className="text-sm font-extrabold text-slate-800 mt-1">
              Enterprise Sponsors & Operational Partners
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CORPORATE_SPONSORS.map((company, idx) => (
              <SponsorCard key={idx} company={company} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 pb-12 border-b border-slate-200/80">
          
          {/* Column A: MedVA Brand Info & Partner Logos */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-4">
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
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                MedVA Desk Control: Online
              </div>
            </div>

            {/* Embedded Mini Partners Section */}
            <div className="pt-2 border-t border-slate-200/40">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Strategic Global Networks
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200/60 px-2.5 py-1.5 rounded-xl text-slate-500 shadow-sm">
                  <Building2 className="h-3 w-3 text-blue-600" />
                  <span className="text-[10px] font-bold tracking-tight">ApexHealth</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200/60 px-2.5 py-1.5 rounded-xl text-slate-500 shadow-sm">
                  <Heart className="h-3 w-3 text-rose-500" />
                  <span className="text-[10px] font-bold tracking-tight">OmniCare</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200/60 px-2.5 py-1.5 rounded-xl text-slate-500 shadow-sm">
                  <Shield className="h-3 w-3 text-indigo-600" />
                  <span className="text-[10px] font-bold tracking-tight">VerisHealth</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column B: Contact Details populated dynamically */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800">Campus Contact Details</p>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{CAMPUS_CONTACTS.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <a href={`tel:${CAMPUS_CONTACTS.phoneRaw}`} className="hover:text-blue-600 transition-colors font-medium text-slate-700">
                  {CAMPUS_CONTACTS.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <a href={`mailto:${CAMPUS_CONTACTS.email}`} className="hover:text-blue-600 transition-colors font-medium text-slate-700">
                  {CAMPUS_CONTACTS.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-slate-500">VA Triage Queue: <span className="text-blue-600 font-semibold">{CAMPUS_CONTACTS.triageStatus}</span></span>
              </li>
            </ul>
          </div>

          {/* Column C: Geolocation Mock Map */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800">Campus Geolocation</p>
            <div className="relative w-full h-36 rounded-2xl bg-white border border-slate-200 overflow-hidden group cursor-pointer shadow-sm hover:border-blue-300 transition-all duration-200 flex items-center justify-center transform-gpu">
              <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:14px_24px]" />
              {/* Simplified glow shape opacity to completely skip heavy GPU composition calculations */}
              <div className="absolute w-24 h-24 rounded-full bg-blue-500/5 pointer-events-none group-hover:scale-125 transition-transform duration-300" />
              
              <div className="relative flex flex-col items-center gap-1.5 z-10">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-white group-hover:-translate-y-0.5 transition-transform duration-200">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold tracking-wide text-slate-700 bg-white px-2 py-0.5 border border-slate-200 rounded-md shadow-sm">
                  Wilshire Medical Complex
                </span>
              </div>
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/[0.02] transition-colors duration-200" />
            </div>
            <p className="text-[10px] text-slate-400 italic text-right">Click to generate navigation route</p>
          </div>

        </div>

        {/* Sub-Footer Compliance Row */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-medium">
          <p>© {currentYear} St. Mary's Medical Center. All rights reserved.</p>
          <div className="flex gap-6 text-slate-500">
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-blue-500" /> Patient Privacy Secured</span>
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-blue-500" /> HIPAA Compliant Records</span>
          </div>
        </div>
      </div>
    </footer>
  );
}