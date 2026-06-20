import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, User, LayoutDashboard, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-lg font-bold">Events</span>
          </Link>
        </div>
        <nav
          className="flex flex-col gap-1 overflow-y-auto p-3"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <Link href="/my-tickets">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Ticket className="h-4 w-4" /> My Tickets
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <User className="h-4 w-4" /> Profile
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Button>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 border-t bg-card p-3">
          <Link href="/api/auth/signout">
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-500">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 lg:pl-64">{children}</main>
    </div>
  );
}
