import { baseEmailLayout, wrapContent, textBlock, button } from "./base";

interface WelcomeData {
  firstName: string;
  email: string;
}

export function renderWelcomeEmail(data: WelcomeData) {
  const body = wrapContent(
    `Welcome, ${data.firstName}!`,
    textBlock(
      `We're thrilled to have you join the echo community. Your account has been created successfully with ${data.email}.`
    ) +
      textBlock(
        "Explore upcoming events, grab your tickets, and be part of something extraordinary. From AI summits to tech conferences, the future starts here."
      ) +
      button("http://localhost:3001/events", "Browse Events")
  );
  return baseEmailLayout(body, {
    title: "Welcome to echo",
    previewText: `Welcome, ${data.firstName}! Your account is ready.`,
  });
}
