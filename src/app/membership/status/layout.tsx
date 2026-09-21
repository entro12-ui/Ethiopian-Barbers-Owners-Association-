import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Status | EBOA Ethiopia",
  description:
    "Check your Ethiopian Barbers and Owners Association membership application status and download your ID card and official invoice after approval.",
};

export default function MembershipStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
