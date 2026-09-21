"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Button from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { formatPostDate, getPostTypeLabel, PublicPost } from "@/lib/post-display";
import { Calendar, MapPin, Mail, Phone, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostDetailClient({ slug }: { slug: string }) {
  const { locale, t } = useI18n();
  const [post, setPost] = useState<PublicPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/s/${slug}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setPost(d?.post || null))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-off-white pt-24 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">{t.common.postNotFound}</p>
        <Link href="/"><Button>{t.common.backToHome}</Button></Link>
      </div>
    );
  }

  const date = post.eventDate || post.applicationDeadline || post.publishedAt;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-off-white min-h-screen">
        <article className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.common.back}
          </Link>

          <span className="inline-block px-3 py-1 bg-gold/20 text-charcoal text-sm font-semibold rounded-sm mb-4">
            {getPostTypeLabel(post.type, t.posts.types)}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{post.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8">
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatPostDate(date, locale)}
              </span>
            )}
            {post.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {post.location}
              </span>
            )}
          </div>

          {post.imageUrl && (
            <div className="relative w-full h-64 md:h-80 rounded-sm overflow-hidden mb-8">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          )}

          {post.summary && (
            <p className="text-lg text-gray-700 mb-6 font-medium">{post.summary}</p>
          )}

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.body}</p>
          </div>

          {(post.contactEmail || post.contactPhone) && (
            <div className="mt-10 p-6 bg-white rounded-sm border border-gray-100">
              <h2 className="font-semibold text-charcoal mb-3">{t.common.contact}</h2>
              <div className="space-y-2 text-sm text-gray-600">
                {post.contactEmail && (
                  <a href={`mailto:${post.contactEmail}`} className="flex items-center gap-2 hover:text-gold">
                    <Mail className="w-4 h-4" />
                    {post.contactEmail}
                  </a>
                )}
                {post.contactPhone && (
                  <a href={`tel:${post.contactPhone}`} className="flex items-center gap-2 hover:text-gold">
                    <Phone className="w-4 h-4" />
                    {post.contactPhone}
                  </a>
                )}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
