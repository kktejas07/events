import { db } from "@/lib/db";
import { NotificationChannel, NotificationType } from "../types";
import { formatWhatsAppMessage } from "./whatsapp-formatter";
import { generateTicketPdf } from "@/lib/pdf/ticket-pdf";
import { generateInvoicePdf } from "@/lib/pdf/invoice-pdf";


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

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://events.forgetechno.com";
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

function docUrl(apiUrl: string): string {
  return apiUrl.replace(/\/messages\/send-text$/, "/messages/send-document");
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function sendWhatsAppNotification(
  type: NotificationType,
  to: string,
  htmlContent: string,
  waData?: Record<string, unknown>
): Promise<void> {
  const { apiUrl, apiKey } = await getConfig();

  if (!apiUrl || !apiKey) {
    console.warn(`[WhatsApp] Skipping ${type} to ${to}: WHATSAPP_API_URL or WHATSAPP_API_KEY not set`);
    return;
  }

  const chatId = to.includes("@") ? to : `${to}@c.us`;

  // For ticket confirmation — send PDF document
  if (type === NotificationType.TICKET_CONFIRMATION && waData) {
    try {
      const d = waData as {
        firstName: string;
        orderId: string;
        eventName: string;
        eventDate: string;
        eventVenue: string;
        tickets: { name: string; quantity: number; price: number }[];
        total: number;
      };
      const pdfBytes = await generateTicketPdf({
        orderId: d.orderId,
        eventName: d.eventName,
        eventDate: d.eventDate,
        eventVenue: d.eventVenue,
        attendeeName: d.firstName,
        ticketType: d.tickets.map((t) => `${t.name} x${t.quantity}`).join(", "),
        quantity: d.tickets.reduce((s, t) => s + t.quantity, 0),
        total: d.total,
        barcode: d.orderId,
      });
      const b64 = `data:application/pdf;base64,${toBase64(pdfBytes)}`;
      const caption = formatWhatsAppMessage(type, waData);
      await fetch(docUrl(apiUrl), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({
          chatId,
          base64: b64,
          mimetype: "application/pdf",
          filename: `tickets-${d.orderId}.pdf`,
          caption,
        }),
      });
    } catch (err) {
      console.error("[WhatsApp] Failed to send ticket PDF, falling back to text:", err);
      const plainText = formatWhatsAppMessage(type, waData);
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ chatId, text: plainText }),
      });
    }
    return;
  }

  // For order receipt — send invoice PDF
  if (type === NotificationType.ORDER_RECEIPT && waData) {
    try {
      const d = waData as {
        firstName: string;
        orderId: string;
        eventName: string;
        paymentMethod: string;
        paidAt: string;
        items: { description: string; amount: number }[];
        subtotal: number;
        tax: number;
        total: number;
      };
      const pdfBytes = await generateInvoicePdf({
        orderId: d.orderId,
        eventName: d.eventName,
        paymentMethod: d.paymentMethod,
        paidAt: d.paidAt,
        items: d.items,
        subtotal: d.subtotal,
        tax: d.tax,
        total: d.total,
        customerName: d.firstName,
      });
      const b64 = `data:application/pdf;base64,${toBase64(pdfBytes)}`;
      const caption = formatWhatsAppMessage(type, waData);
      await fetch(docUrl(apiUrl), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({
          chatId,
          base64: b64,
          mimetype: "application/pdf",
          filename: `invoice-${d.orderId}.pdf`,
          caption,
        }),
      });
    } catch (err) {
      console.error("[WhatsApp] Failed to send invoice PDF, falling back to text:", err);
      const plainText = formatWhatsAppMessage(type, waData);
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ chatId, text: plainText }),
      });
    }
    return;
  }

  // For ID card — send image URL as text (more reliable than document/media)
  if (type === NotificationType.ID_CARD && waData) {
    try {
      const d = waData as {
        userId: string;
        name: string;
        email: string;
        memberSince: string;
        phone?: string;
        employeeId?: string;
      };
      const imageUrl = `${baseUrl()}/api/public/id-card-image/${d.userId}`;
      const cardUrl = `${baseUrl()}/id/${d.userId}`;
      const text = formatWhatsAppMessage(type, { firstName: d.name, userId: d.userId, imageUrl, cardUrl } as any);
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ chatId, text }),
      });
    } catch (err) {
      console.error("[WhatsApp] Failed to send ID card link:", err);
    }
    return;
  }

  // Default: send as text
  const plainText = waData
    ? formatWhatsAppMessage(type, waData)
    : stripHtml(htmlContent);

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
