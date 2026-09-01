import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";
import { getSiteStatistics } from "@/lib/stats-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initializeDatabase();
    const stats = await getSiteStatistics();

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Statistics error:", error);
    return NextResponse.json({ error: "Failed to load statistics" }, { status: 500 });
  }
}
