import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";
import {
  ALLOWED_FILE_TYPES,
  FILE_FIELD_MAP,
  MAX_FILE_SIZE,
  parseYearsOfExperience,
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
    const applicantType = formData.get("applicantType") as string;
    const agreement = formData.get("agreement") === "true";

    const data = {
      fullName: formData.get("fullName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      profession: formData.get("profession") as string,
      barbershopName: (formData.get("barbershopName") as string) || undefined,
      yearsOfExperience: formData.get("yearsOfExperience") as string,
      barbershopAddress: (formData.get("barbershopAddress") as string) || undefined,
      applicantType: applicantType as "owner" | "barber",
      agreement: agreement as true,
    };

    const result = membershipFormSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const parsed = result.data;

    const nationalId = formData.get("nationalId") as File | null;
    const photo1 = formData.get("photo1") as File | null;
    const photo2 = formData.get("photo2") as File | null;
    const businessLicense = formData.get("businessLicense") as File | null;
    const cocCertificate = formData.get("cocCertificate") as File | null;
    const workExperience = formData.get("workExperience") as File | null;

    if (!nationalId?.size) {
      return NextResponse.json({ error: "National ID or Driver's License is required" }, { status: 400 });
    }
    if (!photo1?.size || !photo2?.size) {
      return NextResponse.json({ error: "Both membership photos are required" }, { status: 400 });
    }
    if (parsed.applicantType === "owner" && !businessLicense?.size) {
      return NextResponse.json({ error: "Business license is required for barbershop owners" }, { status: 400 });
    }
    if (parsed.applicantType === "barber" && !cocCertificate?.size && !workExperience?.size) {
      return NextResponse.json(
        { error: "COC certificate or proof of work experience is required for barbers" },
        { status: 400 }
      );
    }

    const documents: DocumentInput[] = [];

    for (const [field, documentType] of Object.entries(FILE_FIELD_MAP)) {
      const file = formData.get(field) as File | null;
      if (!file?.size) continue;

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File "${field}" exceeds maximum size of 5MB` }, { status: 400 });
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File "${field}" has invalid type. Allowed: JPEG, PNG, WebP, PDF` },
          { status: 400 }
        );
      }

      documents.push({
        documentType,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileData: Buffer.from(await file.arrayBuffer()),
      });
    }

    let yearsOfExperience: number;
    try {
      yearsOfExperience = parseYearsOfExperience(parsed.yearsOfExperience);
    } catch {
      return NextResponse.json({ error: "Invalid years of experience" }, { status: 400 });
    }

    const application = await createMembershipApplication(
      {
        fullName: parsed.fullName,
        dateOfBirth: parsed.dateOfBirth,
        phone: parsed.phone,
        email: parsed.email,
        address: parsed.address,
        city: parsed.city,
        profession: parsed.profession,
        barbershopName: parsed.barbershopName,
        yearsOfExperience,
        barbershopAddress: parsed.barbershopAddress,
        applicantType: parsed.applicantType,
        agreement: parsed.agreement,
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
