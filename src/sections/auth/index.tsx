"use client";

import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";

export default function AuthSection() {
  const [companyId, setCompanyId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  
  const { mutateAsync: login, isPending } = useLogin();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!companyId.trim()) return;

    try {
      const result = await login({ companyId });

      if (result.success) {
        router.push("/?view=reception-desk");
        router.refresh();
      } else {
        setErrorMessage(result.error?.message || "Invalid Company ID Badge.");
      }
    } catch (error: any) {
      setErrorMessage("A network or system error occurred during authentication.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 p-8 bg-white border border-slate-200 shadow-xl rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-700" />
        
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">MedVA Terminal Access</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Authorized virtual assistant routing desk portal. Input identity key card to authenticate session.
          </p>
        </div>

        {/* Separator Line */}
        <div className="border-t border-slate-100 my-2" />

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* MOVE TO TOP: Inline Back Button above form fields */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-900 tracking-wider uppercase transition-colors duration-150 group pb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
            Back to Patient Portal
          </button>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Global Company ID Badge
            </label>
            <input
              type="text"
              required
              disabled={isPending}
              placeholder="e.g. VA-101"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-800 transition-colors uppercase placeholder:normal-case tracking-wide"
            />
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-600 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs py-5 shadow-md shadow-blue-600/10 transition-all duration-150 flex items-center justify-center gap-1.5 transform active:scale-[0.99]"
          >
            {isPending ? "Validating Credentials..." : "Authenticate Session"}
            {!isPending && <ArrowRight className="h-3.5 w-3.5" />}
          </Button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            Authorized Sandbox Keys for testing: <span className="font-bold text-slate-600">VA-101</span> or <span className="font-bold text-slate-600">VA-102</span>
          </p>
        </div>
      </div>
    </div>
  );
}