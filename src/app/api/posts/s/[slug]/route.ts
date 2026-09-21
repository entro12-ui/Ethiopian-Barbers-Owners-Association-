import { NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { getPostBySlug } from "@/lib/posts-db";
import { serializePostForClient } from "@/lib/post-utils";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await initializeDatabase();
    const { slug } = await context.params;
    const post = await getPostBySlug(slug, true);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: serializePostForClient(post) });
  } catch (error) {
    console.error("Public get post error:", error);
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
