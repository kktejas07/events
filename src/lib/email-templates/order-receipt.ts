import { baseEmailLayout, wrapContent, textBlock, button, divider } from "./base";

interface OrderReceiptData {
  firstName: string;
  orderId: string;
  eventName: string;
  paymentMethod: string;
  paidAt: string;
  items: { description: string; amount: number }[];
  subtotal: number;
  tax: number;
  total: number;
}

export function renderOrderReceiptEmail(data: OrderReceiptData) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;color:#d1d5db;font-size:14px;">${item.description}</td>
      <td style="padding:8px 0;color:#d1d5db;font-size:14px;text-align:right;">\u20B9${item.amount}</td>
    </tr>`
    )
    .join("");

  const body = wrapContent(
    "Payment Receipt",
    textBlock(
      `Thanks, ${data.firstName}! Here's your receipt for <strong>${data.eventName}</strong>.`
    ) +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0;">
      <tr><td style="padding:2px 0;color:#9ca3af;font-size:13px;">Order</td><td style="padding:2px 0;color:#d1d5db;font-size:14px;padding-left:24px;">${data.orderId}</td></tr>
      <tr><td style="padding:2px 0;color:#9ca3af;font-size:13px;">Paid via</td><td style="padding:2px 0;color:#d1d5db;font-size:14px;padding-left:24px;">${data.paymentMethod}</td></tr>
      <tr><td style="padding:2px 0;color:#9ca3af;font-size:13px;">Date</td><td style="padding:2px 0;color:#d1d5db;font-size:14px;padding-left:24px;">${data.paidAt}</td></tr>
    </table>` +
      divider() +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th style="text-align:left;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);">Item</th>
          <th style="text-align:right;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);">Amount</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr><td colspan="2" style="padding:14px 0 0 0;border-top:1px solid rgba(255,255,255,0.06);" /></tr>
        <tr>
          <td style="color:#9ca3af;font-size:14px;">Subtotal</td>
          <td style="color:#d1d5db;font-size:14px;text-align:right;">\u20B9${data.subtotal}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;font-size:14px;">Tax</td>
          <td style="color:#d1d5db;font-size:14px;text-align:right;">\u20B9${data.tax}</td>
        </tr>
        <tr>
          <td style="color:#fff;font-size:16px;font-weight:700;padding-top:6px;">Total</td>
          <td style="color:#a78bfa;font-size:16px;font-weight:700;text-align:right;padding-top:6px;">\u20B9${data.total}</td>
        </tr>
      </tfoot>
    </table>`
  );
  return baseEmailLayout(body, {
    title: "Payment Receipt",
    previewText: `Receipt for ${data.eventName}`,
  });
}
