import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmailService } from "@/services/email";
import { PostalApiProvider } from "@/services/email/providers/postal-provider";
import { SmtpProvider } from "@/services/email/providers/smtp-provider";
import { BrevoProvider } from "@/services/email/providers/brevo-provider";

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to } = await req.json();
  if (!to) {
    return NextResponse.json({ success: false, message: "Recipient email required" });
  }

  const dbSettings = await db.platformSetting.findMany({
    where: { category: "email" },
  });
  const s = Object.fromEntries(dbSettings.map((s) => [s.key, s.value]));

  const provider = s.EMAIL_PROVIDER || process.env.EMAIL_PROVIDER || "smtp";
  const fromName = s.MAIL_FROM_NAME || process.env.MAIL_FROM_NAME || "Echo";
  const fromEmail = s.MAIL_FROM_EMAIL || process.env.MAIL_FROM_EMAIL || "noreply@yourdomain.com";

  let emailProvider;
  if (provider === "brevo") {
    emailProvider = new BrevoProvider({
      apiKey: s.BREVO_API_KEY || process.env.BREVO_API_KEY || "",
      defaultSender: { name: fromName, email: fromEmail },
    });
  } else if (provider === "postal") {
    emailProvider = new PostalApiProvider(
      s.POSTAL_BASE_URL || process.env.POSTAL_BASE_URL || "",
      s.POSTAL_API_KEY || process.env.POSTAL_API_KEY || ""
    );
  } else {
    emailProvider = new SmtpProvider({
      host: s.SMTP_HOST || process.env.SMTP_HOST || "",
      port: Number(s.SMTP_PORT || process.env.SMTP_PORT || "587"),
      secure: (s.SMTP_SECURE || process.env.SMTP_SECURE || "false") === "true",
      user: s.SMTP_USER || process.env.SMTP_USER || "",
      pass: s.SMTP_PASS || process.env.SMTP_PASS || "",
    });
  }

  const emailService = new EmailService(emailProvider);
  const result = await emailService.sendHtmlEmail(
    to,
    "Test Email from echo",
    `<h1>Test Email</h1><p>If you received this, your email provider is configured correctly.</p><p>Provider: <strong>${provider}</strong></p><p>Sent at: ${new Date().toISOString()}</p>`
  );

  return NextResponse.json(result);
}
