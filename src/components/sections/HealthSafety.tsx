"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { Shield, Droplets, Clock, Activity, AlertTriangle, HardHat, Users, Sparkles } from "lucide-react";

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

export default function HealthSafety() {
  return (
    <section id="health-safety" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="Healthy Professionals. Safer Workplaces."
          subtitle="Protecting barbering professionals from occupational health challenges through education, training, and awareness."
        />

        <AnimatedCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
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
    </section>
  );
}
