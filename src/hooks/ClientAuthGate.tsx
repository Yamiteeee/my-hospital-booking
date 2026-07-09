"use client";

import { useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard"; // Adjust path to your hook

export function ClientAuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authChecking } = useAuthGuard();

  useEffect(() => {
    // If checking is done and user is unauthenticated, bounce them out completely
    if (!authChecking && !isAuthenticated) {
      window.location.replace("/login");
    }
  }, [isAuthenticated, authChecking]);

  // Show a clean layout-matched spinner while verifying authentication states
  if (authChecking || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}