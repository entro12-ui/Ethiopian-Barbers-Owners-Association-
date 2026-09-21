import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { bindTelegramChatToApplication } from "@/lib/membership-db";
import { sendTelegramText, startWelcomeMessage } from "@/lib/membership-telegram";

export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number };
  };
};

export async function POST(request: NextRequest) {
  try {
    const update = (await request.json()) as TelegramUpdate;
    const text = update.message?.text?.trim() || "";
    const chatId = update.message?.chat?.id;

    if (!chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    if (!text.startsWith("/start")) {
      return NextResponse.json({ ok: true });
    }

    const payload = text.replace(/^\/start(?:@\w+)?/i, "").trim();
    if (!payload) {
      await sendTelegramText(
        String(chatId),
        "Send /start with your application reference, or open the Start link from the membership confirmation page."
      ).catch(() => null);
      return NextResponse.json({ ok: true });
    }

    if (!isDatabaseConfigured()) {
      await sendTelegramText(String(chatId), "Membership database is temporarily unavailable.").catch(
        () => null
      );
      return NextResponse.json({ ok: true });
    }

    await initializeDatabase();
    const linked = await bindTelegramChatToApplication(payload, String(chatId));
    await sendTelegramText(String(chatId), startWelcomeMessage(payload, Boolean(linked))).catch(
      () => null
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
