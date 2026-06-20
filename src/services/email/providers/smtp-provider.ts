import nodemailer from "nodemailer";
import { EmailProvider, SendEmailOptions, EmailResult, TestResult } from "../types";

export class SmtpProvider implements EmailProvider {
  readonly name = "smtp";

  private transporter: nodemailer.Transporter | null = null;
  private config: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };

  constructor(config: { host: string; port: number; secure: boolean; user: string; pass: string }) {
    this.config = config;
  }

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.user,
          pass: this.config.pass,
        },
        connectionTimeout: 10000,
      });
    }
    return this.transporter;
  }

  async send(options: SendEmailOptions): Promise<EmailResult> {
    const start = Date.now();
    try {
      const info = await this.getTransporter().sendMail({
        from: options.from,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        attachments: options.attachments,
        headers: options.headers,
      });

      return {
        success: true,
        messageId: info.messageId,
        provider: this.name,
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        success: false,
        provider: this.name,
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : "SMTP send failed",
      };
    }
  }

  async testConnection(): Promise<TestResult> {
    try {
      const start = Date.now();
      await this.getTransporter().verify();
      const latencyMs = Date.now() - start;
      return {
        success: true,
        message: `SMTP connected successfully (${latencyMs}ms)`,
        details: { host: this.config.host, port: this.config.port, latencyMs },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "SMTP connection failed",
        details: { host: this.config.host, port: this.config.port },
      };
    }
  }
}
