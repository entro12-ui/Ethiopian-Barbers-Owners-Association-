import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { deletePost, getPostById, updatePost } from "@/lib/posts-db";
import { parseImageFromFormData, parsePostInputFromFormData, serializePostForClient } from "@/lib/post-utils";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const post = await getPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: serializePostForClient(post) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin get post error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const formData = await request.formData();
    const input = parsePostInputFromFormData(formData);
    const removeImage = formData.get("removeImage") === "true";

    let image;
    try {
      image = await parseImageFromFormData(formData);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Image")) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    const post = await updatePost(
      id,
      { ...input, image },
      { removeImage }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: serializePostForClient(post) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("Admin update post error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const deleted = await deletePost(id);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin delete post error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
