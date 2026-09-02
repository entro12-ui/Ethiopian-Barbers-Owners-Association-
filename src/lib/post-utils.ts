import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/membership";
import { parsePostFormData } from "@/lib/post-validations";
import { PostInput } from "@/lib/posts-db";

export async function parseImageFromFormData(
  formData: FormData
): Promise<PostInput["image"] | undefined> {
  const file = formData.get("image") as File | null;
  if (!file?.size) return undefined;

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Image exceeds maximum size of 5MB`);
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Invalid image type. Allowed: JPEG, PNG, WebP");
  }

  return {
    fileName: file.name,
    mimeType: file.type,
    data: Buffer.from(await file.arrayBuffer()),
  };
}

export function parsePostInputFromFormData(formData: FormData): PostInput {
  const parsed = parsePostFormData({
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    summary: (formData.get("summary") as string) || "",
    body: formData.get("body") as string,
    category: (formData.get("category") as string) || "",
    location: (formData.get("location") as string) || "",
    eventDate: (formData.get("eventDate") as string) || "",
    applicationDeadline: (formData.get("applicationDeadline") as string) || "",
    contactEmail: (formData.get("contactEmail") as string) || "",
    contactPhone: (formData.get("contactPhone") as string) || "",
    status: (formData.get("status") as string) || "draft",
  });

  return {
    type: parsed.type,
    title: parsed.title,
    summary: parsed.summary || undefined,
    body: parsed.body,
    category: parsed.category || undefined,
    location: parsed.location || undefined,
    eventDate: parsed.eventDate || undefined,
    applicationDeadline: parsed.applicationDeadline || undefined,
    contactEmail: parsed.contactEmail || undefined,
    contactPhone: parsed.contactPhone || undefined,
    status: parsed.status,
  };
}

export function serializePostForClient(post: {
  id: string;
  slug: string;
  type: string;
  title: string;
  summary: string | null;
  body: string;
  category: string | null;
  location: string | null;
  eventDate: string | null;
  applicationDeadline: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  hasImage: boolean;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}) {
  return {
    ...post,
    imageUrl: post.hasImage ? `/api/posts/${post.id}/image` : null,
  };
}
