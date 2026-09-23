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
          className="object-cover scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/92 via-dark-gray/75 to-brown/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent to-gold/20" />
      </div>

      <div className="absolute -right-16 top-1/4 w-80 h-80 rounded-full bg-gold/30 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute left-1/4 -bottom-10 w-[28rem] h-48 bg-brown/40 blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-charcoal text-xs uppercase tracking-[0.2em] font-bold mb-5 animate-fade-in-up bg-gradient-to-r from-gold-light to-gold px-3 py-1.5 rounded-sm shadow-lg shadow-gold/30">
            EBOA
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up drop-shadow-lg">
            {t.hero.titleStart}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-[#ff7a00]">
              {t.hero.titleHighlight}
            </span>
            {t.hero.titleEnd}
          </h1>

          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl animate-fade-in-up animation-delay-200">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-gold/40 animate-fade-in-up animation-delay-600">
            {[
              { label: t.hero.values.professionalism, icon: "✦" },
              { label: t.hero.values.training, icon: "◈" },
              { label: t.hero.values.health, icon: "♦" },
              { label: t.hero.values.community, icon: "◆" },
            ].map((item) => (
              <div key={item.label} className="text-center rounded-sm bg-white/10 backdrop-blur-sm border border-gold/35 py-3 px-2 hover:bg-gold/15 hover:border-gold/60 transition-all duration-300">
                <span className="text-gold-light text-xl">{item.icon}</span>
                <p className="text-white/85 text-sm mt-1 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-light hover:text-white transition-colors animate-bounce"
        aria-label={t.hero.scrollAbout}
      >
        <ChevronDown className="w-8 h-8 drop-shadow" />
      </button>
    </section>
  );
}
