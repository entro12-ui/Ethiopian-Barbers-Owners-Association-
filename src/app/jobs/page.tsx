import JobsPageClient from "@/components/posts/JobsPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Jobs",
  description: "Job opportunities from the Ethiopian Barbers & Owners Association.",
  path: "/jobs",
});

export default function JobsPage() {
  return <JobsPageClient />;
}
