"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { imagePath } from "@/lib/constants";
import { Eye, Target } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-off-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="About the Association"
          subtitle="A professional organization dedicated to elevating men's hairdressing and grooming standards across Ethiopia."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <AnimatedCard>
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl">
              <Image
                src={imagePath("photo_2026-08-31_14-39-10.jpg")}
                alt="Professional barber training"
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
                The Ethiopian Hairdressers and Owners Association (EBOA) represents
                a united front of professional barbers, hairdressers, and barbershop
                owners committed to transforming the men&apos;s grooming industry in Ethiopia.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that modern skills, healthy workplaces, and strong community
                connections are the foundation of a respected and thriving profession.
                Our association works tirelessly to protect member interests, promote
                occupational health, and introduce international grooming standards.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-16 h-1 bg-gold" />
                <span className="text-gold font-semibold tracking-wider text-sm uppercase">
                  Est. Professional Excellence
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
              <h3 className="text-2xl font-bold text-charcoal mb-4">Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To modernize the art of men&apos;s hairdressing in Ethiopia; to build a
                strong and accessible association that protects the social and health
                interests of its members.
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="group bg-charcoal p-8 md:p-10 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 h-full">
              <div className="w-14 h-14 bg-gold/20 rounded-sm flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <Target className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To enhance the professional skills of men&apos;s hairdressing professionals
                and create awareness about health problems encountered in the workplace.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
