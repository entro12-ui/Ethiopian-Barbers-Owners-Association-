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
    <section id="about" className="py-20 md:py-28 bg-off-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <AnimatedCard>
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl">
              <Image
                src={imagePath("photo_2026-08-31_14-39-10.jpg")}
                alt={t.about.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                {t.about.paragraph1}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t.about.paragraph2}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-16 h-1 bg-gold" />
                <span className="text-gold font-semibold tracking-wider text-sm uppercase">
                  {t.about.established}
                </span>
              </div>
            </div>
          </AnimatedCard>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <AnimatedCard delay={100}>
            <div className="group bg-white p-8 md:p-10 rounded-sm border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-500 h-full">
              <div className="w-14 h-14 bg-gold/10 rounded-sm flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <Eye className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-4">{t.about.visionTitle}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.about.vision}
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="group bg-charcoal p-8 md:p-10 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 h-full">
              <div className="w-14 h-14 bg-gold/20 rounded-sm flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <Target className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.about.missionTitle}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t.about.mission}
              </p>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
