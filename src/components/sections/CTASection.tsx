"use client";

import Button from "@/components/ui/Button";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { scrollToSection } from "@/lib/utils";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-dark-gray via-charcoal to-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              rgba(197, 165, 90, 0.15) 60px,
              rgba(197, 165, 90, 0.15) 61px
            )`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative text-center">
        <AnimatedCard>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
            Shape the Future of Men&apos;s Grooming in Ethiopia
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join a growing professional community dedicated to better skills, healthier
            workplaces, and modern grooming standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership">
              <Button size="lg">Join the Association</Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("contact")}
            >
              Contact Us
            </Button>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
