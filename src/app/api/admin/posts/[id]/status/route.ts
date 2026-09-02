import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { updatePostStatus, PostStatus } from "@/lib/posts-db";
import { postStatusSchema } from "@/lib/post-validations";
import { serializePostForClient } from "@/lib/post-utils";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const body = await request.json();
    const status = postStatusSchema.parse(body.status) as PostStatus;

    const post = await updatePostStatus(id, status);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: serializePostForClient(post) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin update post status error:", error);
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
}
