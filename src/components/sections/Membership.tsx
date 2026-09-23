"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { imagePath } from "@/lib/constants";
import { Scissors, Store, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Membership() {
  const { t } = useI18n();
  const prepare = t.membershipSection.prepareItems;

  const items = [
    { title: prepare.role.title, description: prepare.role.description, Icon: Scissors },
    { title: prepare.shop.title, description: prepare.shop.description, Icon: Store },
    { title: prepare.photos.title, description: prepare.photos.description, Icon: Camera },
  ] as const;

  return (
    <section id="membership" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-charcoal via-dark-gray to-brown">
      <div className="absolute inset-0 opacity-30">
        <Image
          src={imagePath("photo_2026-08-31_14-40-00.jpg")}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/90 via-dark-gray/80 to-brown/75" />
      </div>

      <div className="absolute top-8 right-8 w-52 h-52 bg-gold/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-64 h-64 bg-brown/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title={t.membershipSection.title}
          subtitle={t.membershipSection.subtitle}
          light
        />

        <AnimatedCard className="max-w-3xl mx-auto mb-10">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-gold-light font-bold mb-6">
            {t.membershipSection.prepareTitle}
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {items.map(({ title, description, Icon }, index) => (
              <div
                key={title}
                className="text-center sm:text-left animate-fade-in-up bg-white/10 border border-gold/30 p-5 rounded-sm backdrop-blur-md shadow-lg shadow-charcoal/20"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-charcoal mb-3 bg-gradient-to-br from-gold-light to-gold shadow-md shadow-gold/40">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg text-white mb-2">{title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard className="text-center">
          <Link href="/membership">
            <Button size="lg">{t.membershipSection.apply}</Button>
          </Link>
          <div className="mt-4">
            <Link href="/membership/status" className="text-sm text-gold-light font-medium hover:underline">
              {t.membershipSection.checkStatus}
            </Link>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
