"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Shield, Droplets, Clock, Activity, AlertTriangle, HardHat, Users, Sparkles } from "lucide-react";

export default function HealthSafety() {
  const { t } = useI18n();

  const topics = [
    { icon: Droplets, title: t.health.topics.workplaceHygiene.title, description: t.health.topics.workplaceHygiene.description },
    { icon: Shield, title: t.health.topics.toolSanitation.title, description: t.health.topics.toolSanitation.description },
    { icon: HardHat, title: t.health.topics.safePractices.title, description: t.health.topics.safePractices.description },
    { icon: Clock, title: t.health.topics.standingHours.title, description: t.health.topics.standingHours.description },
    { icon: Activity, title: t.health.topics.ergonomics.title, description: t.health.topics.ergonomics.description },
    { icon: AlertTriangle, title: t.health.topics.healthAwareness.title, description: t.health.topics.healthAwareness.description },
    { icon: Sparkles, title: t.health.topics.protectivePractices.title, description: t.health.topics.protectivePractices.description },
    { icon: Users, title: t.health.topics.customerHygiene.title, description: t.health.topics.customerHygiene.description },
  ];

  return (
    <section id="health-safety" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={t.health.title}
          subtitle={t.health.subtitle}
        />

        <AnimatedCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {topics.map((topic, i) => (
              <div
                key={topic.title}
                className="group flex items-start gap-3 p-4 bg-[#fff0de] rounded-sm hover:bg-gold/10 border border-transparent hover:border-gold/30 transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <topic.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal text-sm mb-1">{topic.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{topic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
