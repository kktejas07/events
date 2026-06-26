import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyOTP } from "@/lib/otp";
import { renderWelcomeEmail } from "@/lib/email-templates/welcome";
import { notify, NotificationType } from "@/services/notification";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required" }, { status: 400 });
    }

    const valid = await verifyOTP(email, otp);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }

    const user = await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
    const memberSince = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send welcome notification
    const html = renderWelcomeEmail({ firstName: user.firstName || "User", email: user.email });
    await notify(
      NotificationType.WELCOME,
      { email: user.email, phone: user.phone || undefined },
      "Welcome to echo",
      html,
      { firstName: user.firstName || "User", email: user.email }
    );

    // Send digital ID card via WhatsApp (no email)
    await notify(
      NotificationType.ID_CARD,
      { phone: user.phone || undefined },
      "Your Digital ID Card",
      "",
      {
        firstName: name,
        userId: user.id,
        name,
        email: user.email,
        memberSince,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
