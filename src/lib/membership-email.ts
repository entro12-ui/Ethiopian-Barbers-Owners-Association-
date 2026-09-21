import { CONTACT, SITE_NAME } from "@/lib/constants";
import type { MembershipApplicationRecord } from "@/lib/membership-db";

function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

async function sendResendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: string }>;
}) {
  if (!resendConfigured()) return false;

  const from = process.env.CONTACT_EMAIL
    ? `${SITE_NAME} <${process.env.CONTACT_EMAIL}>`
    : `${SITE_NAME} <noreply@eboaethiopia.org>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      attachments: payload.attachments,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Resend email failed:", response.status, body);
    return false;
  }
  return true;
}

export async function notifyAdminNewMembership(application: {
  applicationRef: string;
  fullName: string;
  membershipLevel: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || CONTACT.email;
  return sendResendEmail({
    to: adminEmail,
    subject: `New membership application ${application.applicationRef}`,
    html: `<p>A new paid membership application is waiting for review.</p>
      <p><strong>Name:</strong> ${application.fullName}<br/>
      <strong>Reference:</strong> ${application.applicationRef}<br/>
      <strong>Level:</strong> ${application.membershipLevel}</p>
      <p>Open the admin dashboard to approve or reject this request.</p>`,
  });
}

export async function notifyMemberApproved(
  application: MembershipApplicationRecord,
  attachments: Array<{ filename: string; content: Buffer }>
) {
  if (!application.email) return false;
  return sendResendEmail({
    to: application.email,
    subject: `Your ${SITE_NAME} membership is approved`,
    html: `<p>Dear ${application.fullName},</p>
      <p>Your membership application <strong>${application.applicationRef}</strong> has been approved.</p>
      <p>Your membership ID is <strong>${application.membershipId}</strong>.</p>
      <p>Your membership identity card and official stamped invoice are attached.</p>`,
    attachments: attachments.map((file) => ({
      filename: file.filename,
      content: file.content.toString("base64"),
    })),
  });
}
