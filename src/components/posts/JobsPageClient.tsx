"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import PostCard from "@/components/posts/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { PublicPost } from "@/lib/post-display";
import { useEffect, useState } from "react";

export default function JobsPageClient() {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?type=job", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-off-white min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Job Opportunities"
            subtitle="Career and employment opportunities for barbers and barbershop owners."
          />
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No job posts yet. Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
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
