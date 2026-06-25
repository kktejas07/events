import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData().catch(() => req.json().catch(() => ({})));
    const name = typeof body === "object" && "name" in body ? String(body.name) : "";
    const email = typeof body === "object" && "email" in body ? String(body.email) : "";
    const message = typeof body === "object" && "message" in body ? String(body.message) : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Valid email required" }, { status: 400 });
    }

    await db.auditLog.create({
      data: {
        action: "CONTACT_FORM_SUBMISSION",
        entityType: "contact",
        details: { name, email, message },
      },
    });

    try {
      await sendEmail({
        to: process.env.CONTACT_EMAIL || "admin@echo-platform.com",
        subject: `New Contact Form Submission from ${name}`,
        html: `<h2>Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>`,
      });
    } catch {
      // Email sending is optional
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
