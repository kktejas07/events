"use client";

import { emailTemplates } from "@/lib/email-templates";
import { Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function AdminEmailsPage() {
  const grouped = useMemo(() => {
    const map: Record<string, typeof emailTemplates> = {};
    for (const tmpl of emailTemplates) {
      if (!map[tmpl.category]) map[tmpl.category] = [];
      map[tmpl.category].push(tmpl);
    }
    return map;
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
        <p className="mt-1 text-muted-foreground">
          Preview all transactional email templates with sample data.
        </p>
      </div>

      {Object.entries(grouped).map(([category, templates]) => (
        <div key={category}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {category}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="group rounded-lg border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Link
                    href={`/admin/emails/preview/${tmpl.id}`}
                    target="_blank"
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Preview <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <h4 className="mt-4 font-semibold">{tmpl.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{tmpl.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
