"use client";

import React, { useState, useEffect } from "react";
import { Refine, DataProvider, BaseRecord, AuthProvider } from "@refinedev/core";
import { normalizeIncomingReason } from "@/utils/normalization";

const AUTHORIZED_IDS = [
  "VA-101", "VA-102", "MED-999", 
  "DOC-1", "DOC-2", "DOC-3", "DOC-4", "DOC-5"
];

const getLocalData = (resource: string): BaseRecord[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(`mock_${resource}`);
  if (!data && resource === "bookings") {
    const seed = [
      {
        id: "mock-1",
        patient_name: "Jane Smith",
        phone: "+1 (555) 019-2834",
        reason: "Department Target: Cardiovascular Medicine. Urgency level: urgent.",
        status: "confirmed",
        doctorId: "doc-1",
        timeSlot: "09:00",
        preferredDate: new Date().toISOString().split("T")[0],
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "mock-2",
        patient_name: "Alex Miller",
        phone: "+1 (555) 014-9921",
        reason: "Persistent migraines and visual aura disruptions.",
        status: "pending",
        doctorId: null,
        timeSlot: null,
        preferredDate: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
      }
    ];
    localStorage.setItem(`mock_${resource}`, JSON.stringify(seed));
    return seed;
  }
  return data ? JSON.parse(data) : [];
};

const setLocalData = (resource: string, data: BaseRecord[]) => {
  localStorage.setItem(`mock_${resource}`, JSON.stringify(data));
  window.dispatchEvent(new Event("local-data-update"));
};

const mockLocalStorageDataProvider = (): DataProvider => ({
  getList: async ({ resource, sorters }) => {
    let data = getLocalData(resource);
    
    if (resource === "bookings") {
      data = data.map((item: any) => ({
        ...item,
        normalized_reason: normalizeIncomingReason(item.reason),
        normalizedReason: normalizeIncomingReason(item.reason),
      }));
    }

    if (sorters?.[0]) {
      const { field, order } = sorters[0];
      data.sort((a, b) => (a[field] < b[field] ? (order === "asc" ? -1 : 1) : a[field] > b[field] ? (order === "asc" ? 1 : -1) : 0));
    }
    return { data: data as any, total: data.length };
  },

  create: async ({ resource, variables }) => {
    const data = getLocalData(resource);
    const newRecord = { id: Math.random().toString(36).substring(2, 9), ...(variables as object) };
    data.push(newRecord);
    setLocalData(resource, data);
    return { data: newRecord as any };
  },

  update: async ({ resource, id, variables }) => {
    const data = getLocalData(resource);
    const idx = data.findIndex((item) => String(item.id) === String(id));
    if (idx > -1) {
      const updatedRecord = { ...data[idx], ...(variables as object) };
      if (resource === "bookings") {
        updatedRecord.normalized_reason = normalizeIncomingReason(updatedRecord.reason);
        updatedRecord.normalizedReason = normalizeIncomingReason(updatedRecord.reason);
      }
      
      data[idx] = updatedRecord;
      setLocalData(resource, data);
      return { data: data[idx] as any };
    }
    throw new Error(`Record with id ${id} not found`);
  },

  getOne: async ({ resource, id }) => {
    const data = getLocalData(resource);
    const item = data.find((record) => String(record.id) === String(id));
    if (item) {
      if (resource === "bookings") {
        item.normalized_reason = normalizeIncomingReason(item.reason);
        item.normalizedReason = normalizeIncomingReason(item.reason);
      }
      return { data: item as any };
    }
    throw new Error(`Record with id ${id} not found`);
  },
  
  deleteOne: async () => { throw new Error("Not implemented"); },
  getApiUrl: () => "local-mock",
});

const vaAuthProvider: AuthProvider = {
  login: async (params) => {
    const id = params?.companyId || params?.username || params?.email;
    if (id && AUTHORIZED_IDS.includes(id.trim().toUpperCase())) {
      const cleanId = id.trim().toUpperCase();
      localStorage.setItem("va_token", cleanId);

      const redirectTarget = cleanId.startsWith("DOC-") ? "/doctor" : "/receptionist";
      return { success: true, redirectTo: redirectTarget };
    }
    return {
      success: false,
      error: { name: "Login Error", message: "Invalid Credentials. Please check your Staff ID Badge." },
    };
  },
  logout: async () => {
    localStorage.removeItem("va_token");
    // Explicit dispatch clear to sync local components instantly
    window.dispatchEvent(new Event("local-data-update"));
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    return localStorage.getItem("va_token") ? { authenticated: true } : { authenticated: false, redirectTo: "/login" };
  },
  // 🌟 FIX: Updated error handler block to prevent logging lockouts
  onError: async (error) => {
    console.error("Auth Interceptor Error:", error);
    
    // Force a logout redirect frame if we hit unauthenticated errors
    if (error?.status === 401 || error?.status === 403) {
      return { logout: true, redirectTo: "/login" };
    }
    
    // Allow standard application state routines to finish without firing hard rejections
    return { logout: false };
  },
  getPermissions: async () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("va_token");
    if (!token) return null;
    return token.toUpperCase().startsWith("DOC-") ? "doctor" : "receptionist";
  },
  getIdentity: async () => {
    const token = localStorage.getItem("va_token");
    if (!token) return null;
    return {
      id: token,
      name: token.startsWith("DOC-") ? `Physician [${token}]` : `Assistant [${token}]`
    };
  },
};

function RefineCoreConfig({ children }: { children: React.ReactNode }) {
  const [tokenState, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(localStorage.getItem("va_token"));

    const syncToken = () => {
      setTokenState(localStorage.getItem("va_token"));
    };

    window.addEventListener("local-data-update", syncToken);
    return () => window.removeEventListener("local-data-update", syncToken);
  }, []);

  const isDoctor = tokenState ? tokenState.toUpperCase().startsWith("DOC-") : false;

  return (
    <Refine
      dataProvider={mockLocalStorageDataProvider()}
      authProvider={vaAuthProvider}
      resources={[
        {
          name: "bookings",
          list: isDoctor ? "/doctor" : "/receptionist",
          create: "/",
          edit: isDoctor ? "/doctor/edit/:id" : "/receptionist/edit/:id",
        },
      ]}
      options={{ syncWithLocation: false }}
    >
      {children}
    </Refine>
  );
}

export function RefineGlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <RefineCoreConfig>
      {children}
    </RefineCoreConfig>
  );
}