import { getEmailTemplate, renderTemplate } from "@/lib/email-templates";
import { notFound } from "next/navigation";

export default function EmailPreviewPage({ params }: { params: { template: string } }) {
  const tmpl = getEmailTemplate(params.template);
  if (!tmpl) notFound();

  const html = renderTemplate(params.template);
  if (!html) notFound();

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#0a0a1a" }}>
      <iframe
        srcDoc={html}
        style={{
          width: "100%",
          minHeight: "100vh",
          border: "none",
          background: "#0a0a1a",
        }}
        title={`${tmpl.name} Preview`}
      />
    </div>
  );
}
