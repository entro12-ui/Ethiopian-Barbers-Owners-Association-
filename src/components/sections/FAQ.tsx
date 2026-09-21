"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Accordion from "@/components/ui/Accordion";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function FAQ() {
  const { t } = useI18n();

  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={t.faq.title}
          subtitle={t.faq.subtitle}
        />

        <AnimatedCard className="max-w-3xl mx-auto">
          <Accordion items={[...t.faq.items]} />
        </AnimatedCard>
      </div>
    </section>
  );
}
