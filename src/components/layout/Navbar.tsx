"use client";

import { cn, scrollToSection } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import Logo from "@/components/ui/Logo";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    if (href.startsWith("#")) {
      scrollToSection(href.slice(1));
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-charcoal/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => handleNavClick("#home")}
            className="group"
            aria-label="Go to homepage"
          >
            <Logo size="md" priority className="group-hover:scale-[1.02] transition-transform" />
          </button>

          <div className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm text-gray-300 hover:text-gold transition-colors whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden xl:block">
            <Link href="/membership">
              <Button size="sm">Join Us</Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="xl:hidden p-2 text-white hover:text-gold transition-colors"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={cn(
                  "w-6 h-6 absolute inset-0 transition-all duration-300",
                  isMobileOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                )}
              />
              <X
                className={cn(
                  "w-6 h-6 absolute inset-0 transition-all duration-300",
                  isMobileOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "xl:hidden fixed inset-0 top-16 bg-charcoal/98 backdrop-blur-lg transition-all duration-300 overflow-y-auto",
          isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={cn(
                "text-left px-4 py-3 text-lg text-gray-300 hover:text-gold hover:bg-white/5 rounded-sm transition-all",
                isMobileOpen && "animate-fade-in"
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </button>
          ))}
          <div className="mt-4 px-4">
            <Link href="/membership" onClick={() => setIsMobileOpen(false)}>
              <Button className="w-full">Join Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
