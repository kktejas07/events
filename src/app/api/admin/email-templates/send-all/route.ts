import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { emailTemplates, renderTemplate } from "@/lib/email-templates";
import { getEmailService } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to } = (await req.json().catch(() => ({}))) as { to?: string };
  if (!to) return NextResponse.json({ error: "to email required" }, { status: 400 });

  const service = getEmailService();
  const results: { id: string; name: string; success: boolean; error?: string }[] = [];

  for (const tmpl of emailTemplates) {
    const html = renderTemplate(tmpl.id);
    if (!html) {
      results.push({ id: tmpl.id, name: tmpl.name, success: false, error: "render failed" });
      continue;
    }
    try {
      const result = await service.sendEmail({
        to,
        subject: `[Template] ${tmpl.name}`,
        html,
      });
      results.push({
        id: tmpl.id,
        name: tmpl.name,
        success: result.success,
        error: result.error,
      });
    } catch (e: unknown) {
      results.push({
        id: tmpl.id,
        name: tmpl.name,
        success: false,
        error: e instanceof Error ? e.message : "unknown error",
      });
    }
  }

  return NextResponse.json({ sent: results.length, results });
}
