"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Store instance and animation frame references to manage memory cleanly
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis instance
    const lenis = new Lenis({
      duration: 1.1, // Slightly tightened for snappy web interactions
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95, // Normalized calibration for heavy tracking trackpads
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    // 2. Optimized conditional render loop (Saves CPU cycles)
    let isLooping = false;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    // Only invoke the frame loop when active velocity calculations are happening
    const startLoop = () => {
      if (!isLooping) {
        isLooping = true;
        rafIdRef.current = requestAnimationFrame(raf);
      }
    };

    const stopLoop = () => {
      if (isLooping) {
        isLooping = false;
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      }
    };

    // Listen to real-time micro-scroll changes to throttle loop executions
    lenis.on("scroll", (e) => {
      if (e.velocity !== 0) {
        startLoop();
      } else {
        stopLoop();
      }
    });

    // Fire initially to capture entry-page setups
    startLoop();

    // 3. Strict garbage collection on route change / unmount
    return () => {
      stopLoop();
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}