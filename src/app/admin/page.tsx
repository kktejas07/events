import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Ticket, Users, CalendarCheck } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "₹4,52,300", icon: DollarSign, change: "+12.5%" },
  { label: "Tickets Sold", value: "1,204", icon: Ticket, change: "+8.2%" },
  { label: "Registered Users", value: "3,450", icon: Users, change: "+24.3%" },
  { label: "Active Events", value: "8", icon: CalendarCheck, change: "+2" },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    event: "AI Summit 2026",
    tickets: 2,
    total: "₹598",
    status: "Paid",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    event: "Web Dev Conf",
    tickets: 1,
    total: "₹199",
    status: "Paid",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    event: "AI Summit 2026",
    tickets: 5,
    total: "₹3,495",
    status: "Pending",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.event}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <p className="text-sm text-muted-foreground">{order.tickets} tickets</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link
              href="/admin/events"
              className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <h4 className="font-medium">Create New Event</h4>
              <p className="text-sm text-muted-foreground">
                Set up a new event with tickets and schedule
              </p>
            </Link>
            <Link
              href="/admin/sponsors"
              className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <h4 className="font-medium">Manage Sponsors</h4>
              <p className="text-sm text-muted-foreground">Add or update sponsor information</p>
            </Link>
            <Link
              href="/admin/scan"
              className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <h4 className="font-medium">Scan Tickets</h4>
              <p className="text-sm text-muted-foreground">Verify tickets at event entrance</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
