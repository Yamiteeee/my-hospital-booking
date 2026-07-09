"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/providers/Supabase/Client";

export function useVisitorCounter() {
  const [visitorNumber, setVisitorNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🛡️ BUILD PROTECTION: Prevent execution on Vercel's build servers
    if (typeof window === "undefined" || !supabaseClient) {
      setLoading(false);
      return;
    }

    async function handleSessionCounting() {
      try {
        const hasBeenCounted = sessionStorage.getItem("medva_counted_visit");

        if (!hasBeenCounted) {
          const { data, error } = await supabaseClient.rpc("increment_visitor_count");
          
          if (!error && data) {
            setVisitorNumber(Number(data));
            sessionStorage.setItem("medva_counted_visit", "true");
            setLoading(false);
          } else {
            await fallbackFetchAndSeed();
          }
        } else {
          await fallbackFetchAndSeed();
        }
      } catch (err) {
        setLoading(false);
      }
    }

    async function fallbackFetchAndSeed() {
      try {
        const { data } = await supabaseClient
          .from("site_metrics")
          .select("count")
          .eq("id", "total_visitors")
          .maybeSingle();
        
        if (data) {
          setVisitorNumber(Number(data.count));
        } else {
          const { data: newData } = await supabaseClient
            .from("site_metrics")
            .insert([{ id: "total_visitors", count: 1 }])
            .select("count")
            .maybeSingle();

          setVisitorNumber(newData ? Number(newData.count) : 1);
        }
      } catch (e) {
        setVisitorNumber(1);
      } finally {
        setLoading(false);
      }
    }

    handleSessionCounting();
  }, []);

  return { visitorNumber, loading };
}