import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  ShoppingCart,
  Users,
  ScanLine,
  Settings,
  LogOut,
  BarChart3,
  ShieldCheck,
  Mail,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/sponsors", label: "Sponsors", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/scan", label: "Scan Tickets", icon: ScanLine },
  { href: "/admin/emails", label: "Email Templates", icon: Mail },
  { href: "/admin/settings/email", label: "Email Provider", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-lg font-bold">Admin</span>
          </Link>
        </div>
        <nav
          className="flex flex-col gap-1 overflow-y-auto p-3"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t bg-card p-3">
          <Link href="/api/auth/signout">
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-500">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
