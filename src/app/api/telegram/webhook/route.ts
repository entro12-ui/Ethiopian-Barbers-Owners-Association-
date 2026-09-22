import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import { linkTelegramChat } from "@/lib/membership-db";
import { sendTelegramText, startWelcomeMessage } from "@/lib/membership-telegram";

export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number };
    from?: { id?: number; username?: string };
  };
};

function extractStartPayload(text: string) {
  const match = text.match(/^\/start(?:@\w+)?(?:\s+(.+))?$/i);
  if (!match) return null;
  return (match[1] || "").trim();
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "telegram-webhook",
    hint: "POST Telegram updates here. Set webhook with setWebhook pointing to this URL.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const update = (await request.json()) as TelegramUpdate;
    const text = update.message?.text?.trim() || "";
    const chatId = update.message?.chat?.id ?? update.message?.from?.id;
    const username = update.message?.from?.username || null;

    if (!chatId) {
      return NextResponse.json({ ok: true });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ ok: true });
    }

    await initializeDatabase();

    // Any inbound message can link by Telegram username once the member has opened the bot.
    const startPayload = text ? extractStartPayload(text) : null;
    const isStart = startPayload !== null;

    if (!isStart && !username) {
      return NextResponse.json({ ok: true });
    }

    if (!isStart && username) {
      const linkedByUsername = await linkTelegramChat({
        chatId: String(chatId),
        telegramUsername: username,
      });
      if (linkedByUsername) {
        await sendTelegramText(
          String(chatId),
          startWelcomeMessage(linkedByUsername.applicationRef, true)
        ).catch(() => null);
      }
      return NextResponse.json({ ok: true });
    }

    // /start with or without payload
    if (!startPayload) {
      // Bare /start — still try username match from the form.
      const linked = await linkTelegramChat({
        chatId: String(chatId),
        telegramUsername: username,
      });
      if (linked) {
        await sendTelegramText(
          String(chatId),
          startWelcomeMessage(linked.applicationRef, true)
        ).catch(() => null);
      } else {
        await sendTelegramText(
          String(chatId),
          "Send /start with your application reference, or open the Start link from the membership confirmation page. Your Telegram username on the form must match this account."
        ).catch(() => null);
      }
      return NextResponse.json({ ok: true });
    }

    const linked = await linkTelegramChat({
      chatId: String(chatId),
      startPayload,
      telegramUsername: username,
    });

    const displayRef = linked?.applicationRef || startPayload.replace(/_/g, "-");
    await sendTelegramText(String(chatId), startWelcomeMessage(displayRef, Boolean(linked))).catch(
      () => null
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
