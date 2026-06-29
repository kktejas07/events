import { NotificationType } from "../types";

const APP_NAME = "Echo";
const TAGLINE = "Voices Across Generations";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://events.forgetechno.com";

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

interface IdCardData {
  firstName: string;
  userId: string;
}

interface PasswordResetData {
  firstName: string;
  resetLink: string;
}

function b(text: string): string {
  return `*${text}*`;
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
    case NotificationType.ID_CARD:
      return formatIdCard(data as unknown as IdCardData);
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
    `${b("🔐 Verify Your Email")}`,
    "",
    `Hi ${data.firstName},`,
    "",
    `Use the code below to verify your email address. It expires in ${expiry} minutes.`,
    "",
    `${b(data.otp)}`,
    "",
    "If you didn't request this, please ignore this message.",
    "",
    `— ${APP_NAME} · ${TAGLINE}`,
  ].join("\n");
}

function formatWelcome(data: WelcomeData): string {
  return [
    `${b("👋 Welcome to " + APP_NAME + ", " + data.firstName + "!")}`,
    "",
    "We're thrilled to have you on board. Your account has been created with " + data.email + ".",
    "",
    `${b("What's next?")}`,
    "• Browse upcoming events",
    "• Grab your tickets",
    "• Receive event reminders on WhatsApp",
    "",
    `${APP_URL}/events`,
    "",
    `— ${APP_NAME} · ${TAGLINE}`,
  ].join("\n");
}

function formatTicketPurchase(data: TicketPurchaseData): string {
  const items = data.tickets.map((t) => `• ${t.name} × ${t.quantity} — Rs.${t.price}`).join("\n");

  return [
    `${b("🎫 Tickets Confirmed")}`,
    "",
    `Hi ${data.firstName},`,
    `Your purchase for ${b(data.eventName)} is confirmed.`,
    "",
    `${b("Order Summary")}`,
    `Order ID: ${data.orderId}`,
    `Date: ${data.eventDate}`,
    `Venue: ${data.eventVenue}`,
    "",
    `${items}`,
    "",
    `${b("Total: Rs." + data.total)}`,
    "",
    `📎 Ticket PDF attached — present the barcode at the venue for entry.`,
    "",
    `— ${APP_NAME} · ${TAGLINE}`,
  ].join("\n");
}

function formatOrderReceipt(data: OrderReceiptData): string {
  const items = data.items.map((i) => `• ${i.description} — Rs.${i.amount}`).join("\n");

  return [
    `${b("🧾 Payment Receipt")}`,
    "",
    `Hi ${data.firstName},`,
    `Your payment for ${b(data.eventName)} has been received.`,
    "",
    `${b("Receipt Summary")}`,
    `Order: ${data.orderId}`,
    `Paid via: ${data.paymentMethod}`,
    `Date: ${data.paidAt}`,
    "",
    `${items}`,
    "",
    `Subtotal: Rs.${data.subtotal}`,
    `Tax: Rs.${data.tax}`,
    `${b("Total: Rs." + data.total)}`,
    "",
    `📎 Invoice PDF attached for your records.`,
    "",
    `— ${APP_NAME} · ${TAGLINE}`,
  ].join("\n");
}

function formatEventReminder(data: EventReminderData): string {
  const urgency = data.daysAway <= 1 ? "tomorrow" : `in ${data.daysAway} days`;
  const heading = data.daysAway <= 1 ? "Event Tomorrow" : "Event Reminder";

  return [
    `${b("⏰ " + heading)}`,
    "",
    `Hi ${data.firstName},`,
    `This is a reminder that ${b(data.eventName)} is ${urgency}.`,
    "",
    `${b("Event Details")}`,
    `Date: ${data.eventDate}`,
    `Time: ${data.eventTime}`,
    `Venue: ${data.eventVenue}`,
    "",
    "Don't forget to bring your ticket for a smooth check-in. We look forward to seeing you there!",
    "",
    `— ${APP_NAME} · ${TAGLINE}`,
  ].join("\n");
}

function formatIdCard(data: IdCardData & { imageUrl?: string; cardUrl?: string }): string {
  const cardUrl = data.cardUrl || `${APP_URL}/id/${data.userId}`;
  const imageUrl = data.imageUrl || `${APP_URL}/api/public/id-card-image/${data.userId}`;
  return [
    `${b("🪪 Your Digital ID Card")}`,
    "",
    `Hi ${data.firstName},`,
    "",
    "Your digital identity card is ready! 🎉",
    "",
    `${imageUrl}`,
    "",
    `Interactive card: ${cardUrl}`,
    "",
    `— ${APP_NAME} · ${TAGLINE}`,
  ].join("\n");
}

function formatPasswordReset(data: PasswordResetData): string {
  return [
    `${b("🔑 Password Reset")}`,
    "",
    `Hi ${data.firstName},`,
    "We received a request to reset your password.",
    "",
    `${data.resetLink}`,
    "",
    "This link expires in 1 hour. If you didn't request this, you can safely ignore this message.",
    "",
    `— ${APP_NAME} · ${TAGLINE}`,
  ].join("\n");
}
