"use client";

import React from "react";
import { Refine, DataProvider, BaseRecord, AuthProvider } from "@refinedev/core";

const AUTHORIZED_IDS = ["VA-101", "VA-102", "MED-999"];

const getLocalData = (resource: string): BaseRecord[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(`mock_${resource}`);
  if (!data && resource === "bookings") {
    const seed = [
      {
        id: "mock-1",
        patient_name: "Jane Smith",
        phone: "+1 (555) 019-2834",
        reason: "Department Target: Cardiology. Urgency level: urgent. Target Date: 2026-07-10",
        status: "confirmed",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "mock-2",
        patient_name: "Alex Miller",
        phone: "+1 (555) 014-9921",
        reason: "Persistent migraines and visual aura disruptions.",
        status: "pending",
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
    const data = getLocalData(resource);
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
      data[idx] = { ...data[idx], ...(variables as object) };
      setLocalData(resource, data);
      return { data: data[idx] as any };
    }
    throw new Error(`Record with id ${id} not found`);
  },

  getOne: async () => { throw new Error("Not implemented"); },
  deleteOne: async () => { throw new Error("Not implemented"); },
  getApiUrl: () => "local-mock",
});

const vaAuthProvider: AuthProvider = {
  login: async (params) => {
    const id = params?.companyId || params?.username || params?.email;
    if (id && AUTHORIZED_IDS.includes(id.trim().toUpperCase())) {
      localStorage.setItem("va_token", id.trim().toUpperCase());
      return { success: true, redirectTo: "/" };
    }
    return {
      success: false,
      error: { name: "Login Error", message: "Invalid Credentials. Please check your Company ID Badge." },
    };
  },
  logout: async () => {
    localStorage.removeItem("va_token");
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    return localStorage.getItem("va_token") ? { authenticated: true } : { authenticated: false, redirectTo: "/login" };
  },
  onError: async (error) => {
    console.error("Auth Error:", error);
    return { logout: false };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem("va_token");
    return token ? { id: token, name: `Assistant [${token}]` } : null;
  },
};

export function RefineGlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      dataProvider={mockLocalStorageDataProvider()}
      authProvider={vaAuthProvider}
      resources={[
        {
          name: "bookings",
          list: "/receptionist",
          create: "/",
          edit: "/receptionist/edit/:id",
        },
      ]}
      options={{ syncWithLocation: false }}
    >
      {children}
    </Refine>
  );
}