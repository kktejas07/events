import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketCard } from "@/components/tickets/ticket-card";

export default function MyTicketsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">My Tickets</h1>
      <p className="mt-2 text-muted-foreground">View and manage your purchased tickets</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-lg">No Tickets Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You haven&apos;t purchased any tickets yet. Browse events to get started!
            </p>
            <Link
              href="/events"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Browse Events →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
