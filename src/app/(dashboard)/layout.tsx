import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Ticket, User, LayoutDashboard, LogOut } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-white/10 bg-[#0a0a1a] lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 shadow-lg shadow-purple-600/30">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <span className="text-lg font-bold text-white">Events</span>
          </Link>
        </div>
        <nav
          className="flex flex-col gap-1 overflow-y-auto p-3"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <Link href="/my-tickets">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <Ticket className="h-4 w-4" /> My Tickets
            </Button>
          </Link>
          <Link href="/profile">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <User className="h-4 w-4" /> Profile
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" /> Admin
              </Button>
            </Link>
          )}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-white/10 bg-[#0a0a1a] p-3">
          <Link href="/api/auth/signout">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 lg:pl-64">{children}</main>
    </div>
  );
}
