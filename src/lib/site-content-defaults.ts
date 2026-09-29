import { CONTACT, MEMBERSHIP_PAYMENT } from "@/lib/constants";
import am from "@/lib/i18n/am";
import en from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n";
import type {
  BilingualSectionKey,
  ContactSettingsPayload,
  MembershipPaymentPayload,
  SiteContentPayload,
  StatsConfigPayload,
} from "@/lib/site-content-types";

const LOCALE_COPY = { en, am } as const;

function pickBilingual(locale: Locale, key: BilingualSectionKey): SiteContentPayload {
  const t = LOCALE_COPY[locale];
  switch (key) {
    case "hero":
      return { ...t.hero };
    case "about":
      return { ...t.about };
    case "goals":
      return { ...t.goals };
    case "development":
      return { ...t.development };
    case "health":
      return { ...t.health };
    case "membershipSection":
      return { ...t.membershipSection };
    case "gallery":
      return {
        title: t.gallery.title,
        subtitle: t.gallery.subtitle,
        categories: { ...t.gallery.categories },
      };
    case "statistics":
      return { ...t.statistics };
    case "cta":
      return { ...t.cta };
    case "faq":
      return {
        title: t.faq.title,
        subtitle: t.faq.subtitle,
        items: t.faq.items.map((item) => ({ ...item })),
      };
    case "contact":
      return {
        title: t.contact.title,
        subtitle: t.contact.subtitle,
        phone: t.contact.phone,
        email: t.contact.email,
        officeAddress: t.contact.officeAddress,
        addressValue: t.contact.addressValue,
        addressValueAmharic: t.contact.addressValueAmharic,
        followUs: t.contact.followUs,
        mapsOpen: t.contact.mapsOpen,
        mapsTitle: t.contact.mapsTitle,
        formTitle: t.contact.formTitle,
      };
    default:
      return {};
  }
}

export function getDefaultBilingualSection(
  key: BilingualSectionKey,
  locale: Locale
): SiteContentPayload {
  return pickBilingual(locale, key);
}

export function getDefaultContactSettings(): ContactSettingsPayload {
  return {
    phone: CONTACT.phone,
    email: CONTACT.email,
    mapEmbedUrl: CONTACT.mapEmbedUrl,
    mapLinkUrl: CONTACT.mapLinkUrl,
    social: { ...CONTACT.social },
  };
}

export function getDefaultMembershipPayment(): MembershipPaymentPayload {
  return {
    bankName: MEMBERSHIP_PAYMENT.bankName,
    accountName: MEMBERSHIP_PAYMENT.accountName,
    accountNumber: MEMBERSHIP_PAYMENT.accountNumber,
    telebirr: MEMBERSHIP_PAYMENT.telebirr,
    officerTitle: MEMBERSHIP_PAYMENT.officerTitle,
    officerName: MEMBERSHIP_PAYMENT.officerName,
    fees: { ...MEMBERSHIP_PAYMENT.fees },
  };
}

export function getDefaultStatsConfig(): StatsConfigPayload {
  return {
    mode: "auto",
    barbers: 0,
    barbershopOwners: 0,
  };
}

/** Deep-merge plain objects; arrays replace entirely. */
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown> | null | undefined
): T {
  if (!override || typeof override !== "object") return base;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v === undefined) continue;
    const current = out[k];
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      out[k] = deepMerge(
        current as Record<string, unknown>,
        v as Record<string, unknown>
      );
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

export function mergePayload<T extends object>(
  base: T,
  override: Record<string, unknown> | null | undefined
): T {
  return deepMerge(
    base as unknown as Record<string, unknown>,
    override
  ) as unknown as T;
}
