"use client";

import React from "react";
import { useLogout } from "@refinedev/core";
import LandingSection from "@/sections/landing";
import ChatbotSection from "@/sections/chatbot";
import ReceptionistSection from "@/sections/receptionist";
import { useAuthGuard } from "@/hooks/useAuthGuard"; // Import your new custom hook
import { RefineGlobalProvider } from "@/providers/RefineGlobalProvider";
import { LogOut, ShieldCheck } from "lucide-react";

function MainDashboardLayout() {
  // Extract all abstracted logic from our decoupled hook machine
  const { view, setView, isAuthenticated, authChecking } = useAuthGuard();
  const { mutate: logOut } = useLogout();

  return (
    <main className="min-h-screen bg-slate-50 relative">
      
      {/* Dynamic Workspace Header Action Bar */}
      {view === "reception-desk" && isAuthenticated && (
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-8 py-3.5 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black text-slate-200 tracking-wider uppercase flex items-center gap-1.5">
              Secure VA Workspace
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </span>
          </div>
          
          <button
            onClick={() => logOut()}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-rose-400 transition-colors duration-150"
            title="Log Out Terminal Access Session"
          >
            <span>Disconnect Session</span>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Dynamic Render Context Target */}
      <div className="animate-in fade-in duration-200">
        {view === "marketing" && (
          <LandingSection onBookNow={() => setView("booking-chat")} />
        )}
        
        {view === "booking-chat" && (
          <ChatbotSection onBack={() => setView("marketing")} />
        )}
        
        {view === "reception-desk" && (
          <>
            {authChecking ? (
              <div className="min-h-[60vh] flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Verifying Credentials...
              </div>
            ) : isAuthenticated ? (
              <ReceptionistSection />
            ) : (
              <div className="min-h-[60vh] flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Redirecting to terminal login node...
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <RefineGlobalProvider>
      <MainDashboardLayout />
    </RefineGlobalProvider>
  );
}