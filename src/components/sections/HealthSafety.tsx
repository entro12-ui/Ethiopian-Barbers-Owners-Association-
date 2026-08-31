"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { imagePath } from "@/lib/constants";
import { Shield, Droplets, Clock, Activity, AlertTriangle, HardHat, Users, Sparkles } from "lucide-react";
import Image from "next/image";

const topics = [
  { icon: Droplets, title: "Workplace Hygiene", description: "Maintaining clean and sanitized work environments." },
  { icon: Shield, title: "Tool Sanitation", description: "Proper cleaning and sterilization of equipment." },
  { icon: HardHat, title: "Safe Practices", description: "Implementing safe working procedures daily." },
  { icon: Clock, title: "Standing Hours", description: "Managing health risks from prolonged standing." },
  { icon: Activity, title: "Ergonomics", description: "Proper posture and workspace setup." },
  { icon: AlertTriangle, title: "Health Awareness", description: "Recognizing occupational health challenges." },
  { icon: Sparkles, title: "Protective Practices", description: "Personal protective equipment and habits." },
  { icon: Users, title: "Customer Hygiene", description: "Ensuring hygiene for clients and professionals." },
];

const stats = [
  { value: "8+", label: "Hours Daily Standing" },
  { value: "100%", label: "Hygiene Commitment" },
  { value: "24/7", label: "Safety Awareness" },
];

export default function HealthSafety() {
  return (
    <section id="health-safety" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="Healthy Professionals. Safer Workplaces."
          subtitle="Protecting barbering professionals from occupational health challenges through education, training, and awareness."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <AnimatedCard>
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-xl mb-8 lg:mb-0">
              <Image
                src={imagePath("photo_2026-08-31_14-39-23.jpg")}
                alt="Workplace safety training"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-gold">{stat.value}</div>
                      <div className="text-xs text-gray-300 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map((topic, i) => (
                <div
                  key={topic.title}
                  className="group flex items-start gap-3 p-4 bg-off-white rounded-sm hover:bg-gold/5 transition-colors"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                    <topic.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal text-sm mb-1">{topic.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{topic.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
