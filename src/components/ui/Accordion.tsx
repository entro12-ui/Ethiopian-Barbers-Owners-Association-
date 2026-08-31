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
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-sm overflow-hidden bg-white"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={openIndex === index}
          >
            <span className="font-semibold text-charcoal pr-4">{item.question}</span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gold shrink-0 transition-transform duration-300",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === index ? "max-h-96" : "max-h-0"
            )}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-600 leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
