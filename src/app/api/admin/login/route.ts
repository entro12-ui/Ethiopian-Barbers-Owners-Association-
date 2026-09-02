import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  getClearAdminSessionCookieOptions,
  verifyAdminCredentials,
  getAdminSession,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email as string;
    const password = body.password as string;

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createAdminSessionToken(email);
    const cookieStore = await cookies();
    cookieStore.set(getAdminSessionCookieOptions(token));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
