"use client";

import { LOCALE_OPTIONS, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LanguageSwitcherProps {
  variant?: "header" | "menu";
}

export default function LanguageSwitcher({ variant = "header" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = LOCALE_OPTIONS.find((option) => option.code === locale) ?? LOCALE_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const selectLocale = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  if (variant === "menu") {
    return (
      <div className="px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">{t.language.label}</p>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label={t.language.select}>
          {LOCALE_OPTIONS.map((option) => {
            const selected = option.code === locale;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => selectLocale(option.code)}
                aria-pressed={selected}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-3 rounded-sm text-sm font-semibold transition-all",
                  selected
                    ? "bg-gold text-charcoal"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-gold"
                )}
              >
                <span aria-hidden="true">{option.flag}</span>
                {option.nativeLabel}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-all",
          "text-gray-200 hover:text-gold hover:bg-white/5 border border-white/10 hover:border-gold/40",
          open && "text-gold border-gold/40 bg-white/5"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.language.select}
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="font-medium whitespace-nowrap">{current.nativeLabel}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.language.select}
          className="absolute right-0 mt-2 w-44 bg-charcoal/98 backdrop-blur-md border border-white/10 rounded-sm shadow-xl shadow-black/40 overflow-hidden z-50 animate-slide-up"
        >
          {LOCALE_OPTIONS.map((option) => {
            const selected = option.code === locale;
            return (
              <button
                key={option.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectLocale(option.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors",
                  selected ? "bg-gold/15 text-gold" : "text-gray-200 hover:bg-white/5 hover:text-gold"
                )}
              >
                <span aria-hidden="true">{option.flag}</span>
                <span className="flex-1">{option.nativeLabel}</span>
                {selected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
