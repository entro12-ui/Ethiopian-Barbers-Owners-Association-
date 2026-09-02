import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getClearAdminSessionCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(getClearAdminSessionCookieOptions());
  return NextResponse.json({ success: true });
}
