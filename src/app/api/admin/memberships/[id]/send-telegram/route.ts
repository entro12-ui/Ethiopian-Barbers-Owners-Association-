import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getApplicationDocument,
  getMembershipApplicationById,
  markTelegramInvoiceSent,
} from "@/lib/membership-db";
import { MEMBERSHIP_ID_CARD_TYPE, STAMPED_INVOICE_TYPE } from "@/lib/membership";
import {
  approvalIdCardCaption,
  approvalInvoiceCaption,
  sendDocumentViaTelegram,
  telegramBotDeepLink,
  telegramConfigured,
} from "@/lib/membership-telegram";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }
    if (!telegramConfigured()) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not configured" },
        { status: 503 }
      );
    }

    await initializeDatabase();
    const { id } = await context.params;
    const application = await getMembershipApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    if (application.status !== "approved") {
      return NextResponse.json({ error: "Application is not approved yet" }, { status: 400 });
    }
    if (!application.telegramChatId) {
      const startLink = telegramBotDeepLink(application.applicationRef);
      return NextResponse.json(
        {
          error:
            "Member has not linked Telegram yet. Ask them to open the Start link (or press Start in the bot using the same Telegram username as on the application), then try again.",
          telegramBotLink: startLink,
          telegramUsername: application.telegramUsername,
        },
        { status: 400 }
      );
    }

    const invoice = await getApplicationDocument(id, STAMPED_INVOICE_TYPE);
    const idCard = await getApplicationDocument(id, MEMBERSHIP_ID_CARD_TYPE);
    if (!invoice && !idCard) {
      return NextResponse.json(
        { error: "Official invoice and ID card PDFs are missing" },
        { status: 400 }
      );
    }

    const sent: string[] = [];

    if (idCard) {
      await sendDocumentViaTelegram({
        chatId: application.telegramChatId,
        fileName: idCard.fileName,
        pdf: idCard.fileData,
        caption: approvalIdCardCaption(application),
      });
      sent.push("id_card");
    }

    if (invoice) {
      await sendDocumentViaTelegram({
        chatId: application.telegramChatId,
        fileName: invoice.fileName,
        pdf: invoice.fileData,
        caption: approvalInvoiceCaption(application),
      });
      sent.push("invoice");
    }

    const updated = await markTelegramInvoiceSent(id);
    return NextResponse.json({
      application: updated || application,
      sent: true,
      documents: sent,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin send Telegram documents error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
