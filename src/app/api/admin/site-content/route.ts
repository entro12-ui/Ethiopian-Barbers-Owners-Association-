import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import {
  getAdminSiteContentBundle,
  seedSiteContentIfEmpty,
  upsertSiteContent,
  validateSectionUpdate,
} from "@/lib/site-content-db";
import type { SiteContentPayload } from "@/lib/site-content-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database is not configured" },
        { status: 503 }
      );
    }
    await initializeDatabase();
    await seedSiteContentIfEmpty();
    const bundle = await getAdminSiteContentBundle();
    return NextResponse.json(bundle);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin GET site-content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database is not configured" },
        { status: 503 }
      );
    }
    await initializeDatabase();
    await seedSiteContentIfEmpty();

    const body = (await request.json()) as {
      key?: string;
      locale?: string;
      payload?: SiteContentPayload;
    };

    const key = String(body.key || "").trim();
    const locale = String(body.locale || "").trim();
    const payload = body.payload;

    if (!key || !locale || !payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "key, locale, and payload are required" },
        { status: 400 }
      );
    }

    const valid = validateSectionUpdate(key, locale);
    if (!valid.ok) {
      return NextResponse.json({ error: valid.error }, { status: 400 });
    }

    const row = await upsertSiteContent(key, locale, payload);
    return NextResponse.json({ ok: true, row });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin PUT site-content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
