import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Ticket, FileText, ShoppingBag, Clock } from "lucide-react";
import Link from "next/link";
import DigitalIdCard from "@/components/ui/digital-id-card";
import { formatDate } from "@/lib/utils";

interface Props {
  params: { userId: string };
}

const statusColor: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  UNPAID: "bg-red-50 text-red-700",
  ACTIVE: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  REFUNDED: "bg-gray-50 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        statusColor[status] || "bg-gray-50 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default async function UserIdPage({ params }: Props) {
  const user = await db.user.findUnique({
    where: { id: params.userId },
    include: {
      tickets: {
        include: {
          event: { select: { title: true, startDate: true } },
          ticketType: { select: { name: true } },
          order: { select: { status: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      invoices: {
        select: {
          invoiceNo: true,
          amount: true,
          status: true,
          paidAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      purchases: {
        select: {
          product: true,
          price: true,
          quantity: true,
          category: true,
          date: true,
        },
        orderBy: { date: "desc" },
        take: 20,
      },
      attendance: {
        select: {
          checkIn: true,
          checkOut: true,
          method: true,
          event: { select: { title: true } },
        },
        orderBy: { checkIn: "desc" },
        take: 20,
      },
    },
  });

  if (!user) notFound();

  const { tickets, invoices, purchases, attendance } = user;
  const hasData = tickets.length > 0 || invoices.length > 0 || purchases.length > 0 || attendance.length > 0;

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: "#f8f9fe" }}>
      <div className="mx-auto px-4" style={{ maxWidth: "600px" }}>
        {/* Digital ID Card */}
        <DigitalIdCard user={user} />

        {/* Activity sections */}
        {hasData && (
          <div className="mt-6 space-y-4">
            {/* Tickets */}
            {tickets.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Ticket className="h-4 w-4" />
                  Tickets
                </h3>
                <div className="mt-3 space-y-2">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm transition hover:border-blue-100 hover:bg-blue-50/30"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900">
                          {ticket.event?.title || "Unknown Event"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ticket.ticketType?.name} &middot;{" "}
                          {ticket.event?.startDate
                            ? new Date(ticket.event.startDate).toLocaleDateString()
                            : "TBA"}
                        </p>
                      </div>
                      <StatusBadge status={ticket.order?.status || "PENDING"} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices */}
            {invoices.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4" />
                  Invoices
                </h3>
                <div className="mt-3 space-y-2">
                  {invoices.map((inv) => (
                    <div
                      key={inv.invoiceNo}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">{inv.invoiceNo}</p>
                        <p className="text-xs text-gray-500">{formatDate(inv.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-semibold text-gray-900 text-sm">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(Number(inv.amount))}
                        </span>
                        <StatusBadge status={inv.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchases */}
            {purchases.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <ShoppingBag className="h-4 w-4" />
                  Purchases
                </h3>
                <div className="mt-3 space-y-2">
                  {purchases.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">{p.product}</p>
                        {p.category && (
                          <p className="text-xs text-gray-500">{p.category}</p>
                        )}
                        <p className="text-xs text-gray-400">{formatDate(p.date)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(Number(p.price))}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {p.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance */}
            {attendance.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock className="h-4 w-4" />
                  Attendance
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="pb-2 pr-3 font-medium">Event</th>
                        <th className="pb-2 pr-3 font-medium">Check In</th>
                        <th className="pb-2 pr-3 font-medium">Check Out</th>
                        <th className="pb-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((a, i) => {
                        const checkIn = new Date(a.checkIn);
                        const checkOut = a.checkOut ? new Date(a.checkOut) : null;
                        const durationMs = checkOut ? checkOut.getTime() - checkIn.getTime() : 0;
                        const durationHours = Math.floor(durationMs / 3600000);
                        const durationMins = Math.floor((durationMs % 3600000) / 60000);
                        const durationStr = checkOut
                          ? `${durationHours}h ${durationMins}m`
                          : "In progress";
                        return (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2.5 pr-3 font-medium text-gray-900">{a.event?.title || "—"}</td>
                            <td className="py-2.5 pr-3 text-gray-600">{formatDate(checkIn)}</td>
                            <td className="py-2.5 pr-3 text-gray-600">
                              {checkOut ? formatDate(checkOut) : "—"}
                            </td>
                            <td className="py-2.5 text-gray-600">{durationStr}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          <Link href="/" className="underline hover:text-gray-600">
            events.forgetechno.com
          </Link>
        </p>
      </div>
    </div>
  );
}
