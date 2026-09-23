"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { imagePath } from "@/lib/constants";
import { Eye, Target } from "lucide-react";
import Image from "next/image";

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="py-20 md:py-28 bg-off-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <AnimatedCard>
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl shadow-charcoal/15 ring-1 ring-gold/30 group">
              <Image
                src={imagePath("photo_2026-08-31_14-39-10.jpg")}
                alt={t.about.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-brown" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="space-y-6">
              <p className="text-[#1a5a6e] text-lg leading-relaxed">
                {t.about.paragraph1}
              </p>
              <p className="text-[#1a5a6e] leading-relaxed">
                {t.about.paragraph2}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-gold to-brown" />
                <span className="text-gold font-semibold tracking-wider text-sm uppercase">
                  {t.about.established}
                </span>
              </div>
            </div>
          </AnimatedCard>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <AnimatedCard delay={100}>
            <div className="group bg-white p-8 md:p-10 rounded-sm border border-[#ffd8a8] shadow-sm hover:shadow-xl hover:shadow-gold/15 hover:border-gold/50 hover:-translate-y-1 transition-all duration-500 h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-gold/20 to-brown/15 rounded-sm flex items-center justify-center mb-6 group-hover:from-gold/30 group-hover:to-brown/25 transition-colors">
                <Eye className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-4">{t.about.visionTitle}</h3>
              <p className="text-[#1a5a6e] leading-relaxed">
                {t.about.vision}
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="group bg-gradient-to-br from-charcoal via-dark-gray to-brown p-8 md:p-10 rounded-sm shadow-lg shadow-charcoal/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full ring-1 ring-gold/30">
              <div className="w-14 h-14 bg-gold/25 rounded-sm flex items-center justify-center mb-6 group-hover:bg-gold/35 transition-colors">
                <Target className="w-7 h-7 text-gold-light" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.about.missionTitle}</h3>
              <p className="text-white/80 leading-relaxed">
                {t.about.mission}
              </p>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
