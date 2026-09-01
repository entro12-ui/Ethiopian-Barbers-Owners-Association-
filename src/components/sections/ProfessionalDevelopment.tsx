"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { Scissors, Sparkles, Smile, Cpu, BookOpen } from "lucide-react";
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

        <AnimatedCard className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
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

        <AnimatedCard delay={300} className="text-center">
          <Link href="/membership">
            <Button size="lg">Become a Member</Button>
          </Link>
        </AnimatedCard>
      </div>
    </section>
  );
}
