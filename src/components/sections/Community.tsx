"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { imagePath } from "@/lib/constants";
import { Users, BookOpen, Heart, GraduationCap, Network, Trophy, TrendingUp } from "lucide-react";
import Image from "next/image";

const benefits = [
  { icon: Network, label: "Networking" },
  { icon: BookOpen, label: "Knowledge Sharing" },
  { icon: TrendingUp, label: "Professional Growth" },
  { icon: Heart, label: "Health Awareness" },
  { icon: GraduationCap, label: "Training" },
  { icon: Trophy, label: "Community Activities" },
  { icon: Users, label: "Industry Development" },
];

export default function Community() {
  return (
    <section id="community" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="More Than a Profession. A Community."
          subtitle="Connecting men's grooming professionals and creating opportunities for growth, health, and industry development."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedCard>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-sm overflow-hidden">
                <Image
                  src={imagePath("photo_2026-08-31_14-39-16.jpg")}
                  alt="Community gathering"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-square rounded-sm overflow-hidden mt-8">
                <Image
                  src={imagePath("photo_2026-08-31_14-40-16.jpg")}
                  alt="Professional networking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-square rounded-sm overflow-hidden -mt-8">
                <Image
                  src={imagePath("photo_2026-08-31_14-39-52.jpg")}
                  alt="Training workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-square rounded-sm overflow-hidden">
                <Image
                  src={imagePath("photo_2026-08-31_14-40-00.jpg")}
                  alt="Community activities"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              The association is more than a professional body — it is a community of
              passionate grooming professionals who support each other, share knowledge,
              and work together to elevate the standards of men&apos;s hairdressing in Ethiopia.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.label}
                  className="flex flex-col items-center gap-2 p-4 bg-off-white rounded-sm hover:bg-gold/5 transition-colors text-center"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-sm text-charcoal font-medium">{benefit.label}</span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
