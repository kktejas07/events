import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ALL_NOTIFICATION_TYPES, ALL_CHANNELS, channelKey } from "@/services/notification";
import { invalidateNotificationConfigCache } from "@/services/notification";

const SETTING_KEYS = [
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "EMAIL_FROM",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "FIREBASE_SERVICE_ACCOUNT_KEY",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "STUDENTALUMNI_API_URL",
  "STUDENTALUMNI_API_KEY",
  "STUDENTALUMNI_WEBHOOK_SECRET",
  "AUTH_SECRET",
  "AUTH_LINKEDIN_ID",
  "AUTH_LINKEDIN_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "NEXT_PUBLIC_APP_NAME",
  "WHATSAPP_API_URL",
  "WHATSAPP_API_KEY",
  "SOCIAL_TWITTER_URL",
  "SOCIAL_FACEBOOK_URL",
  "SOCIAL_INSTAGRAM_URL",
  "SOCIAL_YOUTUBE_URL",
  "SOCIAL_LINKEDIN_URL",
];

function getNotificationKeys(): string[] {
  const keys: string[] = [];
  for (const type of ALL_NOTIFICATION_TYPES) {
    for (const channel of ALL_CHANNELS) {
      keys.push(channelKey(type, channel));
    }
  }
  return keys;
}

const ALL_KEYS = [...SETTING_KEYS, ...getNotificationKeys()];

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbSettings = await db.platformSetting.findMany();
  const settingsMap = Object.fromEntries(dbSettings.map((s) => [s.key, s.value]));

  const result: Record<string, string> = {};
  for (const key of ALL_KEYS) {
    result[key] = settingsMap[key] ?? process.env[key] ?? "";
  }

  return NextResponse.json({ settings: result });
}

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { settings } = await req.json();

  const upserts = ALL_KEYS.map((key) => {
    if (settings[key] !== undefined) {
      return db.platformSetting.upsert({
        where: { key },
        update: { value: settings[key] },
        create: {
          key,
          value: settings[key],
          category: key.includes("SMTP")
            ? "email"
            : key.includes("RAZORPAY")
              ? "payment"
              : key.includes("FIREBASE")
                ? "auth"
                : key.includes("STUDENTALUMNI")
                  ? "integration"
                  : key.includes("UPSTASH")
                    ? "rate-limit"
                    : key.includes("WHATSAPP")
                      ? "notifications"
                      : key.startsWith("notify_")
                        ? "notifications"
                        : key.includes("AUTH_") || key === "AUTH_SECRET"
                          ? "auth"
                          : "general",
        },
      });
    }
    return null;
  }).filter(Boolean);

  await Promise.all(upserts);
  invalidateNotificationConfigCache();

  return NextResponse.json({ success: true });
}
