import type { Locale } from "@/lib/i18n";

export const SITE_CONTENT_LOCALES = ["en", "am", "all"] as const;
export type SiteContentLocale = (typeof SITE_CONTENT_LOCALES)[number];

/** Bilingual marketing/copy sections */
export const BILINGUAL_SECTION_KEYS = [
  "hero",
  "about",
  "goals",
  "development",
  "health",
  "membershipSection",
  "gallery",
  "statistics",
  "cta",
  "faq",
  "contact",
] as const;

/** Shared settings (not language-specific) */
export const SHARED_SECTION_KEYS = ["contactSettings", "membershipPayment", "statsConfig"] as const;

export type BilingualSectionKey = (typeof BILINGUAL_SECTION_KEYS)[number];
export type SharedSectionKey = (typeof SHARED_SECTION_KEYS)[number];
export type SiteContentSectionKey = BilingualSectionKey | SharedSectionKey;

export interface StatsConfigPayload {
  mode: "auto" | "manual";
  barbers: number;
  barbershopOwners: number;
}

export interface ContactSettingsPayload {
  phone: string;
  email: string;
  mapEmbedUrl: string;
  mapLinkUrl: string;
  social: {
    facebook: string;
    youtube: string;
    tiktok: string;
    instagram: string;
    telegram: string;
  };
}

export interface MembershipPaymentPayload {
  bankName: string;
  accountName: string;
  accountNumber: string;
  telebirr: string;
  officerTitle: string;
  officerName: string;
  fees: {
    gold: string;
    silver: string;
    white: string;
  };
}

export type SiteContentPayload = Record<string, unknown>;

export interface SiteContentRow {
  key: string;
  locale: string;
  payload: SiteContentPayload;
  updatedAt: string;
}

export interface MergedSiteContent {
  locale: Locale;
  sections: Partial<Record<BilingualSectionKey, SiteContentPayload>>;
  contactSettings: ContactSettingsPayload;
  membershipPayment: MembershipPaymentPayload;
  statsConfig: StatsConfigPayload;
}

export function isBilingualSectionKey(key: string): key is BilingualSectionKey {
  return (BILINGUAL_SECTION_KEYS as readonly string[]).includes(key);
}

export function isSharedSectionKey(key: string): key is SharedSectionKey {
  return (SHARED_SECTION_KEYS as readonly string[]).includes(key);
}
