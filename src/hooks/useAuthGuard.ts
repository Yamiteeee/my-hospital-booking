"use client";

import { useState, useEffect } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type ActiveView = "marketing" | "booking-chat" | "reception-desk" | "doctor-schedule";

export function useAuthGuard() {
  const [view, setView] = useState<ActiveView>("marketing");
  const { data: authStatus, isPending: authChecking } = useIsAuthenticated();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/doctor") {
      setView("doctor-schedule");
      return;
    }
    if (pathname === "/receptionist") {
      setView("reception-desk");
      return;
    }

    const requestedView = searchParams.get("view") as ActiveView | null;
    if (requestedView && ["marketing", "booking-chat", "reception-desk", "doctor-schedule"].includes(requestedView)) {
      setView(requestedView);
    } else if (pathname === "/") {
      setView("marketing");
    }
  }, [searchParams, pathname]);

  // 2. Absolute Interceptor Gate Guard
  useEffect(() => {
    if (authChecking) return; 

    const isProtected = view === "reception-desk" || view === "doctor-schedule";
    
    // If the view state demands protection but framework token has expired or is cleared:
    if (isProtected && !authStatus?.authenticated) {
      // Direct assignment bypasses router caches immediately
      window.location.replace("/login");
    }
  }, [view, authStatus, authChecking]);

  return {
    view,
    setView,
    isAuthenticated: !!authStatus?.authenticated,
    authChecking,
  };
}