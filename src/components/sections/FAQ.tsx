"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Accordion from "@/components/ui/Accordion";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useCmsSection } from "@/components/i18n/SiteContentProvider";

export default function FAQ() {
  const { t } = useI18n();
  const faq = useCmsSection("faq", t.faq);
  const items = Array.isArray(faq.items) ? faq.items : t.faq.items;

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#fff0de] relative overflow-hidden">
      <div className="absolute top-10 right-10 w-48 h-48 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title={faq.title}
          subtitle={faq.subtitle}
        />

        <AnimatedCard className="max-w-3xl mx-auto">
          <Accordion
            items={items.map((item) => ({
              question: String((item as { question?: string }).question ?? ""),
              answer: String((item as { answer?: string }).answer ?? ""),
            }))}
          />
        </AnimatedCard>
      </div>
    </section>
  );
}
