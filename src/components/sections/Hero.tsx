"use client";

import Button from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { imagePath } from "@/lib/constants";
import { scrollToSection } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={imagePath("photo_2026-08-31_14-38-33.jpg")}
          alt={t.hero.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/40" />
      </div>

      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(197, 165, 90, 0.1) 40px,
              rgba(197, 165, 90, 0.1) 41px
            )`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
            {t.hero.titleStart}
            <span className="text-gold">{t.hero.titleHighlight}</span>
            {t.hero.titleEnd}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl animate-fade-in-up animation-delay-200">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
            <Link href="/membership">
              <Button size="lg">{t.hero.join}</Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("about")}
            >
              {t.hero.learn}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 animate-fade-in-up animation-delay-600">
            {[
              { label: t.hero.values.professionalism, icon: "✦" },
              { label: t.hero.values.training, icon: "◈" },
              { label: t.hero.values.health, icon: "♦" },
              { label: t.hero.values.community, icon: "◆" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <span className="text-gold text-xl">{item.icon}</span>
                <p className="text-gray-400 text-sm mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-gold transition-colors animate-bounce"
        aria-label={t.hero.scrollAbout}
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
