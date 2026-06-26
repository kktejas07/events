import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { verifyQrToken } from "@/lib/qr-token";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: { token: string };
}

const typeBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  EMPLOYEE: "default",
  VISITOR: "secondary",
  VOLUNTEER: "outline",
};

const statusColor: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  UNPAID: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={
        `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ` +
        (statusColor[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200")
      }
    >
      {status}
    </span>
  );
}

function InitialsAvatar({ firstName, lastName }: { firstName?: string | null; lastName?: string | null }) {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((n) => n!.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
      {initials || "?"}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-4 text-center text-card-foreground shadow-sm">
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default async function PublicProfilePage({ params }: Props) {
  const decoded = verifyQrToken(params.token);
  if (!decoded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-4xl">&#128274;</div>
            <h2 className="mb-2 text-xl font-semibold">Invalid or Expired QR Code</h2>
            <p className="text-sm text-muted-foreground">
              This QR code is no longer valid. Please request a new one.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = await db.user.findUnique({
    where: { id: decoded.userId },
    include: {
      idCards: {
        select: {
          idNumber: true,
          type: true,
          designation: true,
          department: true,
          isActive: true,
          issuedAt: true,
        },
      },
      tickets: {
        include: {
          event: { select: { title: true, startDate: true, endDate: true } },
          ticketType: { select: { name: true } },
          order: { select: { status: true } },
        },
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
      },
      attendance: {
        select: {
          checkIn: true,
          checkOut: true,
          method: true,
          event: { select: { title: true } },
        },
        orderBy: { checkIn: "desc" },
      },
    },
  });

  if (!user) notFound();

  const { idCards, tickets, invoices, purchases, attendance } = user;

  const totalTickets = tickets.length;
  const activeTickets = tickets.filter((t) => t.order.status === "PAID").length;
  const paidInvoices = invoices.filter((inv) => inv.status === "PAID").length;
  const attendanceCount = attendance.length;

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <InitialsAvatar firstName={user.firstName} lastName={user.lastName} />
            )}
            <div>
              <h1 className="text-xl font-bold">
                {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}
              </h1>
              <p className="text-sm text-muted-foreground">
                {[user.company, user.jobTitle].filter(Boolean).join(" \u2022 ") || "Member"}
              </p>
              <p className="text-xs text-muted-foreground">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Tickets" value={totalTickets} />
          <StatCard label="Active Tickets" value={activeTickets} />
          <StatCard label="Invoices Paid" value={paidInvoices} />
          <StatCard label="Attendance" value={attendanceCount} />
        </div>

        {idCards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>ID Cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {idCards.map((card, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{card.idNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {[card.designation, card.department].filter(Boolean).join(" - ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Issued: {formatDate(card.issuedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={typeBadgeVariant[card.type] || "outline"}>
                      {card.type}
                    </Badge>
                    <StatusBadge status={card.isActive ? "ACTIVE" : "CANCELLED"} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {tickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tickets.map((ticket, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{ticket.event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(ticket.event.startDate)}
                      {ticket.event.endDate &&
                        ` - ${formatDate(ticket.event.endDate)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{ticket.ticketType.name}</p>
                  </div>
                  <StatusBadge status={ticket.order.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {invoices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.map((inv, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{inv.invoiceNo}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(inv.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(Number(inv.amount))}
                    </span>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {purchases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Purchases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchases.map((p, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{p.product}</p>
                    {p.category && (
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(p.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(Number(p.price))}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: {p.quantity}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {attendance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">Event</th>
                      <th className="pb-2 pr-4 font-medium">Check In</th>
                      <th className="pb-2 pr-4 font-medium">Check Out</th>
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
                          <td className="py-3 pr-4">{a.event?.title || "—"}</td>
                          <td className="py-3 pr-4">{formatDate(checkIn)}</td>
                          <td className="py-3 pr-4">
                            {checkOut ? formatDate(checkOut) : "—"}
                          </td>
                          <td className="py-3">{durationStr}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
