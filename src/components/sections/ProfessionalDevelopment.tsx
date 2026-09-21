"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Scissors, Sparkles, Smile, Cpu, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ProfessionalDevelopment() {
  const { t } = useI18n();

  const features = [
    {
      icon: Scissors,
      title: t.development.features.modernHairStyling.title,
      description: t.development.features.modernHairStyling.description,
    },
    {
      icon: Sparkles,
      title: t.development.features.beardGrooming.title,
      description: t.development.features.beardGrooming.description,
    },
    {
      icon: Smile,
      title: t.development.features.facialCare.title,
      description: t.development.features.facialCare.description,
    },
    {
      icon: Cpu,
      title: t.development.features.modernTechnology.title,
      description: t.development.features.modernTechnology.description,
    },
    {
      icon: BookOpen,
      title: t.development.features.professionalTraining.title,
      description: t.development.features.professionalTraining.description,
    },
  ];

  return (
    <section id="development" className="py-20 md:py-28 bg-off-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 20px,
              #C5A55A 20px,
              #C5A55A 21px
            )`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title={t.development.title}
          subtitle={t.development.subtitle}
        />

        <AnimatedCard className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group p-6 bg-white rounded-sm border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-bold text-charcoal mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard delay={300} className="text-center">
          <Link href="/membership">
            <Button size="lg">{t.development.becomeMember}</Button>
          </Link>
        </AnimatedCard>
      </div>
    </section>
  );
}
