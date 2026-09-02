"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import PostCard from "@/components/posts/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { PublicPost } from "@/lib/post-display";
import { useEffect, useState } from "react";

export default function NewsPageClient() {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [announcements, general] = await Promise.all([
        fetch("/api/posts?type=announcement", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/posts?type=general", { cache: "no-store" }).then((r) => r.json()),
      ]);
      const combined = [...(announcements.posts || []), ...(general.posts || [])].sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      );
      setPosts(combined);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-off-white min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="News & Updates"
            subtitle="Announcements and updates from the Ethiopian Barbers & Owners Association."
          />
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No news posted yet. Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} showType />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
