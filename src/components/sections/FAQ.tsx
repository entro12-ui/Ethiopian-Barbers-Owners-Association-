"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Accordion from "@/components/ui/Accordion";
import { FAQ_ITEMS } from "@/lib/constants";

export default function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about membership and the association."
        />

        <AnimatedCard className="max-w-3xl mx-auto">
          <Accordion items={FAQ_ITEMS} />
        </AnimatedCard>
      </div>
    </section>
  );
}
