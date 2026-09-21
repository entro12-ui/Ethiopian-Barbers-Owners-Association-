import { NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { getPostImage } from "@/lib/posts-db";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return new NextResponse(null, { status: 404 });
    }

    await initializeDatabase();
    const { id } = await context.params;
    const image = await getPostImage(id);

    if (!image) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(new Uint8Array(image.data), {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Post image error:", error);
    return new NextResponse(null, { status: 404 });
  }
}
