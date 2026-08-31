"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { imagePath } from "@/lib/constants";
import {
  UserCheck,
  Calendar,
  FileText,
  CreditCard,
  Camera,
  Building2,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const requirements = [
  {
    number: 1,
    icon: Briefcase,
    title: "Professional Requirements",
    content: "Applicants must be a professional barber or owner of a barbershop.",
  },
  {
    number: 2,
    icon: Calendar,
    title: "Age",
    content: "Applicants must be 18 years and above.",
  },
  {
    number: 3,
    icon: FileText,
    title: "Application Form",
    content: "Complete the association's membership application form either in person or online.",
    action: true,
  },
  {
    number: 4,
    icon: CreditCard,
    title: "Copy of ID",
    content: "Provide a copy of a renewed Resident ID, Passport, or Driver's license.",
  },
  {
    number: 5,
    icon: Building2,
    title: "Work / Business Proof",
    content: "Barbershop owners: renewed business license. Barbers: COC certificate or proof of work experience.",
  },
  {
    number: 6,
    icon: Camera,
    title: "Photo",
    content: "Two recent head photographs for the membership ID.",
  },
  {
    number: 7,
    icon: UserCheck,
    title: "Fees",
    content: "Pay the registration fee and the first monthly subscription.",
  },
];

const processSteps = [
  { step: "01", title: "Check Eligibility", description: "Confirm that you meet the professional and age requirements." },
  { step: "02", title: "Complete Application", description: "Submit the membership application online or in person." },
  { step: "03", title: "Submit Documents", description: "Provide identification, professional/business proof, and photographs." },
  { step: "04", title: "Pay Membership Fees", description: "Pay the registration fee and first monthly subscription." },
  { step: "05", title: "Application Review", description: "The association reviews the submitted information." },
  { step: "06", title: "Become a Member", description: "Approved applicants receive their membership confirmation / membership ID." },
];

export default function Membership() {
  return (
    <>
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

      <section id="membership-requirements" className="py-20 md:py-28 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Requirements for Membership"
            subtitle="Everything you need to know before applying to join the association."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req, i) => (
              <AnimatedCard key={req.number} delay={i * 100}>
                <div className="group bg-white p-6 md:p-8 rounded-sm border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gold text-charcoal rounded-sm flex items-center justify-center font-bold text-lg">
                      {req.number}
                    </div>
                    <req.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-3">{req.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{req.content}</p>
                  {req.action && (
                    <Link href="/membership" className="inline-block mt-4">
                      <Button size="sm" variant="outline">Apply Online</Button>
                    </Link>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <section id="membership-process" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Membership Process"
            subtitle="A simple step-by-step guide to becoming a member of the association."
          />

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gold/20 -translate-y-1/2" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step, i) => (
                <AnimatedCard key={step.step} delay={i * 100}>
                  <div className="relative text-center group">
                    <div className="w-16 h-16 mx-auto bg-charcoal text-gold rounded-full flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-gold group-hover:text-charcoal transition-colors relative z-10">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-charcoal mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    {i < processSteps.length - 1 && (
                      <CheckCircle className="hidden lg:block absolute -right-4 top-6 w-6 h-6 text-gold/40" />
                    )}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
