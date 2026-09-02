import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  PHOTO_DOCUMENT_TYPES,
} from "@/lib/membership";
import {
  createMembershipApplication,
  getMembershipApplicationByRef,
  DocumentInput,
} from "@/lib/membership-db";
import { membershipFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const formData = await request.formData();

    const data = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || "",
      barbershopName: formData.get("barbershopName") as string,
      address: formData.get("address") as string,
      applicantType: formData.get("applicantType") as "owner" | "barber",
      membershipLevel: formData.get("membershipLevel") as "gold" | "silver" | "white",
    };

    const result = membershipFormSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const parsed = result.data;
    const documents: DocumentInput[] = [];
    const photoFiles = formData.getAll("photos") as File[];

    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      if (!file?.size) continue;

      if (i >= PHOTO_DOCUMENT_TYPES.length) break;

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Photo "${file.name}" exceeds maximum size of 5MB` },
          { status: 400 }
        );
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Photo "${file.name}" has invalid type. Allowed: JPEG, PNG, WebP` },
          { status: 400 }
        );
      }

      documents.push({
        documentType: PHOTO_DOCUMENT_TYPES[i],
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileData: Buffer.from(await file.arrayBuffer()),
      });
    }

    const application = await createMembershipApplication(
      {
        fullName: parsed.fullName,
        phone: parsed.phone,
        email: parsed.email || undefined,
        barbershopName: parsed.barbershopName,
        address: parsed.address,
        applicantType: parsed.applicantType,
        membershipLevel: parsed.membershipLevel,
      },
      documents
    );

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: application.applicationRef,
        status: application.status,
        submittedAt: application.submittedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Membership application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const ref = request.nextUrl.searchParams.get("ref");
    if (!ref) {
      return NextResponse.json({ error: "Application reference is required" }, { status: 400 });
    }

    const application = await getMembershipApplicationByRef(ref);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({
      applicationId: application.application_ref,
      fullName: application.full_name,
      status: application.status,
      applicantType: application.applicant_type,
      membershipLevel: application.membership_level,
      submittedAt: application.submitted_at,
      updatedAt: application.updated_at,
      reviewedAt: application.reviewed_at,
      documentsUploaded: application.documents_count,
    });
  } catch (error) {
    console.error("Membership status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
