export const baseEmailLayout = (
  content: string,
  options: { previewText?: string; title?: string } = {}
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  ${options.previewText ? `<meta name="description" content="${options.previewText}" />` : ""}
  <title>${options.title || "Events Platform"}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a1a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px;height:40px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:20px;font-weight:800;line-height:40px;">E</span>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="color:#fff;font-size:22px;font-weight:700;">Events</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;padding:40px 36px;border:1px solid rgba(255,255,255,0.06);">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:30px;">
              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                Events Platform &mdash; All rights reserved.<br/>
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export function wrapContent(title: string, bodyHtml: string) {
  return `
    <h1 style="margin:0 0 8px 0;color:#fff;font-size:24px;font-weight:700;line-height:1.3;">${title}</h1>
    ${bodyHtml}
  `;
}

export function button(url: string, text: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td align="center">
          <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;text-decoration:none;font-size:15px;font-weight:600;border-radius:10px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function divider() {
  return `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;" />`;
}

export function textBlock(text: string) {
  return `<p style="margin:12px 0 0 0;color:#d1d5db;font-size:15px;line-height:1.7;">${text}</p>`;
}

export function infoRow(label: string, value: string, link = false) {
  const val = link
    ? `<a href="${value}" style="color:#a78bfa;text-decoration:none;">${value}</a>`
    : value;
  return `<tr><td style="padding:5px 0;color:#9ca3af;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:5px 0 5px 16px;color:#d1d5db;font-size:14px;font-weight:600;">${val}</td></tr>`;
}

export function infoTable(rows: { label: string; value: string; link?: boolean }[]) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;background:rgba(255,255,255,0.03);border-radius:10px;padding:16px;width:100%;">
      ${rows.map((r) => infoRow(r.label, r.value, r.link)).join("")}
    </table>
  `;
}

export function badge(text: string, color = "#7c3aed") {
  return `<span style="display:inline-block;padding:4px 12px;background:${color}15;border:1px solid ${color}30;border-radius:20px;color:${color};font-size:13px;margin:2px 4px 2px 0;">${text}</span>`;
}

export function list(items: string[]) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0;">
      ${items
        .map(
          (item) => `
        <tr>
          <td style="padding:4px 0;color:#d1d5db;font-size:14px;vertical-align:top;width:16px;">&bull;</td>
          <td style="padding:4px 0;color:#d1d5db;font-size:14px;">${item}</td>
        </tr>
      `
        )
        .join("")}
    </table>
  `;
}

export function tableHeader(...cols: string[]) {
  return cols
    .map(
      (c) =>
        `<th style="text-align:left;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);">${c}</th>`
    )
    .join("");
}

export function tableRow(cells: (string | number)[]) {
  return `<tr>${cells.map((c) => `<td style="padding:8px 0;color:#d1d5db;font-size:14px;">${c}</td>`).join("")}</tr>`;
}

export function tableFooter(label: string, value: string, color = "#a78bfa") {
  return `
    <tr><td colspan="2" style="padding:14px 0 0 0;border-top:1px solid rgba(255,255,255,0.06);" /></tr>
    <tr>
      <td style="color:#9ca3af;font-size:14px;font-weight:600;">${label}</td>
      <td style="color:${color};font-size:16px;font-weight:700;text-align:right;">${value}</td>
    </tr>
  `;
}
