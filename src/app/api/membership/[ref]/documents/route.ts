import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { MEMBERSHIP_ID_CARD_TYPE, STAMPED_INVOICE_TYPE } from "@/lib/membership";
import { getApplicationDocumentByTypeForRef } from "@/lib/membership-db";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ ref: string }> };

const PUBLIC_DOCUMENT_TYPES = {
  "id-card": MEMBERSHIP_ID_CARD_TYPE,
  invoice: STAMPED_INVOICE_TYPE,
} as const;

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return new NextResponse(null, { status: 404 });
    }
    await initializeDatabase();

    const { ref } = await context.params;
    const type = request.nextUrl.searchParams.get("type") as keyof typeof PUBLIC_DOCUMENT_TYPES | null;
    const documentType = type ? PUBLIC_DOCUMENT_TYPES[type] : undefined;
    if (!documentType) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    const document = await getApplicationDocumentByTypeForRef(ref, documentType);
    if (!document || document.status !== "approved") {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(new Uint8Array(document.fileData), {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `attachment; filename="${document.fileName.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Membership document download error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
