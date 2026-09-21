import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  listMembershipApplications,
  type ApplicationStatus,
} from "@/lib/membership-db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ applications: [] });
    }
    await initializeDatabase();

    const status = request.nextUrl.searchParams.get("status") as ApplicationStatus | null;
    const applications = await listMembershipApplications(status || undefined);
    return NextResponse.json({ applications });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin list memberships error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
