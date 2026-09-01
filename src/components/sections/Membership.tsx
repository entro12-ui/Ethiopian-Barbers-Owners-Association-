"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { imagePath } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function Membership() {
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
          title="Become a Member"
          subtitle="Join a professional community committed to modernizing men's hairdressing, improving workplace health and safety, and creating new opportunities for professional growth."
          light
        />

        <AnimatedCard className="text-center">
          <Link href="/membership">
            <Button size="lg">Apply for Membership</Button>
          </Link>
        </AnimatedCard>
      </div>
    </section>
  );
}
