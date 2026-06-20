export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  tags?: Record<string, string>;
  priority?: "high" | "normal" | "low";
}

export interface Attachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  provider: string;
  latencyMs?: number;
  error?: string;
}

export interface TestResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

export interface EmailProvider {
  readonly name: string;
  send(options: SendEmailOptions): Promise<EmailResult>;
  testConnection(): Promise<TestResult>;
}

export interface EmailLogEntry {
  id: string;
  recipient: string;
  subject: string;
  provider: string;
  success: boolean;
  latencyMs: number;
  timestamp: string;
  messageId?: string;
  error?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sampleData: Record<string, string>;
  render: (data: Record<string, string>) => { subject: string; html: string };
}

export interface EmailProviderConfig {
  provider: "smtp" | "postal";
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  postal?: {
    baseUrl: string;
    apiKey: string;
  };
  fromName: string;
  fromEmail: string;
}
