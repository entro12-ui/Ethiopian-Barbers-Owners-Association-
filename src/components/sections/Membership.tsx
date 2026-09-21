"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { imagePath } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function Membership() {
  const { t } = useI18n();

  return (
    <section id="membership" className="py-20 md:py-28 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src={imagePath("photo_2026-08-31_14-40-00.jpg")}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/90" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title={t.membershipSection.title}
          subtitle={t.membershipSection.subtitle}
          light
        />

        <AnimatedCard className="text-center">
          <Link href="/membership">
            <Button size="lg">{t.membershipSection.apply}</Button>
          </Link>
          <div className="mt-4">
            <Link href="/membership/status" className="text-sm text-gold hover:underline">
              {t.membershipSection.checkStatus}
            </Link>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
