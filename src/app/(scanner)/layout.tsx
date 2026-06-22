import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScannerHeader from "./_ScannerHeader";

export default async function ScannerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN", "SCANNER"].includes(role || "")) redirect("/login");

  return (
    <div className="flex h-dvh flex-col bg-[#0a0a1a]">
      <ScannerHeader user={session.user!} role={role || ""} />
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
