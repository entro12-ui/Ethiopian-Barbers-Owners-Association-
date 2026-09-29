import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { isLocale, type Locale } from "@/lib/i18n";
import { getMergedSiteContent } from "@/lib/site-content-db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale: Locale = isLocale(localeParam) ? localeParam : "am";

  try {
    if (isDatabaseConfigured()) {
      await initializeDatabase();
    }
    const content = await getMergedSiteContent(locale);
    return NextResponse.json(content, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("Public site-content error:", error);
    const content = await getMergedSiteContent(locale);
    return NextResponse.json(content, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
