import type { Metadata } from "next";
import { LOGO_ALT, LOGO_OG_PATH, LOGO_PATH, SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_SHORT_NAME} Ethiopia`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Ethiopian Barbers and Owners Association",
    "EBOA",
    "Barber Association Ethiopia",
    "Barbershop Owners Ethiopia",
    "Barber Training Ethiopia",
    "Men's Grooming Ethiopia",
    "Beard Grooming Ethiopia",
    "Professional Barbers Ethiopia",
  ],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_ET",
    images: [
      {
        url: LOGO_OG_PATH,
        width: 512,
        height: 512,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [LOGO_OG_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: LOGO_PATH,
    apple: LOGO_PATH,
  },
};

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description?: string;
  path: string;
}): Metadata {
  return {
    title,
    description: description ?? SITE_DESCRIPTION,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: description ?? SITE_DESCRIPTION,
      url: `${SITE_URL}${path}`,
    },
  };
}
