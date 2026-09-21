"use client";

import { cn, scrollToSection } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isHome = pathname === "/";

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

  const handleAnchorClick = (href: string) => {
    setIsMobileOpen(false);
    const id = href.replace("/#", "").replace("#", "");
    if (isHome) {
      scrollToSection(id);
    }
  };

  const renderNavItem = (link: (typeof NAV_LINKS)[number], mobile = false) => {
    const label = t.nav[link.key];
    const isAnchor = link.href.includes("#");
    const className = mobile
      ? cn(
          "text-left px-4 py-3 text-lg text-gray-300 hover:text-gold hover:bg-white/5 rounded-sm transition-all",
          isMobileOpen && "animate-fade-in"
        )
      : "px-3 py-2 text-sm text-gray-300 hover:text-gold transition-colors whitespace-nowrap";

    if (isAnchor) {
      if (isHome) {
        return (
          <button
            key={link.href}
            onClick={() => handleAnchorClick(link.href)}
            className={className}
          >
            {label}
          </button>
        );
      }
      return (
        <Link key={link.href} href={link.href} className={className} onClick={() => setIsMobileOpen(false)}>
          {label}
        </Link>
      );
    }

    return (
      <Link key={link.href} href={link.href} className={className} onClick={() => setIsMobileOpen(false)}>
        {label}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHome
          ? "bg-charcoal/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/#home" className="group" aria-label={t.nav.goHome}>
            <Logo size="md" priority alt={t.site.logoAlt} className="group-hover:scale-[1.02] transition-transform" />
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => renderNavItem(link))}
          </div>

          <div className="hidden xl:flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/membership">
              <Button size="sm">{t.nav.joinUs}</Button>
            </Link>
          </div>

          <div className="xl:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-white hover:text-gold transition-colors"
              aria-label={isMobileOpen ? t.nav.closeMenu : t.nav.openMenu}
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
            <div key={link.href} style={{ animationDelay: `${i * 50}ms` }}>
              {renderNavItem(link, true)}
            </div>
          ))}
          <LanguageSwitcher variant="menu" />
          <div className="mt-4 px-4">
            <Link href="/membership" onClick={() => setIsMobileOpen(false)}>
              <Button className="w-full">{t.nav.joinUs}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
