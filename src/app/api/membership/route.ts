import { NextRequest, NextResponse } from "next/server";
import { membershipFormSchema } from "@/lib/validations";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function POST(request: NextRequest) {
  try {
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

    const applicationId = `EBOA-${Date.now()}`;
    const uploadDir = path.join(process.cwd(), "uploads", applicationId);
    await mkdir(uploadDir, { recursive: true });

    const fileFields = [
      "nationalId",
      "businessLicense",
      "cocCertificate",
      "workExperience",
      "photo1",
      "photo2",
    ];

    for (const field of fileFields) {
      const file = formData.get(field) as File | null;
      if (file && file.size > 0) {
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File ${field} exceeds maximum size of 5MB` },
            { status: 400 }
          );
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: `File ${field} has invalid type. Allowed: JPEG, PNG, WebP, PDF` },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split(".").pop() || "bin";
        await writeFile(path.join(uploadDir, `${field}.${ext}`), buffer);
      }
    }

    const applicationData = {
      id: applicationId,
      ...result.data,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    await writeFile(
      path.join(uploadDir, "application.json"),
      JSON.stringify(applicationData, null, 2)
    );

    console.log("Membership application received:", applicationId);

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId,
        status: "pending",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Membership application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
