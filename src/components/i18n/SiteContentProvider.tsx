"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import {
  getDefaultBilingualSection,
  getDefaultContactSettings,
  getDefaultMembershipPayment,
  getDefaultStatsConfig,
} from "@/lib/site-content-defaults";
import {
  BILINGUAL_SECTION_KEYS,
  type BilingualSectionKey,
  type MergedSiteContent,
  type SiteContentPayload,
} from "@/lib/site-content-types";
import type { Locale } from "@/lib/i18n";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

function buildClientDefaults(locale: Locale): MergedSiteContent {
  const sections: Partial<Record<BilingualSectionKey, SiteContentPayload>> = {};
  for (const key of BILINGUAL_SECTION_KEYS) {
    sections[key] = getDefaultBilingualSection(key, locale);
  }
  return {
    locale,
    sections,
    contactSettings: getDefaultContactSettings(),
    membershipPayment: getDefaultMembershipPayment(),
    statsConfig: getDefaultStatsConfig(),
  };
}

const SiteContentContext = createContext<MergedSiteContent | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const defaults = useMemo(() => buildClientDefaults(locale), [locale]);
  const [content, setContent] = useState<MergedSiteContent>(defaults);

  useEffect(() => {
    setContent(defaults);
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/site-content?locale=${locale}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as MergedSiteContent;
        if (!cancelled) setContent(data);
      } catch {
        // Keep i18n/constants defaults
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [locale, defaults]);

  return (
    <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>
  );
}

export function useSiteContent(): MergedSiteContent {
  const context = useContext(SiteContentContext);
  const { locale } = useI18n();
  return context ?? buildClientDefaults(locale);
}

/** Merged bilingual section payload with typed fallback from i18n. */
export function useCmsSection<T extends SiteContentPayload>(
  key: BilingualSectionKey,
  fallback: T
): T {
  const { sections } = useSiteContent();
  const override = sections[key];
  if (!override) return fallback;
  return override as T;
}
