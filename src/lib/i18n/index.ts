import am from "./am";
import en, { type Translations } from "./en";

export type Locale = "am" | "en";
export type { Translations };

export const DEFAULT_LOCALE: Locale = "am";
export const LOCALE_STORAGE_KEY = "eboa-locale";

export const LOCALE_OPTIONS: {
  code: Locale;
  nativeLabel: string;
  flag: string;
}[] = [
  { code: "am", nativeLabel: "አማርኛ", flag: "🇪🇹" },
  { code: "en", nativeLabel: "English", flag: "🇬🇧" },
];

export const translations: Record<Locale, Translations> = {
  am,
  en,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "am" || value === "en";
}

export function interpolate(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

export function getDateLocale(locale: Locale) {
  return locale === "am" ? "am-ET" : "en-US";
}
