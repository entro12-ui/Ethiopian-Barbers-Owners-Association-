"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useCmsSection } from "@/components/i18n/SiteContentProvider";
import { Heart, Shield, GraduationCap, Scissors, Sparkles, Users, Wrench, Network } from "lucide-react";

export default function Goals() {
  const { t } = useI18n();
  const goalsCopy = useCmsSection("goals", t.goals);

  const goals = [
    {
      icon: Heart,
      title: goalsCopy.items.healthcare.title,
      description: goalsCopy.items.healthcare.description,
    },
    {
      icon: Shield,
      title: goalsCopy.items.workplaceSafety.title,
      description: goalsCopy.items.workplaceSafety.description,
    },
    {
      icon: GraduationCap,
      title: goalsCopy.items.professionalDevelopment.title,
      description: goalsCopy.items.professionalDevelopment.description,
    },
  ];

  const supporting = [
    { icon: Scissors, label: goalsCopy.supporting.skillsDevelopment },
    { icon: Sparkles, label: goalsCopy.supporting.modernTechniques },
    { icon: Shield, label: goalsCopy.supporting.hygieneSanitation },
    { icon: Heart, label: goalsCopy.supporting.occupationalHealth },
    { icon: Wrench, label: goalsCopy.supporting.technologyAdoption },
    { icon: Network, label: goalsCopy.supporting.professionalNetworking },
    { icon: Users, label: goalsCopy.supporting.communityDevelopment },
  ];

  return (
    <section id="goals" className="py-20 md:py-28 bg-[#fff0de] relative overflow-hidden">
      <div className="absolute -left-16 top-20 w-56 h-56 bg-gold/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-10 w-48 h-48 bg-brown/20 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title={goalsCopy.title}
          subtitle={goalsCopy.subtitle}
        />

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {goals.map((goal, i) => (
            <AnimatedCard key={goal.title} delay={i * 150}>
              <div className="group bg-white rounded-sm p-6 md:p-8 h-full hover:-translate-y-2 transition-all duration-500 border border-[#ffd8a8] hover:border-gold/50 shadow-sm hover:shadow-lg hover:shadow-gold/15">
                <div className="w-12 h-12 bg-gradient-to-br from-gold/25 to-brown/20 rounded-sm flex items-center justify-center mb-4 group-hover:from-gold/40 group-hover:to-brown/30 transition-colors">
                  <goal.icon className="w-6 h-6 text-charcoal" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-3">{goal.title}</h3>
                <p className="text-[#1a5a6e] text-sm leading-relaxed">{goal.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedCard delay={300}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {supporting.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ffd8a8] rounded-sm hover:border-gold hover:bg-gold/10 transition-all"
              >
                <item.icon className="w-4 h-4 text-gold" />
                <span className="text-sm text-charcoal font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
