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
          "inline-block w-12 h-1 bg-gold mb-4",
          align === "center" ? "mx-auto" : ""
        )}
      />
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4",
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
            light ? "text-gray-300" : "text-gray-600"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
