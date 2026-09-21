"use client";

import { CONTACT } from "@/lib/constants";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { FacebookIcon, YoutubeIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import Logo from "@/components/ui/Logo";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = [
  { key: "about", href: "#about" },
  { key: "membership", href: "#membership" },
  { key: "goals", href: "#goals" },
  { key: "gallery", href: "#gallery" },
  { key: "contact", href: "#contact" },
] as const;

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-charcoal text-gray-300">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo size="lg" alt={t.site.logoAlt} className="mb-5" />
            <h3 className="text-white font-bold text-lg mb-4">{t.footer.association}</h3>
            <p className="text-sm leading-relaxed mb-4">
              {t.site.name} — {t.site.tagline}
            </p>
            <p className="text-sm leading-relaxed text-gray-400">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-gold transition-colors">
                    {t.nav[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t.footer.membership}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/membership" className="hover:text-gold transition-colors">
                  {t.footer.applyOnline}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-gold transition-colors">
                  {t.footer.adminLogin}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t.footer.contactSocial}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={`tel:${CONTACT.phone}`} className="hover:text-gold transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold transition-colors">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{t.contact.addressValue}</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a
                href={CONTACT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={CONTACT.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={CONTACT.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 {t.site.name}. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
