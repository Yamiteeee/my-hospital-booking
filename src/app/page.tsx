"use client";

import React, { useState } from "react";
import LandingSection from "@/sections/landing";
import ChatbotSection from "@/sections/chatbot";
import ReceptionistSection from "@/sections/receptionist"; // Adjust path if located in sections/
import { RefineGlobalProvider } from "@/providers/RefineGlobalProvider"; 

type ActiveView = "marketing" | "booking-chat" | "reception-desk";

export default function Home() {
  const [view, setView] = useState<ActiveView>("marketing");

  return (
    <RefineGlobalProvider>
      <main className="min-h-screen bg-slate-50 relative">
        {/* Dynamic Sandbox Navigation Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-0 z-50 px-6 py-2.5 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 tracking-tight uppercase">
              Clinical Flow Sandbox
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView("marketing")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                view === "marketing" 
                  ? "bg-white text-slate-900 shadow-sm font-bold" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Landing / Form
            </button>
            <button
              onClick={() => setView("booking-chat")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                view === "booking-chat" 
                  ? "bg-white text-slate-900 shadow-sm font-bold" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Triage Chatbot
            </button>
            <button
              onClick={() => setView("reception-desk")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                view === "reception-desk" 
                  ? "bg-white text-blue-600 shadow-sm font-bold" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Reception Desk Stream
            </button>
          </div>
        </div>

        {/* Dynamic Section Renderer */}
        <div className="animate-in fade-in duration-200">
          {view === "marketing" && (
            <LandingSection onBookNow={() => setView("booking-chat")} />
          )}
          
          {view === "booking-chat" && (
            <ChatbotSection onBack={() => setView("marketing")} />
          )}
          
          {view === "reception-desk" && (
            <ReceptionistSection />
          )}
        </div>
      </main>
    </RefineGlobalProvider>
  );
}