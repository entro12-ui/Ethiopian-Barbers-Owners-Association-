"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { GALLERY_CATEGORIES, GALLERY_ITEMS, imagePath, type GalleryCategoryKey } from "@/lib/constants";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export default function Gallery() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryKey>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goNext, goPrev]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-off-white relative overflow-hidden">
      <div className="absolute -left-20 top-40 w-64 h-64 bg-brown/15 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title={t.gallery.title}
          subtitle={t.gallery.subtitle}
        />

        <AnimatedCard className="mb-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm rounded-sm transition-all duration-300",
                  activeCategory === category
                    ? "bg-gradient-to-r from-gold-light to-gold text-charcoal font-semibold shadow-md shadow-gold/30"
                    : "bg-white text-[#1a5a6e] hover:bg-gold/10 border border-[#ffd8a8] hover:border-gold/50"
                )}
              >
                {t.gallery.categories[category]}
              </button>
            ))}
          </div>
        </AnimatedCard>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredItems.map((item, index) => (
            <AnimatedCard key={item.src} delay={index * 50}>
              <button
                onClick={() => openLightbox(index)}
                className="group relative block w-full break-inside-avoid rounded-sm overflow-hidden cursor-pointer ring-1 ring-[#ffd8a8] hover:ring-gold/50 shadow-sm hover:shadow-lg hover:shadow-gold/15 transition-all"
              >
                <Image
                  src={imagePath(item.src)}
                  alt={t.gallery.alts[item.altKey]}
                  width={400}
                  height={index % 3 === 0 ? 500 : index % 3 === 1 ? 350 : 450}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                      {t.gallery.categories[item.category]}
                    </span>
                  </div>
                </div>
              </button>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-charcoal/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 text-white hover:text-gold transition-colors z-10"
            aria-label={t.gallery.closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 md:left-8 p-2 text-white hover:text-gold transition-colors z-10"
            aria-label={t.gallery.previousImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 md:right-8 p-2 text-white hover:text-gold transition-colors z-10"
            aria-label={t.gallery.nextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imagePath(filteredItems[lightboxIndex].src)}
              alt={t.gallery.alts[filteredItems[lightboxIndex].altKey]}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto object-contain rounded-sm"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/80 to-transparent">
              <p className="text-white text-sm">{t.gallery.alts[filteredItems[lightboxIndex].altKey]}</p>
              <p className="text-gold text-xs mt-1">{t.gallery.categories[filteredItems[lightboxIndex].category]}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
