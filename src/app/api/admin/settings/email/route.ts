import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const EMAIL_SETTING_KEYS = [
  "EMAIL_PROVIDER",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "POSTAL_BASE_URL",
  "POSTAL_API_KEY",
  "MAIL_FROM_NAME",
  "MAIL_FROM_EMAIL",
  "EMAIL_FROM",
];

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbSettings = await db.platformSetting.findMany({
    where: { key: { in: EMAIL_SETTING_KEYS } },
  });
  const settingsMap = Object.fromEntries(dbSettings.map((s) => [s.key, s.value]));

  const result: Record<string, string> = {};
  for (const key of EMAIL_SETTING_KEYS) {
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

  await Promise.all(
    EMAIL_SETTING_KEYS.map((key) => {
      if (settings[key] !== undefined) {
        return db.platformSetting.upsert({
          where: { key },
          update: { value: settings[key] },
          create: { key, value: settings[key], category: "email" },
        });
      }
      return null;
    }).filter(Boolean)
  );

  return NextResponse.json({ success: true });
}
