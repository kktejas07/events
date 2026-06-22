import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScannerPageClient from "../_ScannerPageClient";

export default async function ScannerPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <ScannerPageClient user={session.user!} />;
}
