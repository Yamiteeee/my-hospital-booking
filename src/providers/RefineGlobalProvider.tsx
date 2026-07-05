"use client";

import React from "react";
import { Refine, DataProvider, BaseRecord } from "@refinedev/core";

// Helper function to seed initial data in localStorage if empty
const getLocalData = (resource: string): BaseRecord[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(`mock_${resource}`);
  if (!data) {
    // Seed some mock bookings so the Receptionist Section isn't blank on first boot
    if (resource === "bookings") {
      const initialBookings = [
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
      localStorage.setItem(`mock_bookings`, JSON.stringify(initialBookings));
      return initialBookings;
    }
    return [];
  }
  return JSON.parse(data);
};

const setLocalData = (resource: string, data: BaseRecord[]) => {
  localStorage.setItem(`mock_${resource}`, JSON.stringify(data));
  // Fire a custom event to notify all active components to re-fetch data
  window.dispatchEvent(new Event("local-data-update"));
};

// 1. Build Custom Reactive Local Storage Data Provider Engine
const mockLocalStorageDataProvider = (): DataProvider => ({
  getList: async ({ resource, sorters }) => {
    let data = getLocalData(resource);

    if (sorters && sorters.length > 0) {
      const { field, order } = sorters[0];
      data.sort((a, b) => {
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return { data: data as any, total: data.length };
  },

  create: async ({ resource, variables }) => {
    const data = getLocalData(resource);
    const newRecord = {
      id: Math.random().toString(36).substring(2, 9),
      ...(variables as object),
    };
    
    data.push(newRecord);
    setLocalData(resource, data);
    return { data: newRecord as any };
  },

  update: async ({ resource, id, variables }) => {
    const data = getLocalData(resource);
    const index = data.findIndex((item) => String(item.id) === String(id));
    
    if (index > -1) {
      data[index] = { ...data[index], ...(variables as object) };
      setLocalData(resource, data);
      return { data: data[index] as any };
    }
    throw new Error(`Record with id ${id} not found`);
  },

  getOne: async () => { throw new Error("Not implemented"); },
  deleteOne: async () => { throw new Error("Not implemented"); },
  getApiUrl: () => "local-mock",
});

interface ProviderProps {
  children: React.ReactNode;
}

export function RefineGlobalProvider({ children }: ProviderProps) {
  return (
    <Refine
      dataProvider={mockLocalStorageDataProvider()}
      resources={[
        {
          name: "bookings",
          list: "/receptionist",
          create: "/",
          edit: "/receptionist/edit/:id",
        }
      ]}
      options={{
        syncWithLocation: false, // Turned off for easy local state sandbox testing
      }}
    >
      {children}
    </Refine>
  );
}