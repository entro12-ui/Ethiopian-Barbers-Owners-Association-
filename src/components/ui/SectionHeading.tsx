"use client";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        "mb-12 md:mb-16 transition-all duration-700",
        align === "center" ? "text-center" : "text-left",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      <div
        className={cn(
          "inline-block w-14 h-1 rounded-full mb-4 bg-gradient-to-r from-gold via-gold-light to-brown",
          align === "center" ? "mx-auto" : ""
        )}
      />
      <h2
        className={cn(
          "font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4",
          light ? "text-white" : "text-charcoal"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-lg md:text-xl max-w-3xl leading-relaxed",
            align === "center" ? "mx-auto" : "",
            light ? "text-white/85" : "text-[#1a5a6e]"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
