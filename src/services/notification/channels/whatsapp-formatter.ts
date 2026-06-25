import { NotificationType } from "../types";

interface OTPData {
  firstName: string;
  otp: string;
  expiresInMinutes?: number;
}

interface WelcomeData {
  firstName: string;
  email: string;
}

interface TicketItem {
  name: string;
  quantity: number;
  price: number;
}

interface TicketPurchaseData {
  firstName: string;
  orderId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  tickets: TicketItem[];
  total: number;
}

interface OrderReceiptData {
  firstName: string;
  orderId: string;
  eventName: string;
  paymentMethod: string;
  paidAt: string;
  items: { description: string; amount: number }[];
  subtotal: number;
  tax: number;
  total: number;
}

interface EventReminderData {
  firstName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  daysAway: number;
}

interface PasswordResetData {
  firstName: string;
  resetLink: string;
}

function bold(text: string): string {
  return `*${text}*`;
}

function divider(): string {
  return `\n─────────────────\n`;
}

function header(icon: string, title: string): string {
  return `${icon} ${bold(title)}`;
}

function section(label: string, value: string): string {
  return `${label}: ${value}`;
}

export function formatWhatsAppMessage(
  type: NotificationType,
  data: Record<string, unknown>
): string {
  switch (type) {
    case NotificationType.OTP:
      return formatOTP(data as unknown as OTPData);
    case NotificationType.WELCOME:
      return formatWelcome(data as unknown as WelcomeData);
    case NotificationType.TICKET_CONFIRMATION:
      return formatTicketPurchase(data as unknown as TicketPurchaseData);
    case NotificationType.ORDER_RECEIPT:
      return formatOrderReceipt(data as unknown as OrderReceiptData);
    case NotificationType.EVENT_REMINDER:
      return formatEventReminder(data as unknown as EventReminderData);
    case NotificationType.PASSWORD_RESET:
      return formatPasswordReset(data as unknown as PasswordResetData);
    default:
      return "";
  }
}

function formatOTP(data: OTPData): string {
  const expiry = data.expiresInMinutes ?? 10;
  return [
    header("🔐", "Your Verification Code"),
    "",
    `Hi ${data.firstName},`,
    `Use the code below to verify your email address. It expires in ${expiry} minutes.`,
    "",
    bold(data.otp),
    "",
    `If you didn't request this code, you can safely ignore this message.`,
    "",
    `─ ${process.env.NEXT_PUBLIC_APP_NAME || "echo"}`,
  ].join("\n");
}

function formatWelcome(data: WelcomeData): string {
  return [
    header("👋", `Welcome, ${data.firstName}!`),
    "",
    `We're thrilled to have you join the echo community.`,
    `Your account has been created successfully with ${data.email}.`,
    "",
    "Explore upcoming events, grab your tickets, and be part of something extraordinary.",
    "From AI summits to tech conferences, the future starts here.",
    "",
    `👉 ${process.env.NEXT_PUBLIC_APP_URL || "https://events.forgetechno.com"}/events`,
    "",
    `─ ${process.env.NEXT_PUBLIC_APP_NAME || "echo"}`,
  ].join("\n");
}

function formatTicketPurchase(data: TicketPurchaseData): string {
  const lines = [
    header("🎫", "Purchase Confirmed!"),
    "",
    `Thanks ${data.firstName}! Your tickets for ${bold(data.eventName)} are confirmed.`,
    "",
    section("Order ID", data.orderId),
    section("Date", data.eventDate),
    section("Venue", data.eventVenue),
    "",
    divider(),
  ];

  lines.push(`  ${bold("Ticket")}`.padEnd(25) + bold("Qty").padEnd(10) + bold("Price"));
  for (const t of data.tickets) {
    lines.push(
      `  ${t.name}`.padEnd(25) + `${t.quantity}`.padEnd(10) + `₹${t.price}`
    );
  }
  lines.push(divider());
  lines.push(`  ${bold("Total")}`.padEnd(35) + `₹${data.total}`);
  lines.push("");
  lines.push("Your tickets and barcodes will be available in your dashboard. Present the QR code at the venue for entry.");
  lines.push("");
  lines.push(`👉 ${process.env.NEXT_PUBLIC_APP_URL || "https://events.forgetechno.com"}/my-tickets`);
  lines.push("");
  lines.push(`─ ${process.env.NEXT_PUBLIC_APP_NAME || "echo"}`);

  return lines.join("\n");
}

function formatOrderReceipt(data: OrderReceiptData): string {
  const lines = [
    header("🧾", "Payment Receipt"),
    "",
    `Thanks, ${data.firstName}! Here's your receipt for ${bold(data.eventName)}.`,
    "",
    section("Order", data.orderId),
    section("Paid via", data.paymentMethod),
    section("Date", data.paidAt),
    "",
    divider(),
  ];

  lines.push(`  ${bold("Item")}`.padEnd(35) + bold("Amount"));
  for (const item of data.items) {
    lines.push(`  ${item.description}`.padEnd(35) + `₹${item.amount}`);
  }
  lines.push(divider());
  lines.push(`  ${"Subtotal".padEnd(33)}₹${data.subtotal}`);
  lines.push(`  ${"Tax".padEnd(33)}₹${data.tax}`);
  lines.push(`  ${bold("Total")}`.padEnd(33) + `₹${data.total}`);
  lines.push("");
  lines.push(`─ ${process.env.NEXT_PUBLIC_APP_NAME || "echo"}`);

  return lines.join("\n");
}

function formatEventReminder(data: EventReminderData): string {
  const urgency = data.daysAway <= 1 ? "tomorrow" : `in ${data.daysAway} days`;

  return [
    header("⏰", `Event ${data.daysAway <= 1 ? "Tomorrow!" : "Coming Soon"}`),
    "",
    `Hey ${data.firstName}, just a heads up that ${bold(data.eventName)} is ${urgency}!`,
    "",
    section("Date", data.eventDate),
    section("Time", data.eventTime),
    section("Venue", data.eventVenue),
    "",
    "Don't forget to bring your ticket with the QR code for a smooth check-in. See you there!",
    "",
    `─ ${process.env.NEXT_PUBLIC_APP_NAME || "echo"}`,
  ].join("\n");
}

function formatPasswordReset(data: PasswordResetData): string {
  return [
    header("🔑", "Reset Your Password"),
    "",
    `Hi ${data.firstName}, we received a request to reset your password.`,
    "",
    `Click here to reset: ${data.resetLink}`,
    "",
    "This link expires in 1 hour.",
    "",
    "If you didn't request a password reset, you can safely ignore this message.",
    "",
    `─ ${process.env.NEXT_PUBLIC_APP_NAME || "echo"}`,
  ].join("\n");
}
