"use client";

import { useState, useEffect, useRef } from "react";
import { useCreate } from "@refinedev/core";
import { normalizeIncomingReason } from "@/utils/normalization";
import { ChatMessage, ChatbotStep, ChatbotBookingData } from "@/types";

export function useChatbotTriage() {
  const { mutate } = useCreate();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: "1", 
      sender: "bot", 
      text: "Hello! Welcome to St. Mary's Healthcare Gateway. I am your automated digital triage assistant. To start, may I please have your full name?" 
    }
  ]);
  const [currentStep, setCurrentStep] = useState<ChatbotStep>("name");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bookingData, setBookingData] = useState<ChatbotBookingData>({
    patient_name: "",
    phone: "",
    reason: "",
    preferredDate: "",
    preferredTime: "",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getProgressPercentage = () => {
    if (currentStep === "name") return 20;
    if (currentStep === "phone") return 40;
    if (currentStep === "reason") return 60;
    if (currentStep === "date") return 80;
    return 100;
  };

  const handleSend = async (e?: React.FormEvent, directValue?: string) => {
    if (e) e.preventDefault();
    const activeText = directValue || inputValue;
    if (!activeText.trim() || isTyping) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: "user", text: activeText };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    if (currentStep === "name") {
      setBookingData((prev) => ({ ...prev, patient_name: activeText }));
      setCurrentStep("phone");
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: `Thank you, ${activeText}. What is the best telephone number for our scheduling desk to verify your routing slot via SMS?` }
        ]);
      }, 1100);
    } 
    else if (currentStep === "phone") {
      setBookingData((prev) => ({ ...prev, phone: activeText }));
      setCurrentStep("reason");
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Got it. Could you briefly summarize the medical symptoms or the reason for your visit today?" }
        ]);
      }, 1100);
    } 
    else if (currentStep === "reason") {
      setBookingData((prev) => ({ ...prev, reason: activeText }));
      setCurrentStep("date");
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Understood. Please pick or enter your preferred calendar date for the booking." }
        ]);
      }, 1100);
    }
    else if (currentStep === "date") {
      setBookingData((prev) => ({ ...prev, preferredDate: activeText }));
      setCurrentStep("time");
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Perfect. Lastly, select one of our available operational windows for this appointment date:" }
        ]);
      }, 1100);
    }
    else if (currentStep === "time") {
      const finalData = { ...bookingData, preferredTime: activeText };
      setBookingData(finalData);
      setCurrentStep("complete");
      
      const calculatedToken = normalizeIncomingReason(finalData.reason);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Excellent. Pushing your clean package down our administrative physician pipeline now..." }
        ]);
      }, 800);

      setTimeout(() => {
        setIsTyping(false);

        mutate({
          resource: "bookings",
          values: {
            patient_name: finalData.patient_name,
            phone: finalData.phone,
            // Compiles full note info perfectly just like our hero quick-form!
            reason: `${finalData.reason}. Target Window: ${finalData.preferredDate} @ ${finalData.preferredTime}`, 
            normalized_reason: calculatedToken,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        });

        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "🎉 Intake Request Complete! Your record is securely locked into our MedVA dashboard queue. A live receptionist will reach out shortly to confirm." }
        ]);
      }, 2400);
    }
  };

  return {
    messages,
    currentStep,
    inputValue,
    setInputValue,
    isTyping,
    chatEndRef,
    getProgressPercentage,
    handleSend
  };
}