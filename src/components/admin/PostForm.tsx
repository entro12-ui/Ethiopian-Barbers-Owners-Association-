"use client";

import Button from "@/components/ui/Button";
import { PostFormData, postFormSchema } from "@/lib/post-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface PostFormProps {
  postId?: string;
  defaultValues?: Partial<PostFormData>;
  existingImageUrl?: string | null;
}

export default function PostForm({ postId, defaultValues, existingImageUrl }: PostFormProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      type: "event",
      status: "draft",
      summary: "",
      category: "",
      location: "",
      eventDate: "",
      applicationDeadline: "",
      contactEmail: "",
      contactPhone: "",
      ...defaultValues,
    },
  });

  const postType = watch("type");

  const onSubmit = async (data: PostFormData, statusOverride?: PostFormData["status"]) => {
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("title", data.title);
      formData.append("summary", data.summary || "");
      formData.append("body", data.body);
      formData.append("category", data.category || "");
      formData.append("location", data.location || "");
      formData.append("eventDate", data.eventDate || "");
      formData.append("applicationDeadline", data.applicationDeadline || "");
      formData.append("contactEmail", data.contactEmail || "");
      formData.append("contactPhone", data.contactPhone || "");
      formData.append("status", statusOverride || data.status);
      if (imageFile) formData.append("image", imageFile);
      if (removeImage) formData.append("removeImage", "true");

      const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
      const method = postId ? "PUT" : "POST";

      const response = await fetch(url, { method, body: formData });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save post");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : !removeImage && existingImageUrl
      ? existingImageUrl
      : null;

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-6 bg-white p-6 md:p-8 rounded-sm border border-gray-100 shadow-sm"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-charcoal mb-1">
            Post Type *
          </label>
          <select
            id="type"
            {...register("type")}
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
          >
            <option value="event">Event</option>
            <option value="job">Job</option>
            <option value="announcement">Announcement</option>
            <option value="general">General</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-charcoal mb-1">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-1">
          Title *
        </label>
        <input
          id="title"
          {...register("title")}
          className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-charcoal mb-1">
          Summary
        </label>
        <input
          id="summary"
          {...register("summary")}
          className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-charcoal mb-1">
          Body *
        </label>
        <textarea
          id="body"
          {...register("body")}
          rows={8}
          className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-y"
        />
        {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
      </div>

      {(postType === "event" || postType === "job") && (
        <div className="grid md:grid-cols-2 gap-4">
          {postType === "event" && (
            <>
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-charcoal mb-1">
                  Event Date *
                </label>
                <input
                  id="eventDate"
                  type="date"
                  {...register("eventDate")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.eventDate.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-charcoal mb-1">
                  Category
                </label>
                <input
                  id="category"
                  {...register("category")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </>
          )}
          {postType === "job" && (
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-charcoal mb-1">
                Application Deadline
              </label>
              <input
                id="applicationDeadline"
                type="date"
                {...register("applicationDeadline")}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          )}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-charcoal mb-1">
              Location
            </label>
            <input
              id="location"
              {...register("location")}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>
      )}

      {(postType === "job" || postType === "announcement" || postType === "general") && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-charcoal mb-1">
              Contact Email
            </label>
            <input
              id="contactEmail"
              type="email"
              {...register("contactEmail")}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-charcoal mb-1">
              Contact Phone
            </label>
            <input
              id="contactPhone"
              {...register("contactPhone")}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Cover Image</label>
        {previewUrl && (
          <div className="relative w-full h-48 mb-3 rounded-sm overflow-hidden bg-gray-100">
            <Image src={previewUrl} alt="Cover preview" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              setImageFile(e.target.files?.[0] || null);
              setRemoveImage(false);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-sm bg-gray-50">
            <Upload className="w-5 h-5 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-500">
              {imageFile ? imageFile.name : "Upload cover image (optional)"}
            </span>
          </div>
        </div>
        {existingImageUrl && !removeImage && (
          <button
            type="button"
            onClick={() => setRemoveImage(true)}
            className="text-sm text-red-600 mt-2 hover:underline"
          >
            Remove current image
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleSubmit((data) => onSubmit(data, "published"))}
        >
          Save & Publish
        </Button>
      </div>
    </form>
  );
}
