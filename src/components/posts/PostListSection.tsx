"use client";

import PostCard from "@/components/posts/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { PublicPost } from "@/lib/post-display";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PostListSectionProps {
  type: "event" | "job" | "announcement" | "general";
  types?: ("announcement" | "general")[];
  title: string;
  subtitle: string;
  viewAllHref: string;
  viewAllLabel: string;
  limit?: number;
  light?: boolean;
  id?: string;
}

export default function PostListSection({
  type,
  types,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel,
  limit = 3,
  light = false,
  id,
}: PostListSectionProps) {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const query = types
          ? `/api/posts?types=${types.join(",")}&limit=${limit}`
          : `/api/posts?type=${type}&limit=${limit}`;
        const response = await fetch(query, { cache: "no-store" });
        const data = await response.json();
        setPosts(data.posts || []);
      } catch {
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [type, types, limit]);

  if (!isLoading && posts.length === 0) return null;

  return (
    <section id={id} className={`py-16 md:py-20 ${light ? "bg-charcoal" : "bg-off-white"}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} light={light} />
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="text-center">
              <Link href={viewAllHref}>
                <Button variant={light ? "outline" : "primary"}>{viewAllLabel}</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
