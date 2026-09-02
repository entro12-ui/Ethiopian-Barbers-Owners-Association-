import EventsPageClient from "@/components/posts/EventsPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Events",
  description: "Upcoming events from the Ethiopian Barbers & Owners Association.",
  path: "/events",
});

export default function EventsPage() {
  return <EventsPageClient />;
}
