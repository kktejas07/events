export { EmailService } from "./email-service";
export { PostalApiProvider } from "./providers/postal-provider";
export { SmtpProvider } from "./providers/smtp-provider";
export { renderTemplate, renderSubject } from "./template-renderer";
export { enqueue } from "./queue";

export type {
  EmailProvider,
  SendEmailOptions,
  EmailResult,
  TestResult,
  EmailLogEntry,
  EmailTemplate,
  Attachment,
  EmailProviderConfig,
} from "./types";
