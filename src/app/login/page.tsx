"use client";

import React from "react";
import AuthSection from "@/sections/auth";
import { RefineGlobalProvider } from "@/providers/RefineGlobalProvider";

export default function LoginPage() {
  return (
    <RefineGlobalProvider>
      <AuthSection />
    </RefineGlobalProvider>
  );
}