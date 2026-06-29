import { db } from "@/lib/db";
import { EmailService, PostalApiProvider, SmtpProvider } from "@/services/email";
import { BrevoProvider } from "@/services/email/providers/brevo-provider";

let emailServiceInstance: EmailService | null = null;
let initPromise: Promise<void> | null = null;

async function loadSettings(): Promise<Record<string, string>> {
  const keys = [
    "EMAIL_PROVIDER", "SMTP_HOST", "SMTP_PORT", "SMTP_SECURE",
    "SMTP_USER", "SMTP_PASS", "POSTAL_BASE_URL", "POSTAL_API_KEY",
    "BREVO_API_KEY", "MAIL_FROM_NAME", "MAIL_FROM_EMAIL", "EMAIL_FROM",
  ];
  try {
    const rows = await db.platformSetting.findMany({ where: { key: { in: keys } } });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

function get(key: string, dbSettings: Record<string, string>, fallback: string): string {
  return dbSettings[key] || process.env[key] || fallback;
}

async function buildProvider() {
  const dbSettings = await loadSettings();
  const provider = get("EMAIL_PROVIDER", dbSettings, "smtp");

  if (provider === "brevo") {
    return new BrevoProvider({
      apiKey: get("BREVO_API_KEY", dbSettings, ""),
      defaultSender: {
        name: get("MAIL_FROM_NAME", dbSettings, "Echo"),
        email: get("MAIL_FROM_EMAIL", dbSettings, "noreply@echo-platform.com"),
      },
    });
  }

  if (provider === "postal") {
    return new PostalApiProvider(
      get("POSTAL_BASE_URL", dbSettings, "https://mail.studentalumni.ai"),
      get("POSTAL_API_KEY", dbSettings, "")
    );
  }

  return new SmtpProvider({
    host: get("SMTP_HOST", dbSettings, ""),
    port: Number(get("SMTP_PORT", dbSettings, "587")),
    secure: get("SMTP_SECURE", dbSettings, "false") === "true",
    user: get("SMTP_USER", dbSettings, ""),
    pass: get("SMTP_PASS", dbSettings, ""),
  });
}

async function initEmailService() {
  if (!emailServiceInstance) {
    const provider = await buildProvider();
    emailServiceInstance = new EmailService(provider);
  }
}

export async function getEmailService(): Promise<EmailService> {
  if (!initPromise) {
    initPromise = initEmailService();
  }
  await initPromise;
  return emailServiceInstance!;
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
  const service = await getEmailService();
  return service.sendEmail({ to, subject, html, attachments });
}

export async function sendEmailWithProvider(options: Parameters<EmailService["sendEmail"]>[0]) {
  const service = await getEmailService();
  return service.sendEmail(options);
}
