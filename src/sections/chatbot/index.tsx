"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMockStore } from "@/providers/mock-store";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

type Step = "welcome" | "name" | "phone" | "reason" | "complete";

interface ChatbotSectionProps {
  onBack: () => void;
}

export default function ChatbotSection({ onBack }: ChatbotSectionProps) {
  const { addBooking } = useMockStore();
  
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", text: "Hello! Welcome to St. Mary's Hospital Support. I can help you book an appointment today. May I know your full name?" }
  ]);
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [inputValue, setInputValue] = useState("");
  const [bookingData, setBookingData] = useState({
    patient_name: "",
    phone: "",
    reason: "",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    if (currentStep === "name") {
      setBookingData((prev) => ({ ...prev, patient_name: userText }));
      setCurrentStep("phone");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: `Thanks, ${userText}. What is a good phone number to reach you at?` }
        ]);
      }, 850);
    } 
    else if (currentStep === "phone") {
      setBookingData((prev) => ({ ...prev, phone: userText }));
      setCurrentStep("reason");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Got it. Briefly describe the reason for your visit or symptoms." }
        ]);
      }, 850);
    } 
    else if (currentStep === "reason") {
      const finalData = { ...bookingData, reason: userText };
      setBookingData(finalData);
      setCurrentStep("complete");
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Perfect! Processing your request with our scheduler..." }
        ]);
      }, 850);

      setTimeout(() => {
        addBooking({
          patient_name: finalData.patient_name,
          phone: finalData.phone,
          reason: finalData.reason
        });

        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "🎉 Appointment successfully requested! A receptionist will confirm your slot shortly via SMS." }
        ]);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-lg mb-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900">
          ← Back to Homepage
        </Button>
      </div>
      
      <Card className="w-full max-w-lg h-[600px] flex flex-col shadow-lg border-slate-200 bg-white">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-600 animate-pulse" />
            AI Intake Desk
          </CardTitle>
          <CardDescription>Instant Conversational Triage</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                msg.sender === "user" 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </CardContent>

        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={currentStep === "complete" ? "Session complete..." : "Type here..."}
            disabled={currentStep === "complete"}
            className="flex-1 focus-visible:ring-blue-400"
          />
          <Button type="submit" disabled={currentStep === "complete"} className="bg-blue-600 text-white hover:bg-blue-700">
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}