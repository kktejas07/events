import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
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
  Mail,
  Globe,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/landing", label: "Landing Page", icon: Globe },
  { href: "/admin/sponsors", label: "Sponsors", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/scan", label: "Scan Tickets", icon: ScanLine },
  { href: "/admin/emails", label: "Email Templates", icon: Mail },
  { href: "/admin/settings/email", label: "Email Provider", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-white/10 bg-[#0a0a1a] lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 shadow-lg shadow-purple-600/30">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <span className="text-lg font-bold text-white">Admin</span>
          </Link>
        </div>
        <nav
          className="flex flex-col gap-1 overflow-y-auto p-3"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-white/10 bg-[#0a0a1a] p-3">
          <Link href="/api/auth/signout">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#0a0a1a]/80 px-6 backdrop-blur-xl">
          <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin/settings">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-600">
              <span className="text-sm font-bold text-white">A</span>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
        <Toaster richColors />
      </div>
    </div>
  );
}
