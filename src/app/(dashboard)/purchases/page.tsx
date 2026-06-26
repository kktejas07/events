export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Ticket, ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getPurchases(userId: string, category?: string) {
  return db.purchase.findMany({
    where: { userId, ...(category ? { category } : {}) },
    orderBy: { date: "desc" },
  });
}

async function getCategories(userId: string) {
  const result = await db.purchase.findMany({
    where: { userId, category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });
  return result.map((r) => r.category).filter(Boolean) as string[];
}

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;

  const category = searchParams.category || "";
  const [purchases, categories] = await Promise.all([
    getPurchases(userId, category || undefined),
    getCategories(userId),
  ]);

  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.price) * p.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Purchase History</h1>
            <p className="mt-1 text-sm text-gray-400">View all your past purchases</p>
          </div>
          <Link href="/invoices">
            <button className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" /> View Invoices
            </button>
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Purchases</CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{purchases.length}</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Spent</CardTitle>
              <Ticket className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ₹{totalSpent.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Categories</CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{categories.length}</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg. per Purchase</CardTitle>
              <Ticket className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ₹{purchases.length > 0 ? Math.round(totalSpent / purchases.length).toLocaleString("en-IN") : "0"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border-white/10 bg-white/[0.03]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Filter by category:</span>
              <form method="GET" className="flex items-center gap-2">
                <select
                  name="category"
                  onChange={(e) => e.target.form?.submit()}
                  value={category}
                  className="flex h-9 rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {category && (
                  <Link href="/purchases">
                    <button
                      type="button"
                      className="rounded-md border border-white/10 px-3 py-1 text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      Clear
                    </button>
                  </Link>
                )}
              </form>
            </div>
          </CardContent>
        </Card>

        {purchases.length === 0 ? (
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="flex flex-col items-center py-16">
              <ShoppingBag className="mb-4 h-12 w-12 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-300">No purchases yet</h3>
              <p className="mt-1 text-sm text-gray-500">Your purchase history will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <Card
                key={purchase.id}
                className="border-white/10 bg-white/[0.03] transition-colors hover:bg-white/[0.06]"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <ShoppingBag className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{purchase.product}</span>
                      {purchase.category && (
                        <Badge variant="secondary" className="text-xs">
                          {purchase.category}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-400">
                      Qty: {purchase.quantity} &middot;{" "}
                      {new Date(purchase.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      ₹{(Number(purchase.price) * purchase.quantity).toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-gray-500">
                      ₹{Number(purchase.price).toLocaleString("en-IN")} each
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
