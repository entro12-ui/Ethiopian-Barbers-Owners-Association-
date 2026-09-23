"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={index}
            className={cn(
              "border rounded-sm overflow-hidden transition-all duration-300",
              open
                ? "border-gold/50 bg-gradient-to-br from-gold/10 to-brown/5 shadow-md shadow-gold/10"
                : "border-[#ffd8a8] bg-white hover:border-gold/40"
            )}
          >
            <button
              onClick={() => setOpenIndex(open ? null : index)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors"
              aria-expanded={open}
            >
              <span className="font-semibold text-charcoal pr-4">{item.question}</span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-colors",
                  open ? "bg-gold text-charcoal" : "bg-gold/15 text-gold"
                )}
              >
                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    open && "rotate-180"
                  )}
                />
              </span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                open ? "max-h-96" : "max-h-0"
              )}
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6 text-[#1a5a6e] leading-relaxed border-t border-gold/15">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
