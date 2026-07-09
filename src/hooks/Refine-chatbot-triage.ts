"use client";

import { useState, useEffect, useRef } from "react";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { ChatMessage, ChatbotStep, ChatbotBookingData } from "@/types";

export function useChatbotTriage() {
  const { submitNewBooking } = useBookingOperations();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: "1", 
      sender: "bot", 
      text: "Hello! Welcome to St. Mary's Healthcare Gateway. I am your triage assistant. To start, may I please have your full name?" 
    }
  ]);
  const [currentStep, setCurrentStep] = useState<ChatbotStep>("name");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bookingData, setBookingData] = useState<ChatbotBookingData>({
    patient_name: "", phone: "", reason: "", preferredDate: "", preferredTime: "",
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getProgressPercentage = () => {
    const steps: Record<ChatbotStep, number> = { name: 20, phone: 40, reason: 60, date: 80, time: 95, complete: 100 };
    return steps[currentStep] || 0;
  };

  const handleSend = async (e?: React.FormEvent, directValue?: string) => {
    if (e) e.preventDefault();
    const activeText = directValue || inputValue;
    if (!activeText.trim() || isTyping) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: activeText }]);
    setInputValue("");
    setIsTyping(true);

    if (currentStep === "name") {
      setBookingData((prev) => ({ ...prev, patient_name: activeText }));
      setCurrentStep("phone");
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: `Thank you, ${activeText}. What is your phone number for SMS tracking?` }]);
      }, 1100);
    } 
    else if (currentStep === "phone") {
      setBookingData((prev) => ({ ...prev, phone: activeText }));
      setCurrentStep("reason");
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: "Could you briefly describe the main reason or symptoms for your medical visit?" }]);
      }, 1100);
    } 
    else if (currentStep === "reason") {
      setBookingData((prev) => ({ ...prev, reason: activeText }));
      setCurrentStep("date");
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: "Please provide your preferred scheduling date." }]);
      }, 1100);
    }
    else if (currentStep === "date") {
      setBookingData((prev) => ({ ...prev, preferredDate: activeText }));
      setCurrentStep("time");
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: "Finally, select your preferred time slot window:" }]);
      }, 1100);
    }
    else if (currentStep === "time") {
      const finalData = { ...bookingData, preferredTime: activeText };
      setBookingData(finalData);
      setCurrentStep("complete");

      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: "Processing your intake summary..." }]);
      }, 800);

      setTimeout(() => {
        submitNewBooking(
          finalData.patient_name,
          finalData.phone,
          finalData.reason,
          finalData.preferredDate,
          finalData.preferredTime,
          {
            onSuccess: () => {
              setIsTyping(false);
              setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: "🎉 Intake Request Complete! Your record is locked into our live triage queue. A coordinator will contact you shortly." }]);
            },
            onError: () => {
              setIsTyping(false);
              setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: "⚠️ System alert: Data pipeline connection error. Please contact registration directly." }]);
            }
          }
        );
      }, 2400);
    }
  };

  return { messages, currentStep, inputValue, setInputValue, isTyping, chatEndRef, getProgressPercentage, handleSend };
}