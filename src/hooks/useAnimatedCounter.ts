import { useState, useEffect } from "react";

export interface UseAnimatedCounterProps {
  target: number;
  duration?: number;
}

export function useAnimatedCounter({ target, duration = 1500 }: UseAnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress); // Standard easeOutQuad
      
      setCount(easeProgress * target);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };
    
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return Number.isInteger(target) ? Math.floor(count) : parseFloat(count.toFixed(1));
}