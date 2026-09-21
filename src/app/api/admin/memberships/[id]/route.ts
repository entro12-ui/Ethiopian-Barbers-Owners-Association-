import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  approveMembershipApplication,
  getApplicationDocument,
  getMembershipApplicationById,
  peekNextMembershipId,
  rejectMembershipApplication,
} from "@/lib/membership-db";
import { PAYMENT_INVOICE_TYPE, PHOTO_DOCUMENT_TYPES } from "@/lib/membership";
import { generateOfficialDocuments } from "@/lib/membership-documents";
import { notifyMemberApproved } from "@/lib/membership-email";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    await initializeDatabase();
    const { id } = await context.params;
    const application = await getMembershipApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return NextResponse.json({ application });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin get membership error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }
    await initializeDatabase();
    const { id } = await context.params;
    const body = await request.json();
    const status = body.status as "approved" | "rejected";
    const reviewNotes = typeof body.reviewNotes === "string" ? body.reviewNotes : undefined;

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const current = await getMembershipApplicationById(id);
    if (!current) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (status === "rejected") {
      const application = await rejectMembershipApplication(id, reviewNotes);
      return NextResponse.json({ application });
    }

    const invoice = await getApplicationDocument(id, PAYMENT_INVOICE_TYPE);
    if (!invoice) {
      return NextResponse.json({ error: "Payment invoice is missing" }, { status: 400 });
    }

    const photoType = PHOTO_DOCUMENT_TYPES.find((type) =>
      current.documents.some((doc) => doc.documentType === type)
    );
    const photo = photoType ? await getApplicationDocument(id, photoType) : null;
    const photoInput = photo
      ? { mimeType: photo.mimeType, fileData: photo.fileData }
      : null;

    let application = null;
    let generated = null;
    let membershipId = await peekNextMembershipId();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      generated = await generateOfficialDocuments({
        application: { ...current, membershipId },
        membershipId,
        invoice: { mimeType: invoice.mimeType, fileData: invoice.fileData },
        photo: photoInput,
      });
      try {
        application = await approveMembershipApplication(id, generated, reviewNotes, membershipId);
        break;
      } catch (error) {
        const unique =
          error &&
          typeof error === "object" &&
          "code" in error &&
          (error as { code: string }).code === "23505";
        if (!unique || attempt === 2) throw error;
        membershipId = await peekNextMembershipId();
      }
    }

    if (!application || !generated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const stamped = generated.find((doc) => doc.documentType === "stamped_invoice");
    const idCard = generated.find((doc) => doc.documentType === "membership_id_card");
    if (application.email && stamped && idCard) {
      await notifyMemberApproved(application, [
        { filename: idCard.fileName, content: idCard.fileData },
        { filename: stamped.fileName, content: stamped.fileData },
      ]).catch((error) => console.error("Member approval email failed:", error));
    }

    return NextResponse.json({ application });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Application is already approved") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Admin update membership error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
