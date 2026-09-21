import type { Locale, Translations } from "@/lib/i18n";
import { getDateLocale } from "@/lib/i18n";
import en from "@/lib/i18n/en";

export function getPostTypeLabel(type: string, labels: Translations["posts"]["types"] = en.posts.types): string {
  if (type in labels) {
    return labels[type as keyof typeof labels];
  }
  return type;
}

export function formatPostDate(date: string | null, locale: Locale = "en"): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(getDateLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export interface PublicPost {
  id: string;
  slug: string;
  type: string;
  title: string;
  summary: string | null;
  body?: string;
  category: string | null;
  location: string | null;
  eventDate: string | null;
  applicationDeadline: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  imageUrl: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}
