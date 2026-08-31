import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Membership | EBOA Ethiopia",
  description:
    "Apply online to join the Ethiopian Hairdressers and Owners Association. Complete the membership application form to become a professional member.",
};

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
