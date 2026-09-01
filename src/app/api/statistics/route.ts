import { NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { getSiteStatistics } from "@/lib/stats-db";
import { getFallbackSiteStatistics } from "@/lib/stats-fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(getFallbackSiteStatistics(), {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    await initializeDatabase();
    const stats = await getSiteStatistics();

    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Statistics error:", error);
    return NextResponse.json(getFallbackSiteStatistics(), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
