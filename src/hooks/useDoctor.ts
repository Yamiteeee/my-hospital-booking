"use client";

import { useGetIdentity, useLogout } from "@refinedev/core";
import { useDispatchEngine } from "@/hooks/useDispatchEngine";
import { useRouter } from "next/navigation";

// Define the interface to mirror your custom badge-id profile architecture
export interface UseDoctorIdentity {
  id?: string;
  badge_id?: string;
  name: string;
}

export function useDoctor() {
  const router = useRouter();
  const { data: identity, isLoading: identityLoading } = useGetIdentity<UseDoctorIdentity>();
  const { mutate: logout } = useLogout();

  const {
    bookings,
    doctors,
    selectedDate,
    setSelectedDate,
    handleStatusUpdate: baseStatusUpdate, // Alias the base engine update method
  } = useDispatchEngine();

  // Handle shift end with a deterministic navigation sequence
  const handleEndShift = () => {
    logout(
      {},
      {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
        onError: (err) => {
          console.warn("Soft logout redirect fallback triggered.", err);
          router.push("/login");
        },
      }
    );
  };

  // Compute Active Identifiers safely from badge_id context
  const activeDoctorId = (identity?.badge_id || identity?.id || "DOC-1").toUpperCase();

  // Cross-reference current doctor profile
  const currentDoctor = doctors?.find(
    (d: any) => (d?.badge_id || d?.id)?.toUpperCase() === activeDoctorId
  ) || {
    badge_id: activeDoctorId,
    name: identity?.name || "Physician Staff",
    specialty: "General Clinic",
    breaks: [],
  };

  // Filter out relevant patient appointments for the chosen calendar window
  // 🌟 MODIFIED: Removed strict exclusions so finished appointments ("completed") still render inside the agenda grid
  const dailyAppointments = (bookings || []).filter(
    (b) =>
      ((b as any).doctorId || (b as any).badge_id || (b as any).doctor_id)?.toUpperCase() === activeDoctorId &&
      b.preferredDate === selectedDate &&
      b.status !== "cancelled"
  );

  // 🌟 UPDATED LIFE-CYCLE METHOD SIGNATURE
  const handleStatusUpdate = async (
    bookingId: string, 
    status: "pending" | "confirmed" | "cancelled" | "checked_in" | "present" | "completed"
  ) => {
    try {
      await baseStatusUpdate(bookingId, status as any);
    } catch (error) {
      console.error("Failed to update patient status from physician terminal:", error);
    }
  };

  return {
    identity,
    identityLoading,
    selectedDate,
    setSelectedDate,
    currentDoctor,
    dailyAppointments,
    handleEndShift,
    handleStatusUpdate,
  };
}