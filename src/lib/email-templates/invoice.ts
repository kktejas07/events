import {
  baseEmailLayout,
  wrapContent,
  textBlock,
  infoTable,
  divider,
  tableHeader,
  tableRow,
  tableFooter,
} from "./base";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  firstName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  billTo: string;
  billToAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: string;
  total: number;
  paidVia: string;
}

export function renderInvoiceEmail(data: InvoiceData) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;color:#d1d5db;font-size:14px;">${item.description}</td>
      <td style="padding:8px 0;color:#d1d5db;font-size:14px;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 0;color:#d1d5db;font-size:14px;text-align:right;">₹${item.rate}</td>
      <td style="padding:8px 0;color:#d1d5db;font-size:14px;text-align:right;">₹${item.amount}</td>
    </tr>`
    )
    .join("");

  const body = wrapContent(
    `Invoice #${data.invoiceNumber}`,
    textBlock(
      `Hi ${data.firstName}, thank you for your business. Please find your invoice details below.`
    ) +
      infoTable([
        { label: "Invoice #", value: data.invoiceNumber },
        { label: "Invoice Date", value: data.invoiceDate },
        { label: "Due Date", value: data.dueDate },
        { label: "Bill To", value: data.billTo },
        { label: "Address", value: data.billToAddress },
        { label: "Paid Via", value: data.paidVia },
      ]) +
      divider() +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          ${tableHeader("Description", "Qty", "Rate", "Amount")}
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr><td colspan="4" style="padding:14px 0 0 0;border-top:1px solid rgba(255,255,255,0.06);" /></tr>
        <tr>
          <td colspan="3" style="color:#9ca3af;font-size:14px;text-align:right;padding-right:16px;">Subtotal</td>
          <td style="color:#d1d5db;font-size:14px;text-align:right;">₹${data.subtotal}</td>
        </tr>
        <tr>
          <td colspan="3" style="color:#9ca3af;font-size:14px;text-align:right;padding-right:16px;">Tax (${data.taxRate})</td>
          <td style="color:#d1d5db;font-size:14px;text-align:right;">₹${data.tax}</td>
        </tr>
        ${tableFooter("Total", `₹${data.total}`)}
      </tfoot>
    </table>`
  );
  return baseEmailLayout(body, {
    title: `Invoice #${data.invoiceNumber}`,
    previewText: `Invoice from echo`,
  });
}
