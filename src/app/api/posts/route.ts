import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { listPosts, PostType } from "@/lib/posts-db";
import { serializePostForClient } from "@/lib/post-utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ posts: [] });
    }

    await initializeDatabase();

    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type") as PostType | null;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const typesParam = searchParams.get("types");

    if (typesParam) {
      const types = typesParam.split(",") as PostType[];
      const maxLimit = limit || 10;
      const batches = await Promise.all(
        types.map((t) =>
          listPosts({ type: t, status: "published", limit: maxLimit, includeBody: false })
        )
      );
      const posts = batches
        .flat()
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
        )
        .slice(0, maxLimit);
      return NextResponse.json({ posts: posts.map(serializePostForClient) });
    }

    const posts = await listPosts({
      type: type || undefined,
      status: "published",
      limit,
      includeBody: false,
    });

    return NextResponse.json({ posts: posts.map(serializePostForClient) });
  } catch (error) {
    console.error("Public list posts error:", error);
    return NextResponse.json({ posts: [] });
  }
}
