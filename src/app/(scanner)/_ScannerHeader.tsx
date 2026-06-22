"use client";

import Link from "next/link";
import { LogOut, ShieldCheck, LayoutDashboard } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ScannerHeader({
  user,
  role,
}: {
  user: { name?: string | null; email?: string | null };
  role: string;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0a0a1a]/80 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-purple-400" />
        <span className="text-sm font-medium text-white">Ticket Scanner</span>
        <span className="hidden text-xs text-gray-500 sm:inline">
          — {user.name || user.email}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {role !== "SCANNER" && (
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/[0.03] text-xs text-white hover:bg-white/10"
            >
              <LayoutDashboard className="mr-1 h-3.5 w-3.5" />
              Admin
            </Button>
          </Link>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="border-white/10 bg-white/[0.03] text-xs text-white hover:bg-white/10"
        >
          <LogOut className="mr-1 h-3.5 w-3.5" />
          Exit
        </Button>
      </div>
    </header>
  );
}
