import { baseEmailLayout, wrapContent, textBlock, button } from "./base";

interface SubscriptionData {
  firstName: string;
  topics: string[];
}

export function renderSubscriptionEmail(data: SubscriptionData) {
  const topicsHtml = data.topics
    .map(
      (t) =>
        `<span style="display:inline-block;padding:4px 12px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.2);border-radius:20px;color:#a78bfa;font-size:13px;margin:2px 4px 2px 0;">${t}</span>`
    )
    .join("");

  const body = wrapContent(
    "Subscription Confirmed!",
    textBlock(
      `Thanks, ${data.firstName}! You're now subscribed to event updates. We'll keep you posted on the latest events, early-bird tickets, and exclusive announcements.`
    ) +
      (data.topics.length
        ? `<p style="margin:16px 0 0 0;color:#9ca3af;font-size:13px;">You'll receive updates about:</p><p style="margin:4px 0 0 0;">${topicsHtml}</p>`
        : "") +
      button("http://localhost:3001/events", "Explore Events")
  );
  return baseEmailLayout(body, {
    title: "Subscribed!",
    previewText: "You're subscribed to event updates",
  });
}
