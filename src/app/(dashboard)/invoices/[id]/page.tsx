export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  PAID: { label: "Paid", variant: "default", icon: CheckCircle },
  UNPAID: { label: "Unpaid", variant: "destructive", icon: XCircle },
  DRAFT: { label: "Draft", variant: "secondary", icon: Clock },
  OVERDUE: { label: "Overdue", variant: "outline", icon: Clock },
  CANCELLED: { label: "Cancelled", variant: "secondary", icon: XCircle },
  REFUNDED: { label: "Refunded", variant: "default", icon: CheckCircle },
};

async function getInvoice(id: string, userId: string) {
  return db.invoice.findFirst({
    where: { id, userId },
    include: {
      payments: true,
      user: { select: { firstName: true, lastName: true, email: true } },
      order: { select: { event: { select: { title: true } } } },
    },
  });
}

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;

  const invoice = await getInvoice(params.id, userId);
  if (!invoice) notFound();

  const status = statusConfig[invoice.status] || statusConfig.UNPAID;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Invoices
          </Link>
        </div>

        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{invoice.invoiceNo}</h1>
              <Badge variant={status.variant}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {status.label}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Issued{" "}
              {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {invoice.dueDate && (
                <> &middot; Due{" "}
                  {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </>
              )}
            </p>
          </div>
          <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </a>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.03] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">₹{Number(invoice.amount).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                <span className="text-gray-400">Tax</span>
                <span className="text-white">₹{Number(invoice.tax).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                <span className="text-gray-400">GST</span>
                <span className="text-white">₹{Number(invoice.gst).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span className="text-white">Total</span>
                <span className="text-purple-400">
                  ₹{(Number(invoice.amount) + Number(invoice.tax) + Number(invoice.gst)).toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-white">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-white">
                {invoice.user.firstName} {invoice.user.lastName}
              </p>
              <p className="text-gray-400">{invoice.user.email}</p>
              {invoice.order?.event?.title && (
                <p className="text-gray-400">Event: {invoice.order.event.title}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-white">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {invoice.payments.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">No payments recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 pr-4 font-medium">Method</th>
                      <th className="pb-3 pr-4 font-medium">Transaction ID</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-white/5 text-white">
                        <td className="py-3 pr-4">₹{Number(payment.amount).toLocaleString("en-IN")}</td>
                        <td className="py-3 pr-4 capitalize">{payment.method || "—"}</td>
                        <td className="py-3 pr-4 font-mono text-xs">{payment.transactionId || "—"}</td>
                        <td className="py-3">
                          {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {invoice.status === "UNPAID" && (
              <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <h4 className="mb-3 text-sm font-semibold text-white">Record Payment</h4>
                <form action={`/api/invoices/${invoice.id}/pay`} method="POST" className="flex flex-wrap items-end gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-400">Amount (₹)</label>
                    <input
                      type="number"
                      name="amount"
                      defaultValue={Number(invoice.amount) + Number(invoice.tax) + Number(invoice.gst)}
                      step="0.01"
                      required
                      className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-400">Method</label>
                    <select
                      name="method"
                      required
                      className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="net_banking">Net Banking</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-400">Transaction ID</label>
                    <input
                      type="text"
                      name="transactionId"
                      className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                    <CreditCard className="mr-2 h-4 w-4" /> Mark as Paid
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
