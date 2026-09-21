import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: isDatabaseConfigured(),
  });
}
