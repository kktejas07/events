import { EmailService, PostalApiProvider, SmtpProvider } from "@/services/email";
import { BrevoProvider } from "@/services/email/providers/brevo-provider";

let emailServiceInstance: EmailService | null = null;

function buildProvider() {
  const provider = process.env.EMAIL_PROVIDER || "smtp";

  if (provider === "brevo") {
    return new BrevoProvider({
      apiKey: process.env.BREVO_API_KEY || "",
      defaultSender: {
        name: process.env.MAIL_FROM_NAME || "Events Platform",
        email: process.env.MAIL_FROM_EMAIL || "noreply@events.forgetechno.com",
      },
    });
  }

  if (provider === "postal") {
    return new PostalApiProvider(
      process.env.POSTAL_BASE_URL || "https://mail.studentalumni.ai",
      process.env.POSTAL_API_KEY || ""
    );
  }

  return new SmtpProvider({
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || "587"),
    secure: (process.env.SMTP_SECURE || "false") === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  });
}

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    const provider = buildProvider();
    emailServiceInstance = new EmailService(provider);
  }
  return emailServiceInstance;
}

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}) {
  const service = getEmailService();
  return service.sendEmail({ to, subject, html, attachments });
}

export async function sendEmailWithProvider(options: Parameters<EmailService["sendEmail"]>[0]) {
  const service = getEmailService();
  return service.sendEmail(options);
}
