import PostForm from "@/components/admin/PostForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPostPage() {
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
        <h1 className="text-2xl font-bold text-charcoal mb-6">Create New Post</h1>
        <PostForm />
      </div>
    </div>
  );
}
