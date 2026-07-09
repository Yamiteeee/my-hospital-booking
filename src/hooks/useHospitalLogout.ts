"use client";

import { useLogout as useRefineLogout } from "@refinedev/core";

export function useHospitalLogout() {
  const { mutate: refineLogout } = useMutedRefineLogout();

  const performLogout = async () => {
    try {
      // 1. Instantly shred client-side session cookies manually
      document.cookie = "hospital_user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;";
      
      // 2. Wipe everything else clean
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      const executeFinalRedirect = () => {
        //  CRITICAL: Use native location re-routing over router.push() 
        // to forcefully break client-side rendering caches.
        window.location.href = "/login";
      };

      if (refineLogout) {
        refineLogout({}, { onSettled: executeFinalRedirect });
        return;
      }

      executeFinalRedirect();
    } catch (error) {
      console.error("Logout execution fault:", error);
      window.location.href = "/login";
    }
  };

  return { performLogout };
}

function useMutedRefineLogout() {
  try {
    return useRefineLogout();
  } catch {
    return { mutate: null };
  }
}