import { SITE_NAME, TELEGRAM_BOT_USERNAME } from "@/lib/constants";

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim());
}

export function getTelegramBotUsername() {
  const fromEnv = (process.env.TELEGRAM_BOT_USERNAME || "").replace(/^@+/, "").trim();
  return fromEnv || TELEGRAM_BOT_USERNAME;
}

/** Telegram start payloads prefer [A-Za-z0-9_]; convert hyphens for reliability. */
export function toTelegramStartPayload(applicationRef: string) {
  return applicationRef.trim().replace(/-/g, "_");
}

export function telegramBotDeepLink(applicationRef: string) {
  const username = getTelegramBotUsername();
  if (!username || !applicationRef.trim()) return null;
  const start = toTelegramStartPayload(applicationRef);
  return `https://t.me/${username}?start=${start}`;
}

async function telegramApi(method: string, body: FormData | Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const isForm = body instanceof FormData;
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
  });

  const data = (await response.json()) as {
    ok: boolean;
    description?: string;
    result?: unknown;
  };

  if (!response.ok || !data.ok) {
    throw new Error(data.description || `Telegram ${method} failed`);
  }
  return data.result;
}

export async function sendTelegramText(chatId: string, text: string) {
  return telegramApi("sendMessage", {
    chat_id: chatId,
    text,
  });
}

export async function sendDocumentViaTelegram(params: {
  chatId: string;
  fileName: string;
  pdf: Buffer;
  caption: string;
}) {
  const form = new FormData();
  form.append("chat_id", params.chatId);
  form.append("caption", params.caption.slice(0, 1024));
  form.append(
    "document",
    new Blob([new Uint8Array(params.pdf)], { type: "application/pdf" }),
    params.fileName
  );
  return telegramApi("sendDocument", form);
}

/** @deprecated Use sendDocumentViaTelegram */
export const sendInvoiceViaTelegram = sendDocumentViaTelegram;

export function approvalInvoiceCaption(application: {
  fullName: string;
  membershipId: string | null;
  applicationRef: string;
}) {
  return [
    `${SITE_NAME}`,
    `Dear ${application.fullName},`,
    `Your membership has been approved.`,
    application.membershipId ? `Membership ID: ${application.membershipId}` : "",
    `Application: ${application.applicationRef}`,
    `Your official invoice is attached.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function approvalIdCardCaption(application: {
  fullName: string;
  membershipId: string | null;
  applicationRef: string;
}) {
  return [
    `${SITE_NAME}`,
    `Dear ${application.fullName},`,
    `Your membership ID card is attached.`,
    application.membershipId ? `Membership ID: ${application.membershipId}` : "",
    `Application: ${application.applicationRef}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function startWelcomeMessage(applicationRef: string, linked: boolean) {
  if (linked) {
    return [
      `Thanks! Your Telegram is linked to application ${applicationRef}.`,
      `When an administrator approves your membership, your ID card and official invoice will be sent here.`,
    ].join("\n");
  }
  return [
    `Welcome to ${SITE_NAME}.`,
    applicationRef
      ? `We could not find application ${applicationRef}.`
      : `We could not match your Telegram account yet.`,
    `Open the Start link from your membership confirmation page (it includes your application reference), or make sure the Telegram username on your application matches this account.`,
  ].join("\n");
}
