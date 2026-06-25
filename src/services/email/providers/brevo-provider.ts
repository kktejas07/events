import type { EmailProvider, SendEmailOptions, EmailResult, TestResult } from "../types";

interface BrevoProviderConfig {
  apiKey: string;
  defaultSender: { name: string; email: string };
}

export class BrevoProvider implements EmailProvider {
  readonly name = "brevo";
  private apiKey: string;
  private defaultSender: { name: string; email: string };

  constructor(config: BrevoProviderConfig) {
    this.apiKey = config.apiKey;
    this.defaultSender = config.defaultSender;
  }

  async send(options: SendEmailOptions): Promise<EmailResult> {
    const start = Date.now();

    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
        body: JSON.stringify({
          sender: this.defaultSender,
          to: [{ email: options.to, name: options.to }],
          subject: options.subject,
          htmlContent: options.html || "",
          ...(options.attachments?.length
            ? {
                attachment: options.attachments.map((a) => ({
                  name: a.filename || "attachment",
                  content: a.content?.toString("base64"),
                })),
              }
            : {}),
        }),
      });

      const latencyMs = Date.now() - start;

      if (!res.ok) {
        const body = await res.text();
        return {
          success: false,
          provider: "brevo",
          error: `Brevo API error (${res.status}): ${body}`,
          latencyMs,
        };
      }

      const data = await res.json();
      return {
        success: true,
        provider: "brevo",
        messageId: data.messageId,
        latencyMs,
      };
    } catch (error) {
      return {
        success: false,
        provider: "brevo",
        error: error instanceof Error ? error.message : "Brevo send failed",
        latencyMs: Date.now() - start,
      };
    }
  }

  async testConnection(): Promise<TestResult> {
    const start = Date.now();
    try {
      const res = await fetch("https://api.brevo.com/v3/account", {
        headers: { "api-key": this.apiKey },
      });
      const latencyMs = Date.now() - start;
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          message: `Brevo connected — ${data.email || "account verified"} (${latencyMs}ms)`,
        };
      }
      return { success: false, message: `Brevo auth failed (${res.status}): ${await res.text()}` };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Brevo connection failed",
      };
    }
  }
}
