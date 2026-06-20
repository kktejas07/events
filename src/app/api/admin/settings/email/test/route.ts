import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PostalApiProvider } from "@/services/email/providers/postal-provider";
import { SmtpProvider } from "@/services/email/providers/smtp-provider";

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider, config } = await req.json();

  let testProvider;
  if (provider === "postal") {
    testProvider = new PostalApiProvider(config.baseUrl, config.apiKey);
  } else if (provider === "smtp") {
    testProvider = new SmtpProvider(config.smtp);
  } else {
    return NextResponse.json({ success: false, message: "Unknown provider" });
  }

  const result = await testProvider.testConnection();
  return NextResponse.json(result);
}
