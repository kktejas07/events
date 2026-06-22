import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col bg-[#0a0a1a]">
      <header className="flex h-16 items-center border-b border-white/10 bg-[#0a0a1a]/80 px-6 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 shadow-lg shadow-purple-600/30">
            <span className="text-lg font-bold text-white">E</span>
          </div>
          <span className="text-xl font-bold text-white">Events</span>
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
