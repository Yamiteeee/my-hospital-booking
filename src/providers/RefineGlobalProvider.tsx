"use client";

import React from "react";
import { Refine, AuthProvider } from "@refinedev/core";
import { dataProvider } from "@refinedev/supabase";
import { supabaseClient } from "@/providers/Supabase/Client";

const secureSupabaseAuthProvider: AuthProvider = {
  login: async ({ companyId }) => {
    if (!companyId) {
      return {
        success: false,
        error: { name: "Login Error", message: "Please enter your Company ID." },
      };
    }

   // Add these logs right around your query block to spy on the transaction:
console.log("Searching database for badge_id matching:", companyId.trim());

const { data: profile, error } = await supabaseClient
  .from("profiles")
  .select("id, role, name, badge_id")
  .ilike("badge_id", companyId.trim()) // 🌟 Swapped .eq for .ilike
  .maybeSingle();

console.log("Database Response Data:", profile);
console.log("Database Response Error:", error);

    if (error || !profile) {
      return {
        success: false,
        error: { name: "Login Error", message: "Invalid Company ID. Profile assignment not found." },
      };
    }

    // 2. Save the matching profile locally to persist the session
    localStorage.setItem("hospital_user_session", JSON.stringify(profile));

    // 3. Automatically route them based on their database row string role
    const redirectTarget = profile.role === "doctor" ? "/doctor" : "/receptionist";
    return { success: true, redirectTo: redirectTarget };
  },

  logout: async () => {
    localStorage.removeItem("hospital_user_session");
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    // Session is valid if the metadata exists in localStorage
    const session = localStorage.getItem("hospital_user_session");
    return session ? { authenticated: true } : { authenticated: false, redirectTo: "/login" };
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
    };
  },
};

export function RefineGlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      dataProvider={dataProvider(supabaseClient)}
      authProvider={secureSupabaseAuthProvider}
      resources={[
        {
          name: "bookings",
          meta: { label: "Intake Pipeline Queues" }
        },
      ]}
      options={{ syncWithLocation: false }}
    >
      {children}
    </Refine>
  );
}