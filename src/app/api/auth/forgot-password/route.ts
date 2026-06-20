import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { getEmailService } from "@/lib/email";
import { renderPasswordResetEmail } from "@/lib/email-templates/password-reset";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { message: "If that email exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    try {
      const emailService = getEmailService();
      const html = renderPasswordResetEmail({
        firstName: user.firstName || user.email,
        resetLink: resetUrl,
      });
      await emailService.sendEmail({
        to: email,
        subject: "Reset Your Password",
        html,
      });
    } catch {
      console.warn("[forgot-password] Failed to send reset email to", email);
    }

    return NextResponse.json(
      { message: "If that email exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[forgot-password]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
