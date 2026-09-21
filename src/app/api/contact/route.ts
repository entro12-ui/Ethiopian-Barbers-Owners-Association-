import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { createContactMessage } from "@/lib/membership-db";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database is not configured. Messages cannot be saved right now." },
        { status: 503 }
      );
    }
    await initializeDatabase();

    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const message = await createContactMessage(result.data);

    return NextResponse.json(
      { message: "Message sent successfully", id: message.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
