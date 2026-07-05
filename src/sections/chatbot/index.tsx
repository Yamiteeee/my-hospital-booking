"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HospitalImages } from "@/providers/image-provider";
import { useChatbotTriage } from "@/hooks/Refine-chatbot-triage";
import Image from "next/image";
import { Bot, User, ArrowLeft, Send, Sparkles, ShieldPlus, Dna } from "lucide-react";

interface ChatbotSectionProps {
  onBack: () => void;
}

export default function ChatbotSection({ onBack }: ChatbotSectionProps) {
  const {
    messages,
    currentStep,
    inputValue,
    setInputValue,
    isTyping,
    chatEndRef,
    getProgressPercentage,
    handleSend
  } = useChatbotTriage();

  return (
    <div className="w-full h-[100dvh] bg-[#f1f6ff] relative overflow-hidden font-sans flex flex-col justify-center items-center p-3 sm:p-4">
      
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />
      
      {/* Background Pattern Fallback wrapper to avoid structural breakage if asset returns 404 */}
      <div 
        className="absolute inset-0 opacity-[0.06] bg-repeat bg-[size:140px] pointer-events-none data-[missing=true]:hidden"
        style={{ backgroundImage: "url('/medical-pattern.svg')" }}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      
      <div className="absolute top-[-10%] right-[-10%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-blue-400/15 blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-tr from-indigo-300/10 to-transparent blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="absolute top-[10%] left-[5%] w-14 h-14 opacity-10 text-blue-500 transform -rotate-12 pointer-events-none hidden xl:block">
        <Dna className="w-full h-full" strokeWidth={1} />
      </div>
      <div className="absolute bottom-[10%] right-[5%] w-16 h-16 opacity-10 text-indigo-500 transform rotate-12 pointer-events-none hidden xl:block">
        <ShieldPlus className="w-full h-full" strokeWidth={1} />
      </div>

      {/* Main Layout Container - Aligned dead-center with clean loading entry animations */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-xl w-full h-fit max-h-[95vh] relative z-10 justify-center my-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        
        {/* Main Title Header */}
        <div className="text-center flex flex-col items-center gap-1 w-full shrink-0">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50/80 border border-blue-100 shadow-sm text-blue-700 text-[10px] font-semibold tracking-wide uppercase">
            <Sparkles className="h-2.5 w-2.5 text-blue-600 animate-pulse" /> 
            MedVA Co-Pilot
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">Cora</span>, Your AI Assistant
          </h1>
        </div>

        {/* Header Grid: Adapts cleanly from stacked mobile to desktop row blocks */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3 px-0.5 shrink-0 relative justify-center">
          
          {/* High-Resolution Anti-Blur Avatar Render Frame */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-[75px] h-[75px] sm:w-[85px] sm:h-[85px] aspect-square rounded-full p-0.5 bg-gradient-to-tr from-blue-500/30 via-indigo-500/10 to-blue-600/30 border border-white/80 shadow-md backdrop-blur-sm">
              <div className="relative w-full h-full rounded-full overflow-hidden border border-white bg-slate-50 [image-rendering:auto]">
                <Image 
                  src={HospitalImages.coraCharacter} 
                  alt="AI Triage Representative Cora"
                  fill
                  priority
                  unoptimized
                  quality={100}
                  sizes="(max-width: 640px) 75px, 85px"
                  className="object-cover brightness-105 scale-105 transform antialiased"
                />
              </div>
            </div>
          </div>

          {/* Context Speech Bubble */}
          <div className="relative bg-white border border-slate-200/70 shadow-md rounded-2xl p-3 pr-20 text-[11px] sm:text-xs text-slate-600 text-center sm:text-left flex-1 font-medium leading-relaxed min-h-[70px] flex items-center justify-center sm:justify-start">
            <span className="pr-2 sm:pr-4">
              I'm here to streamline check-in. Answer a few questions below to securely route your details to our team.
            </span>
            
            {/* Desktop-only Context Pointer */}
            <div className="hidden sm:block absolute bottom-[32px] left-[-6px] w-3 h-3 bg-white border-l border-b border-slate-200/70 rotate-45 pointer-events-none" />
            
            {/* Responsive Corner Bound Back Action */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack} 
              className="absolute top-1/2 -translate-y-1/2 right-2 text-slate-600 hover:text-slate-900 font-bold text-[9px] tracking-wider uppercase gap-0.5 bg-slate-50/50 hover:bg-slate-100 border border-slate-200 shadow-sm rounded-xl px-2 py-0.5 h-7 transition-all flex items-center shrink-0"
            >
              <ArrowLeft className="h-2.5 w-2.5 text-blue-600" /> Back
            </Button>
          </div>

        </div>
        
        {/* Main Chat Frame Element */}
        <div className="w-full flex flex-col shrink-0">
          <Card className="w-full h-[52vh] sm:h-[54vh] max-h-[500px] flex flex-col shadow-xl border-slate-200 bg-white rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="w-full h-1 bg-slate-100 relative shrink-0">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out" 
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>

            <CardHeader className="bg-white border-b border-slate-100 py-2 px-4 sm:px-5 shrink-0">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5 text-left">
                  <CardTitle className="text-[11px] sm:text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    Automated Reception Desk
                  </CardTitle>
                  <CardDescription className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wide">HIPAA-Compliant Intake Matrix</CardDescription>
                </div>
                <span className="text-[8px] sm:text-[9px] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-emerald-700 font-bold uppercase rounded-md tracking-wider flex items-center gap-0.5 shadow-sm">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-50/40">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  
                  {msg.sender === "bot" && (
                    <div className="h-5.5 w-5.5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm mt-0.5">
                      <Bot className="h-3 w-3" />
                    </div>
                  )}

                  <div className={`max-w-[82%] rounded-xl sm:rounded-2xl px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs leading-relaxed shadow-sm font-medium text-left ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none font-normal" 
                      : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>

                  {msg.sender === "user" && (
                    <div className="h-5.5 w-5.5 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-sm mt-0.5">
                      <User className="h-3 w-3" />
                    </div>
                  )}

                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2 justify-start">
                  <div className="h-5.5 w-5.5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="bg-white text-slate-400 border border-slate-200/60 rounded-xl rounded-tl-none px-3 py-1.5 shadow-sm flex items-center gap-0.5">
                    <div className="h-1 w-1 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-1 w-1 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-1 w-1 rounded-full bg-slate-300 animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </CardContent>

            {/* Response Pill Chips Container */}
            {currentStep === "reason" && !isTyping && (
              <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex flex-wrap gap-1 justify-center shrink-0 max-h-[75px] overflow-y-auto">
                {["Routine Physical", "Cardiology", "Pediatric Case", "Orthopedic"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(undefined, chip)}
                    className="text-[9px] sm:text-[10px] font-semibold text-blue-600 bg-blue-50/50 border border-blue-100/70 hover:bg-blue-50 px-2.5 py-0.5 rounded-lg transition-all duration-150"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Form Box Area */}
            <form onSubmit={(e) => handleSend(e)} className="p-2 bg-white border-t border-slate-100 flex gap-1.5 items-center shrink-0">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentStep === "complete" ? "Registration complete." : "Type a response..."}
                disabled={currentStep === "complete" || isTyping}
                className="flex-1 focus-visible:ring-blue-500 rounded-xl text-[11px] bg-slate-50 border-slate-200 h-8 px-3"
              />
              <Button 
                type="submit" 
                disabled={currentStep === "complete" || !inputValue.trim() || isTyping} 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-8 w-8 shrink-0 p-0 shadow-md flex items-center justify-center transition-all disabled:bg-slate-100 disabled:text-slate-400"
              >
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}