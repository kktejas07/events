import { EmailProvider, SendEmailOptions, EmailResult, TestResult, EmailLogEntry } from "./types";
import { renderTemplate, renderSubject } from "./template-renderer";
import { enqueue } from "./queue";

const emailLogs: EmailLogEntry[] = [];
const MAX_LOGS = 1000;

export class EmailService {
  private provider: EmailProvider;

  constructor(provider: EmailProvider) {
    this.provider = provider;
  }

  setProvider(provider: EmailProvider): void {
    this.provider = provider;
  }

  getProviderName(): string {
    return this.provider.name;
  }

  private async sendWithLogging(options: SendEmailOptions): Promise<EmailResult> {
    const start = Date.now();
    const recipient = Array.isArray(options.to) ? options.to.join(", ") : options.to;

    try {
      const result = await this.provider.send(options);
      const latencyMs = Date.now() - start;

      emailLogs.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        recipient,
        subject: options.subject,
        provider: this.provider.name,
        success: result.success,
        latencyMs,
        timestamp: new Date().toISOString(),
        messageId: result.messageId,
        error: result.error,
      });

      if (emailLogs.length > MAX_LOGS) {
        emailLogs.length = MAX_LOGS;
      }

      return result;
    } catch (error) {
      const latencyMs = Date.now() - start;
      const errorMsg = error instanceof Error ? error.message : "Send failed";

      emailLogs.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        recipient,
        subject: options.subject,
        provider: this.provider.name,
        success: false,
        latencyMs,
        timestamp: new Date().toISOString(),
        error: errorMsg,
      });

      return { success: false, provider: this.provider.name, latencyMs, error: errorMsg };
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    if (!options.from) {
      options.from = this.getDefaultFrom();
    }
    return this.sendWithLogging(options);
  }

  async sendHtmlEmail(
    to: string | string[],
    subject: string,
    html: string,
    options?: Partial<SendEmailOptions>
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject,
      html,
      ...options,
    });
  }

  async sendTemplateEmail(
    to: string | string[],
    subject: string,
    templateHtml: string,
    variables: Record<string, string>,
    options?: Partial<SendEmailOptions>
  ): Promise<EmailResult> {
    const html = renderTemplate(templateHtml, variables);
    const renderedSubject = renderSubject(subject, variables);
    return this.sendEmail({
      to,
      subject: renderedSubject,
      html,
      ...options,
    });
  }

  async sendBulkEmail(
    recipients: { to: string; variables?: Record<string, string> }[],
    subject: string,
    templateHtml: string,
    options?: Partial<SendEmailOptions>
  ): Promise<EmailResult[]> {
    return Promise.all(
      recipients.map((r) => {
        const html = r.variables ? renderTemplate(templateHtml, r.variables) : templateHtml;
        const renderedSubject = r.variables ? renderSubject(subject, r.variables) : subject;
        return this.sendEmail({ to: r.to, subject: renderedSubject, html, ...options });
      })
    );
  }

  async sendEmailWithQueue(options: SendEmailOptions): Promise<string> {
    return enqueue(() => this.sendEmail(options), options);
  }

  async testConnection(): Promise<TestResult> {
    return this.provider.testConnection();
  }

  getLogs(): EmailLogEntry[] {
    return [...emailLogs];
  }

  clearLogs(): void {
    emailLogs.length = 0;
  }

  private getDefaultFrom(): string {
    const name = process.env.MAIL_FROM_NAME || "echo";
    const email = process.env.MAIL_FROM_EMAIL || process.env.EMAIL_FROM || "noreply@yourdomain.com";
    if (email.includes("<")) return email;
    return `${name} <${email}>`;
  }
}
