"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { STATS } from "@/lib/constants";

export default function Statistics() {
  return (
    <section id="statistics" className="py-20 md:py-28 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C5A55A 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <AnimatedCard className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Impact
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Growing together as a professional community dedicated to excellence in men&apos;s grooming.
          </p>
        </AnimatedCard>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              placeholder={stat.placeholder}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
