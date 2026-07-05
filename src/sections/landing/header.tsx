"use client";

import React from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { Activity, ArrowUpRight, Lock } from "lucide-react";
import { NAVIGATION_LINKS } from "@/providers/data-providers/landingData";

interface LandingHeaderProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  // Dynamic switch to safely change tab views inside the main application context if integrated
  onPortalViewSelect?: () => void;
}

export default function LandingHeader({ onNavClick, onPortalViewSelect }: LandingHeaderProps) {
  const router = useRouter();
  const { data: authStatus } = useIsAuthenticated();

  const handlePortalAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (authStatus?.authenticated) {
      // If the user has active session badge keys, route straight through or flip layout state
      if (onPortalViewSelect) {
        onPortalViewSelect();
      } else {
        router.push("/");
      }
    } else {
      // Secure fallback: If unauthorized, instantly redirect to company identity terminal
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">
        
        {/* Fixed Logo Branding Block */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer select-none">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/10">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="font-bold text-lg tracking-tight leading-tight text-slate-900">St. Mary's</span>
            <span className="text-[9px] text-blue-600 font-bold tracking-widest uppercase">MedVA Desk Control</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {NAVIGATION_LINKS.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={(e) => onNavClick(e, link.href)}
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={handlePortalAccess}
            className={`text-xs font-bold uppercase tracking-wider text-white transition-all duration-150 px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 group hover:-translate-y-0.5 transform-gpu ${
              authStatus?.authenticated 
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/5" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/5"
            }`}
          >
            {authStatus?.authenticated ? "Go to Dashboard" : "Receptionist Portal"}
            {authStatus?.authenticated ? (
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            ) : (
              <Lock className="h-3 w-3 text-blue-200 transition-colors group-hover:text-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}