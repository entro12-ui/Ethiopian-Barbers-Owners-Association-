"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { imagePath } from "@/lib/constants";
import { Scissors, Sparkles, Smile, Cpu, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: Scissors,
    title: "Modern Hair Styling",
    description: "Learn contemporary men's haircutting and styling techniques.",
  },
  {
    icon: Sparkles,
    title: "Beard Grooming",
    description: "Develop professional skills in beard shaping, trimming, styling, and maintenance.",
  },
  {
    icon: Smile,
    title: "Facial Care",
    description: "Introduce modern men's facial-care and grooming practices.",
  },
  {
    icon: Cpu,
    title: "Modern Technology",
    description: "Explore new tools, equipment, technologies, and international barbering trends.",
  },
  {
    icon: BookOpen,
    title: "Professional Training",
    description: "Support continuous learning and professional development.",
  },
];

export default function ProfessionalDevelopment() {
  return (
    <section id="development" className="py-20 md:py-28 bg-off-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 20px,
              #C5A55A 20px,
              #C5A55A 21px
            )`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title="Grow Your Skills. Modernize Your Craft."
          subtitle="The association supports professional barbers through modern education and exposure to international grooming techniques."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <AnimatedCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group p-6 bg-white rounded-sm border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-bold text-charcoal mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src={imagePath("photo_2026-08-31_14-38-47.jpg")}
                  alt="Professional beard grooming training"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-4 border-gold rounded-sm -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/20 rounded-sm -z-10" />
            </div>
          </AnimatedCard>
        </div>

        <AnimatedCard delay={300} className="text-center">
          <Link href="/membership">
            <Button size="lg">Become a Member</Button>
          </Link>
        </AnimatedCard>
      </div>
    </section>
  );
}
