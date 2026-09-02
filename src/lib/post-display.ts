export function getPostTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    event: "Event",
    job: "Job",
    announcement: "Announcement",
    general: "General",
  };
  return labels[type] || type;
}

export function formatPostDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export interface PublicPost {
  id: string;
  slug: string;
  type: string;
  title: string;
  summary: string | null;
  body?: string;
  category: string | null;
  location: string | null;
  eventDate: string | null;
  applicationDeadline: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  imageUrl: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}
