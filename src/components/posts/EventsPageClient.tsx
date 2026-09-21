"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import PostCard from "@/components/posts/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { PublicPost } from "@/lib/post-display";
import { useEffect, useState } from "react";

export default function EventsPageClient() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?type=event", { cache: "no-store" })
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
            title={t.posts.eventsPage.title}
            subtitle={t.posts.eventsPage.subtitle}
          />
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 py-16">{t.posts.eventsPage.empty}</p>
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
