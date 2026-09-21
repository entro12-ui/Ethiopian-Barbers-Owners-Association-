"use client";

import Button from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { formatPostDate, getPostTypeLabel, PublicPost } from "@/lib/post-display";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: PublicPost;
  showType?: boolean;
}

export default function PostCard({ post, showType = false }: PostCardProps) {
  const { locale, t } = useI18n();
  const date = post.eventDate || post.applicationDeadline || post.publishedAt;

  return (
    <article className="group bg-white rounded-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-dark-gray" />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {showType && (
            <span className="px-2 py-1 bg-white/90 text-charcoal text-xs font-semibold rounded-sm">
              {getPostTypeLabel(post.type, t.posts.types)}
            </span>
          )}
          {post.category && (
            <span className="px-2 py-1 bg-gold/90 text-charcoal text-xs font-semibold rounded-sm">
              {post.category}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-charcoal mb-2 group-hover:text-gold transition-colors line-clamp-2">
          {post.title}
        </h3>
        {(date || post.location) && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatPostDate(date, locale)}
              </span>
            )}
            {post.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {post.location}
              </span>
            )}
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4 line-clamp-3">
          {post.summary || post.body}
        </p>
        <Link href={`/posts/${post.slug}`}>
          <Button size="sm" variant="outline" className="w-full">
            {t.common.readMore}
          </Button>
        </Link>
      </div>
    </article>
  );
}
