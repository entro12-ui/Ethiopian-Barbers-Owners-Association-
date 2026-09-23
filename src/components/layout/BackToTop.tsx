"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 left-6 z-50 w-12 h-12 bg-gradient-to-br from-gold-light to-gold text-charcoal rounded-sm flex items-center justify-center shadow-lg shadow-gold/40 hover:shadow-xl hover:shadow-gold/50 hover:-translate-y-1 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label={t.common.backToTop}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
