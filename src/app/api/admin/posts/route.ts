import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { createPost, listPosts, PostType } from "@/lib/posts-db";
import { parseImageFromFormData, parsePostInputFromFormData, serializePostForClient } from "@/lib/post-utils";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const type = request.nextUrl.searchParams.get("type") as PostType | null;
    const posts = await listPosts({
      type: type || undefined,
      includeBody: false,
    });

    return NextResponse.json({ posts: posts.map(serializePostForClient) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin list posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const formData = await request.formData();
    const input = parsePostInputFromFormData(formData);
    const image = await parseImageFromFormData(formData);

    const post = await createPost({ ...input, image });

    return NextResponse.json({ post: serializePostForClient(post) }, { status: 201 });
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
    if (error instanceof Error && error.message.includes("Image")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Admin create post error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
