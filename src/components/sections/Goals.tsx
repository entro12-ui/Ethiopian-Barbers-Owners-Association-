"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Heart, Shield, GraduationCap, Scissors, Sparkles, Users, Wrench, Network } from "lucide-react";

export default function Goals() {
  const { t } = useI18n();

  const goals = [
    {
      icon: Heart,
      title: t.goals.items.healthcare.title,
      description: t.goals.items.healthcare.description,
    },
    {
      icon: Shield,
      title: t.goals.items.workplaceSafety.title,
      description: t.goals.items.workplaceSafety.description,
    },
    {
      icon: GraduationCap,
      title: t.goals.items.professionalDevelopment.title,
      description: t.goals.items.professionalDevelopment.description,
    },
  ];

  const supporting = [
    { icon: Scissors, label: t.goals.supporting.skillsDevelopment },
    { icon: Sparkles, label: t.goals.supporting.modernTechniques },
    { icon: Shield, label: t.goals.supporting.hygieneSanitation },
    { icon: Heart, label: t.goals.supporting.occupationalHealth },
    { icon: Wrench, label: t.goals.supporting.technologyAdoption },
    { icon: Network, label: t.goals.supporting.professionalNetworking },
    { icon: Users, label: t.goals.supporting.communityDevelopment },
  ];

  return (
    <section id="goals" className="py-20 md:py-28 bg-charcoal">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={t.goals.title}
          subtitle={t.goals.subtitle}
          light
        />

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {goals.map((goal, i) => (
            <AnimatedCard key={goal.title} delay={i * 150}>
              <div className="group bg-dark-gray rounded-sm p-6 md:p-8 h-full hover:transform hover:-translate-y-2 transition-all duration-500 border border-white/5 hover:border-gold/30">
                <div className="w-12 h-12 bg-gold/20 rounded-sm flex items-center justify-center mb-4 group-hover:bg-gold/30 transition-colors">
                  <goal.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{goal.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{goal.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedCard delay={300}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {supporting.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm hover:border-gold/30 hover:bg-white/10 transition-all"
              >
                <item.icon className="w-4 h-4 text-gold" />
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
