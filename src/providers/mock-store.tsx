"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Booking = {
  id: string;
  patient_name: string;
  phone: string;
  reason: string;
  status: "pending" | "confirmed" | "cancelled" | "checked-in";
  created_at: string;
};

type MockStoreContextType = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "created_at" | "status">) => void;
  updateStatus: (id: string, status: Booking["status"]) => void;
};

const MockStoreContext = createContext<MockStoreContextType | undefined>(undefined);

const INITIAL_MOCK_DATA: Booking[] = [
  {
    id: "1",
    patient_name: "Sarah Jenkins",
    phone: "+1 (555) 234-5678",
    reason: "Severe migraine and light sensitivity since yesterday morning.",
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: "2",
    patient_name: "Michael Chang",
    phone: "+1 (555) 876-5432",
    reason: "Routine cardiovascular follow-up checkup.",
    status: "confirmed",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
];

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_MOCK_DATA);

  const addBooking = (newBooking: Omit<Booking, "id" | "created_at" | "status">) => {
    const freshRecord: Booking = {
      ...newBooking,
      id: Math.random().toString(36).substring(7),
      status: "pending",
      created_at: new Date().toISOString(),
    };
    setBookings((prev) => [freshRecord, ...prev]);
  };

  const updateStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  return (
    <MockStoreContext.Provider value={{ bookings, addBooking, updateStatus }}>
      {children}
    </MockStoreContext.Provider>
  );
}

export function useMockStore() {
  const context = useContext(MockStoreContext);
  if (!context) throw new Error("useMockStore must be used within a MockStoreProvider");
  return context;
}