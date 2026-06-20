import { baseEmailLayout, wrapContent, textBlock, button } from "./base";

interface PasswordResetData {
  firstName: string;
  resetLink: string;
}

export function renderPasswordResetEmail(data: PasswordResetData) {
  const body = wrapContent(
    "Reset Your Password",
    textBlock(
      `Hi ${data.firstName}, we received a request to reset your password. Click the button below to set a new one. This link expires in 1 hour.`
    ) +
      button(data.resetLink, "Reset Password") +
      textBlock("If you didn't request a password reset, you can safely ignore this email.")
  );
  return baseEmailLayout(body, {
    title: "Password Reset",
    previewText: "Reset your password",
  });
}
