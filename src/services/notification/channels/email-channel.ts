import { sendEmail } from "@/lib/email";
import { NotificationChannel, NotificationType } from "../types";

export const EMAIL_CHANNEL_NAME = NotificationChannel.EMAIL;

export async function sendEmailNotification(
  type: NotificationType,
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await sendEmail({ to, subject, html });
}
