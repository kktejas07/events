import { db } from "@/lib/db";
import { NotificationChannel, NotificationType } from "../types";

export const WHATSAPP_CHANNEL_NAME = NotificationChannel.WHATSAPP;

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<head>[\s\S]*?<\/head>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getConfig(): Promise<{ apiUrl: string; apiKey: string }> {
  const rows = await db.platformSetting.findMany({
    where: { key: { in: ["WHATSAPP_API_URL", "WHATSAPP_API_KEY"] } },
  });
  const dbMap = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    apiUrl: dbMap.WHATSAPP_API_URL || process.env.WHATSAPP_API_URL || "",
    apiKey: dbMap.WHATSAPP_API_KEY || process.env.WHATSAPP_API_KEY || "",
  };
}

export async function sendWhatsAppNotification(
  type: NotificationType,
  to: string,
  htmlContent: string
): Promise<void> {
  const { apiUrl, apiKey } = await getConfig();

  if (!apiUrl || !apiKey) {
    console.warn(`[WhatsApp] Skipping ${type} to ${to}: WHATSAPP_API_URL or WHATSAPP_API_KEY not set`);
    return;
  }

  const plainText = stripHtml(htmlContent);
  const chatId = to.includes("@") ? to : `${to}@c.us`;

  await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      chatId,
      text: plainText,
    }),
  });
}
