"use client";

import React from "react";
import { Refine, AuthProvider, LiveProvider } from "@refinedev/core";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { supabaseClient } from "@/providers/Supabase/Client";

const secureSupabaseAuthProvider: AuthProvider = {
  login: async ({ companyId }) => {
    if (!companyId) {
      return {
        success: false,
        error: { name: "Login Error", message: "Please enter your Company ID." },
      };
    }



    const { data: profile, error } = await supabaseClient
      .from("profiles")
      .select("badge_id, role, name")
      .ilike("badge_id", companyId.trim())
      .maybeSingle();

    if (error || !profile) {
      return {
        success: false,
        error: { name: "Login Error", message: "Invalid Company ID. Profile assignment not found." },
      };
    }

    // Persist session to localStorage
    localStorage.setItem("hospital_user_session", JSON.stringify(profile));
    
    // Set cookie for middleware route guarding
    document.cookie = `hospital_user_session=${profile.role}; path=/; max-age=86400; SameSite=Strict; Secure`;

    const redirectTarget = profile.role === "doctor" ? "/doctor" : "/receptionist";
    return { success: true, redirectTo: redirectTarget };
  },

  logout: async () => {
    localStorage.removeItem("hospital_user_session");
    document.cookie = "hospital_user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    if (typeof window === "undefined") return { authenticated: false, redirectTo: "/login" };

    const session = localStorage.getItem("hospital_user_session");
    
    // 🌟 READ THE ACTUAL LIVE COOKIE
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hospital_user_session="))
      ?.split("=")[1];

    // If either the cookie or local session is missing, fail fast
    if (!session || !cookieValue) {
      // Clean up remnants to avoid partial state contamination
      localStorage.removeItem("hospital_user_session");
      return { authenticated: false, redirectTo: "/login" };
    }

    try {
      const profile = JSON.parse(session);
      
      // Cross-verify that the role in localStorage matches the cookie token
      if (profile?.role !== cookieValue) {
        return { authenticated: false, redirectTo: "/login" };
      }

      return { authenticated: true };
    } catch {
      return { authenticated: false, redirectTo: "/login" };
    }
  },

  onError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      return { logout: true, redirectTo: "/login" };
    }
    return { logout: false };
  },

  getPermissions: async () => {
    const session = localStorage.getItem("hospital_user_session");
    if (!session) return null;
    const profile = JSON.parse(session);
    return profile?.role || null;
  },

  getIdentity: async () => {
    const session = localStorage.getItem("hospital_user_session");
    if (!session) return null;
    const profile = JSON.parse(session);
    return {
      id: profile.badge_id || profile.id,
      name: profile.name || "Hospital Staff",
      role: profile.role,
    };
  },
};

// 🛠️ CUSTOM REALTIME PATCH FOR SUPABASE MULTI-FILTER LIMITATION
const baseLiveProvider = liveProvider(supabaseClient);

const safeLiveProvider: LiveProvider = {
  ...baseLiveProvider,
  subscribe: ({ channel, types, params, callback }) => {
    const sanitizedParams = { ...params };

    // If Refine is passing down multiple filters from a table/list hook
    if (sanitizedParams.filters && sanitizedParams.filters.length > 1) {
      // Safely slice to only the first filter element to keep Supabase happy
      sanitizedParams.filters = [sanitizedParams.filters[0]];
    }

    return baseLiveProvider.subscribe({
      channel,
      types,
      params: sanitizedParams,
      callback: (event) => {
        // When a real-time event drops in, we bypass client-side checks 
        // and trigger a background refetch so the UI table updates instantly.
        callback(event);
      },
    });
  },
};

export function RefineGlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      dataProvider={dataProvider(supabaseClient)}
      liveProvider={safeLiveProvider} // 🚀 Using patched provider to manage web sockets smoothly
      authProvider={secureSupabaseAuthProvider}
      resources={[
        {
          name: "bookings",
          meta: { label: "Intake Pipeline Queues" }
        },
        {
          name: "doctors",
          meta: { 
            label: "Medical Staff Registry",
            idColumnName: "badge_id"
          }
        },
        {
          name: "leaves",
          meta: { label: "Staff Time Off Records" }
        }
      ]}
      options={{ 
        syncWithLocation: false,
        liveMode: "auto" // 🌟 Keeps live tracking enabled automatically
      }}
    >
      {children}
    </Refine>
  );
}