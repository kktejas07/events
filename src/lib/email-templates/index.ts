import { renderWelcomeEmail } from "./welcome";
import { renderOTPEmail } from "./otp";
import { renderTicketPurchaseEmail } from "./ticket-purchase";
import { renderEventConfirmationEmail } from "./event-confirmation";
import { renderPasswordResetEmail } from "./password-reset";
import { renderSubscriptionEmail } from "./subscription";
import { renderOrderReceiptEmail } from "./order-receipt";
import { renderEventReminderEmail } from "./event-reminder";
import { renderJobNotificationEmail } from "./job-notification";
import { renderCandidateNotificationEmail } from "./candidate-notification";
import { renderInvoiceEmail } from "./invoice";

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  render: (data: Record<string, unknown>) => string;
  sampleData: Record<string, unknown>;
}

const render =
  <T>(fn: (data: T) => string) =>
  (data: Record<string, unknown>) =>
    fn(data as unknown as T);

export const emailTemplates: EmailTemplate[] = [
  // Auth & Account
  {
    id: "welcome",
    name: "Welcome Email",
    description: "Sent to new users after successful registration.",
    category: "Auth & Account",
    render: render(renderWelcomeEmail),
    sampleData: { firstName: "John", email: "john@example.com" },
  },
  {
    id: "otp",
    name: "Email OTP Verification",
    description: "Sent when a user requests an email verification code.",
    category: "Auth & Account",
    render: render(renderOTPEmail),
    sampleData: { firstName: "John", otp: "482917", expiresInMinutes: 10 },
  },
  {
    id: "password-reset",
    name: "Password Reset",
    description: "Sent when a user requests a password reset link.",
    category: "Auth & Account",
    render: render(renderPasswordResetEmail),
    sampleData: {
      firstName: "John",
      resetLink: "http://localhost:3001/reset-password?token=sample-token-here",
    },
  },

  // Events & Tickets
  {
    id: "ticket-purchase",
    name: "Ticket Purchase Confirmation",
    description: "Sent after a successful ticket purchase with order summary.",
    category: "Events & Tickets",
    render: render(renderTicketPurchaseEmail),
    sampleData: {
      firstName: "John",
      orderId: "ORD-2026-001",
      eventName: "AI Summit 2026",
      eventDate: "October 1\u20135, 2026",
      eventVenue: "San Francisco Tech Pavilion, CA",
      tickets: [
        { name: "VIP Pass", quantity: 2, price: 1398 },
        { name: "Standard Pass", quantity: 1, price: 299 },
      ],
      total: 1697,
    },
  },
  {
    id: "event-confirmation",
    name: "Event Registration Confirmation",
    description: "Sent when a user registers for an event.",
    category: "Events & Tickets",
    render: render(renderEventConfirmationEmail),
    sampleData: {
      firstName: "John",
      eventName: "AI Summit 2026",
      eventDate: "October 1, 2026",
      eventTime: "10:00 AM PST",
      eventVenue: "San Francisco Tech Pavilion, 121 AI Blvd, San Francisco, CA",
      ticketType: "VIP Pass",
    },
  },
  {
    id: "event-reminder",
    name: "Event Reminder",
    description: "Sent 1\u20133 days before an event.",
    category: "Events & Tickets",
    render: render(renderEventReminderEmail),
    sampleData: {
      firstName: "John",
      eventName: "AI Summit 2026",
      eventDate: "October 1, 2026",
      eventTime: "10:00 AM PST",
      eventVenue: "San Francisco Tech Pavilion, CA",
      daysAway: 1,
    },
  },

  // Subscriptions
  {
    id: "subscription",
    name: "Subscription Confirmation",
    description: "Sent when a user subscribes to event or newsletter updates.",
    category: "Subscriptions",
    render: render(renderSubscriptionEmail),
    sampleData: {
      firstName: "John",
      topics: ["AI & Machine Learning", "Tech Conferences", "Workshops"],
    },
  },

  // Jobs & Hiring
  {
    id: "job-notification",
    name: "Job Notification",
    description: "Sent to users when a matching job is posted.",
    category: "Jobs & Hiring",
    render: render(renderJobNotificationEmail),
    sampleData: {
      firstName: "John",
      jobTitle: "Senior AI Engineer",
      company: "NeuralCore",
      location: "San Francisco, CA",
      jobType: "Full-Time",
      salary: "$150K - $200K",
      description:
        "We are looking for a Senior AI Engineer to help build our next-generation ML platform. You will work on model training pipelines, inference optimization, and production deployment.",
      skills: ["Python", "PyTorch", "Kubernetes", "AWS SageMaker"],
      applyUrl: "http://localhost:3001/jobs/senior-ai-engineer",
    },
  },
  {
    id: "candidate-notification",
    name: "Candidate Status Notification",
    description: "Sent to recruiters when a candidate's status changes.",
    category: "Jobs & Hiring",
    render: render(renderCandidateNotificationEmail),
    sampleData: {
      recruiterName: "Sarah",
      candidateName: "John Doe",
      candidateEmail: "john@example.com",
      positionTitle: "Senior AI Engineer",
      company: "NeuralCore",
      status: "shortlisted",
      message:
        "John has been shortlisted based on his impressive portfolio and experience with ML pipeline optimization. We recommend scheduling an interview at the earliest convenience.",
      dashboardUrl: "http://localhost:3001/admin/jobs/senior-ai-engineer/candidates",
    },
  },

  // Billing & Invoices
  {
    id: "order-receipt",
    name: "Payment Receipt",
    description: "Sent as a payment receipt after a successful transaction.",
    category: "Billing & Invoices",
    render: render(renderOrderReceiptEmail),
    sampleData: {
      firstName: "John",
      orderId: "ORD-2026-001",
      eventName: "AI Summit 2026",
      paymentMethod: "Razorpay (UPI)",
      paidAt: "June 15, 2026 at 2:30 PM",
      items: [
        { description: "VIP Pass \u00d7 2", amount: 1398 },
        { description: "Standard Pass \u00d7 1", amount: 299 },
      ],
      subtotal: 1697,
      tax: 0,
      total: 1697,
    },
  },
  {
    id: "invoice",
    name: "Invoice",
    description: "Sent as a standalone invoice for billing purposes.",
    category: "Billing & Invoices",
    render: render(renderInvoiceEmail),
    sampleData: {
      firstName: "John",
      invoiceNumber: "INV-2026-0042",
      invoiceDate: "June 15, 2026",
      dueDate: "July 15, 2026",
      billTo: "John Doe",
      billToAddress: "123 Tech Lane, San Francisco, CA 94107",
      items: [
        { description: "VIP Pass \u00d7 2", quantity: 2, rate: 699, amount: 1398 },
        { description: "Standard Pass \u00d7 1", quantity: 1, rate: 299, amount: 299 },
      ],
      subtotal: 1697,
      tax: 0,
      taxRate: "0%",
      total: 1697,
      paidVia: "Razorpay (UPI)",
    },
  },
];

export function getEmailTemplate(id: string) {
  return emailTemplates.find((t) => t.id === id) || null;
}

export function renderTemplate(id: string) {
  const tmpl = getEmailTemplate(id);
  if (!tmpl) return null;
  return tmpl.render(tmpl.sampleData);
}

export function renderTemplateWithData(id: string, data: Record<string, unknown>) {
  const tmpl = getEmailTemplate(id);
  if (!tmpl) return null;
  return tmpl.render(data);
}
