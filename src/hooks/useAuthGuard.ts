"use client";

import { useState, useEffect } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { useRouter, useSearchParams } from "next/navigation";

type ActiveView = "marketing" | "booking-chat" | "reception-desk";

export function useAuthGuard() {
  const [view, setView] = useState<ActiveView>("marketing");
  const { data: authStatus, isPending: authChecking } = useIsAuthenticated();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Sync URL query flags (?view=...) to component view state
  useEffect(() => {
    const requestedView = searchParams.get("view") as ActiveView | null;
    if (requestedView && ["marketing", "booking-chat", "reception-desk"].includes(requestedView)) {
      setView(requestedView);
    }
  }, [searchParams]);

  // 2. Active Interceptor: Force bounce to login if unauthenticated on a protected screen
  useEffect(() => {
    if (view === "reception-desk" && !authChecking && !authStatus?.authenticated) {
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