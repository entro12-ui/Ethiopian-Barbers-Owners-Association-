"use client";

import Button from "@/components/ui/Button";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { scrollToSection } from "@/lib/utils";
import Link from "next/link";

export default function CTASection() {
  const { t } = useI18n();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-gold/40 via-off-white to-brown/30">
      <div className="absolute -top-16 left-1/4 w-80 h-80 bg-gold/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brown/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative text-center">
        <AnimatedCard>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-6 max-w-3xl mx-auto leading-tight">
            {t.cta.title}
          </h2>
          <p className="text-lg md:text-xl text-[#1a5a6e] mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership">
              <Button size="lg">{t.cta.join}</Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("contact")}
            >
              {t.cta.contact}
            </Button>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
