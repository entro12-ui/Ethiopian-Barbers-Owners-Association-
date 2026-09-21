import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  MEMBERSHIP_ID_CARD_TYPE,
  PAYMENT_INVOICE_TYPE,
  PHOTO_DOCUMENT_TYPES,
  STAMPED_INVOICE_TYPE,
} from "@/lib/membership";
import { getApplicationDocument } from "@/lib/membership-db";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const ADMIN_DOCUMENT_TYPES = new Set<string>([
  ...PHOTO_DOCUMENT_TYPES,
  PAYMENT_INVOICE_TYPE,
  MEMBERSHIP_ID_CARD_TYPE,
  STAMPED_INVOICE_TYPE,
]);

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    if (!isDatabaseConfigured()) {
      return new NextResponse(null, { status: 404 });
    }
    await initializeDatabase();

    const { id } = await context.params;
    const type = request.nextUrl.searchParams.get("type") || "";
    if (!ADMIN_DOCUMENT_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    const document = await getApplicationDocument(id, type);
    if (!document) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(new Uint8Array(document.fileData), {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `inline; filename="${document.fileName.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin membership document error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
