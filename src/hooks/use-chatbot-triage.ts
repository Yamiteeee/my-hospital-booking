"use client";

import { useState, useEffect, useRef } from "react";
import { useMockStore } from "@/providers/mock-store";

export type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

export type Step = "name" | "phone" | "reason" | "complete";

export function useChatbotTriage() {
  const { addBooking } = useMockStore();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      sender: "bot", 
      text: "Hello! Welcome to St. Mary's Healthcare Gateway. I am your automated digital triage assistant. To start, may I please have your full name?" 
    }
  ]);
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bookingData, setBookingData] = useState({
    patient_name: "",
    phone: "",
    reason: "",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Keep chat viewport scrolled to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getProgressPercentage = () => {
    if (currentStep === "name") return 33;
    if (currentStep === "phone") return 66;
    return 100;
  };

  const handleSend = async (e?: React.FormEvent, directValue?: string) => {
    if (e) e.preventDefault();
    const activeText = directValue || inputValue;
    if (!activeText.trim() || isTyping) return;

    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: activeText };
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
      }, 1300);
    } 
    else if (currentStep === "phone") {
      setBookingData((prev) => ({ ...prev, phone: activeText }));
      setCurrentStep("reason");
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Got it. Lastly, could you briefly summarize the medical symptoms or the reason for your visit today?" }
        ]);
      }, 1300);
    } 
    else if (currentStep === "reason") {
      const finalData = { ...bookingData, reason: activeText };
      setBookingData(finalData);
      setCurrentStep("complete");
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Excellent. Pushing your clean package down our administrative physician pipeline now..." }
        ]);
      }, 800);

      setTimeout(() => {
        setIsTyping(false);
        addBooking({
          patient_name: finalData.patient_name,
          phone: finalData.phone,
          reason: finalData.reason
        });

        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "🎉 Intake Request Complete! Your record is securely locked into our MedVA dashboard queue. A live receptionist will reach out shortly." }
        ]);
      }, 2600);
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