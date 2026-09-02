import NewsPageClient from "@/components/posts/NewsPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "News",
  description: "News and announcements from the Ethiopian Barbers & Owners Association.",
  path: "/news",
});

export default function NewsPage() {
  return <NewsPageClient />;
}
