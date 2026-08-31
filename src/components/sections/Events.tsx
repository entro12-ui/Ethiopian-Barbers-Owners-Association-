"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { EVENTS, EVENT_CATEGORIES, imagePath } from "@/lib/constants";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents =
    activeCategory === "All"
      ? EVENTS
      : EVENTS.filter((event) => event.category === activeCategory);

  return (
    <section id="events" className="py-20 md:py-28 bg-charcoal">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="Events"
          subtitle="Training programs, community activities, and professional development opportunities."
          light
        />

        <AnimatedCard className="mb-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {EVENT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm rounded-sm transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gold text-charcoal font-semibold"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimatedCard>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event, i) => (
            <AnimatedCard key={event.id} delay={i * 80}>
              <article className="group bg-dark-gray rounded-sm overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={imagePath(event.image)}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-gold/90 text-charcoal text-xs font-semibold rounded-sm">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-white mb-2 group-hover:text-gold transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">
                    {event.description}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Register
                  </Button>
                </div>
              </article>
            </AnimatedCard>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <p className="text-center text-gray-400 py-12">No events found in this category.</p>
        )}
      </div>
    </section>
  );
}
