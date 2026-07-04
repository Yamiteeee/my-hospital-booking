"use client";

import React, { useState } from "react";
import LandingSection from "@/sections/landing";
import ChatbotSection from "@/sections/chatbot";

export default function Home() {
  const [view, setView] = useState<"marketing" | "booking-chat">("marketing");

  return (
    <main className="min-h-screen bg-slate-50">
      {view === "marketing" ? (
        <LandingSection onBookNow={() => setView("booking-chat")} />
      ) : (
        <ChatbotSection onBack={() => setView("marketing")} />
      )}
    </main>
  );
}