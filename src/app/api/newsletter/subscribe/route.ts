import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Valid email required" }, { status: 400 });
    }

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.active) {
        await db.newsletterSubscriber.update({
          where: { email },
          data: { active: true },
        });
        return NextResponse.json({ success: true, message: "Re-subscribed successfully" });
      }
      return NextResponse.json({ success: true, message: "Already subscribed" });
    }

    await db.newsletterSubscriber.create({ data: { email } });

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ success: false, error: "Subscription failed" }, { status: 500 });
  }
}
