"use client";

import { useState, useEffect } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type ActiveView = "marketing" | "booking-chat" | "reception-desk" | "doctor-schedule";

export function useAuthGuard() {
  const [view, setView] = useState<ActiveView>("marketing");
  
  // Directly retrieve the auth state object from Refine
  const { data: authStatus, isPending: authChecking } = useIsAuthenticated();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 1. Sync physical URL routes AND query parameters cleanly to state
  useEffect(() => {
    if (pathname === "/doctor") {
      setView("doctor-schedule");
      return;
    }
    
    // 🌟 ADDED: Handle the physical receptionist route path matching explicitly
    if (pathname === "/receptionist") {
      setView("reception-desk");
      return;
    }

    // Fallback support for dashboard SPA parameters
    const requestedView = searchParams.get("view") as ActiveView | null;
    if (requestedView && ["marketing", "booking-chat", "reception-desk", "doctor-schedule"].includes(requestedView)) {
      setView(requestedView);
    } else if (pathname === "/") {
      setView("marketing");
    }
  }, [searchParams, pathname]);

  // 2. Clear Active Interceptor Gate
  useEffect(() => {
    // 🌟 IMPORTANT: Absolutely stop evaluation if Refine is actively calculating auth status.
    // This stops unauthenticated flashes from triggering an accidental ejection bounce.
    if (authChecking) return; 

    const isProtected = view === "reception-desk" || view === "doctor-schedule";
    
    if (isProtected && !authStatus?.authenticated) {
      router.push("/login");
    }
  }, [view, authStatus, authChecking, router]);

  return {
    view,
    setView,
    isAuthenticated: !!authStatus?.authenticated,
    authChecking,
  };
}