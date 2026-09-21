"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useEffect, useState } from "react";

interface StatItem {
  value: number;
  key: "barbers" | "barbershopOwners";
}

const defaultStats: StatItem[] = [
  { value: 0, key: "barbers" },
  { value: 0, key: "barbershopOwners" },
];

export default function Statistics() {
  const { t } = useI18n();
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/statistics", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setStats([
          { value: data.barbers, key: "barbers" },
          { value: data.barbershopOwners, key: "barbershopOwners" },
        ]);
      } catch {
        // Keep zeros if API unavailable
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

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
            {t.statistics.title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t.statistics.subtitle}
          </p>
        </AnimatedCard>

        <div className="grid grid-cols-2 gap-8 md:gap-12 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.key}
              value={isLoading ? 0 : stat.value}
              label={t.statistics[stat.key]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
