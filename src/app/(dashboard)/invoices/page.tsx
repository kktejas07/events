export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, CreditCard, CheckCircle, XCircle } from "lucide-react";

const statusStyles: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  UNPAID: "destructive",
  DRAFT: "secondary",
  OVERDUE: "outline",
  CANCELLED: "secondary",
  REFUNDED: "default",
};

async function getInvoices(userId: string) {
  return db.invoice.findMany({
    where: { userId },
    include: { payments: true, order: { select: { event: { select: { title: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function InvoicesPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;

  const invoices = await getInvoices(userId);

  const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const paidCount = invoices.filter((inv) => inv.status === "PAID").length;
  const unpaidCount = invoices.filter((inv) => inv.status === "UNPAID" || inv.status === "OVERDUE").length;

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="mt-1 text-sm text-gray-400">View and manage your invoices</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{invoices.length}</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Amount</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ₹{totalAmount.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{paidCount}</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Unpaid</CardTitle>
              <XCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{unpaidCount}</div>
            </CardContent>
          </Card>
        </div>

        {invoices.length === 0 ? (
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="flex flex-col items-center py-16">
              <FileText className="mb-4 h-12 w-12 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-300">No invoices yet</h3>
              <p className="mt-1 text-sm text-gray-500">Your invoices will appear here once you make a purchase.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="border-white/10 bg-white/[0.03] transition-colors hover:bg-white/[0.06]"
              >
                <CardContent className="flex items-center justify-between p-4">
                  <Link href={`/invoices/${invoice.id}`} className="flex flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <FileText className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">{invoice.invoiceNo}</span>
                        <Badge variant={statusStyles[invoice.status] || "secondary"}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-400">
                        {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {invoice.order?.event?.title && (
                          <> &middot; {invoice.order.event.title}</>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        ₹{Number(invoice.amount).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </Link>
                  <a
                    href={`/api/invoices/${invoice.id}/pdf`}
                    target="_blank"
                    className="ml-4"
                  >
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
