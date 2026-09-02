"use client";

import PostForm from "@/components/admin/PostForm";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/admin/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      }
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <p className="text-gray-500">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-charcoal mb-6">Edit Post</h1>
        <PostForm
          postId={id}
          existingImageUrl={(post.imageUrl as string) || null}
          defaultValues={{
            type: post.type as "event" | "job" | "announcement" | "general",
            title: post.title as string,
            summary: (post.summary as string) || "",
            body: post.body as string,
            category: (post.category as string) || "",
            location: (post.location as string) || "",
            eventDate: (post.eventDate as string) || "",
            applicationDeadline: (post.applicationDeadline as string) || "",
            contactEmail: (post.contactEmail as string) || "",
            contactPhone: (post.contactPhone as string) || "",
            status: post.status as "draft" | "published" | "archived",
          }}
        />
      </div>
    </div>
  );
}
