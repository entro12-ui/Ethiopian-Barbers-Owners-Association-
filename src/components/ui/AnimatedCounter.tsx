"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
  placeholder?: boolean;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  label,
  placeholder = false,
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm md:text-base text-gray-300 uppercase tracking-wider">
        {label}
      </div>
      {placeholder && (
        <div className="text-xs text-gray-500 mt-1 italic">*Placeholder value</div>
      )}
    </div>
  );
}
