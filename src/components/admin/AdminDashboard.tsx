"use client";

import Button from "@/components/ui/Button";
import MembershipQueue from "@/components/admin/MembershipQueue";
import { getPostTypeLabel } from "@/lib/post-display";
import { Loader2, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface AdminPost {
  id: string;
  slug: string;
  type: "event" | "job" | "announcement" | "general";
  title: string;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [section, setSection] = useState<"posts" | "memberships">("posts");

  const loadPosts = useCallback(async () => {
    try {
      const url =
        filter === "all" ? "/api/admin/posts" : `/api/admin/posts?type=${filter}`;
      const response = await fetch(url, { cache: "no-store" });
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, router]);

  useEffect(() => {
    let cancelled = false;
    const url =
      filter === "all" ? "/api/admin/posts" : `/api/admin/posts?type=${filter}`;
    fetch(url, { cache: "no-store" })
      .then(async (response) => {
        if (cancelled) return null;
        if (response.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        setPosts(data.posts || []);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPosts([]);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleStatusChange = async (id: string, status: AdminPost["status"]) => {
    await fetch(`/api/admin/posts/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    loadPosts();
  };

  const statusColor = (status: string) => {
    if (status === "published") return "bg-green-100 text-green-800";
    if (status === "archived") return "bg-gray-100 text-gray-600";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-screen bg-off-white">
      <header className="bg-charcoal text-white border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">EBOA Admin</h1>
            <p className="text-gray-400 text-sm">
              {section === "memberships" ? "Review membership applications" : "Manage events, jobs, and announcements"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                View Site
              </Button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-gold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["posts", "memberships"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`px-4 py-2 text-sm rounded-sm capitalize transition-colors ${
                section === item
                  ? "bg-charcoal text-white font-semibold"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gold"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {section === "memberships" ? (
          <MembershipQueue />
        ) : (
        <>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "event", "job", "announcement", "general"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setIsLoading(true);
                  setFilter(type);
                }}
                className={`px-3 py-1.5 text-sm rounded-sm capitalize transition-colors ${
                  filter === type
                    ? "bg-gold text-charcoal font-semibold"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gold"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <Link href="/admin/posts/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Post
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm border border-gray-100">
            <p className="text-gray-500 mb-4">No posts yet.</p>
            <Link href="/admin/posts/new">
              <Button>Create your first post</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-charcoal">{post.title}</td>
                      <td className="px-4 py-3 text-gray-600">{getPostTypeLabel(post.type)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {post.status !== "published" && (
                            <button
                              onClick={() => handleStatusChange(post.id, "published")}
                              className="text-xs text-green-700 hover:underline"
                            >
                              Publish
                            </button>
                          )}
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="p-1.5 text-gray-500 hover:text-gold transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
}
