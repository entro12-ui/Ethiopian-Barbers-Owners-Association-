import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getApplicationDocument,
  getMembershipApplicationById,
  markTelegramInvoiceSent,
} from "@/lib/membership-db";
import { STAMPED_INVOICE_TYPE } from "@/lib/membership";
import {
  approvalInvoiceCaption,
  sendInvoiceViaTelegram,
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
      return NextResponse.json(
        {
          error:
            "Member has not started the Telegram bot yet. Ask them to open the Start link from their confirmation page.",
        },
        { status: 400 }
      );
    }

    const invoice = await getApplicationDocument(id, STAMPED_INVOICE_TYPE);
    if (!invoice) {
      return NextResponse.json({ error: "Official invoice PDF is missing" }, { status: 400 });
    }

    await sendInvoiceViaTelegram({
      chatId: application.telegramChatId,
      fileName: invoice.fileName,
      pdf: invoice.fileData,
      caption: approvalInvoiceCaption(application),
    });

    const updated = await markTelegramInvoiceSent(id);
    return NextResponse.json({ application: updated || application, sent: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin send Telegram invoice error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
