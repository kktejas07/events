import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const tierColor: Record<string, string> = {
  PLATINUM: "bg-purple-100 text-purple-700",
  GOLD: "bg-yellow-100 text-yellow-700",
  SILVER: "bg-gray-100 text-gray-700",
  BRONZE: "bg-orange-100 text-orange-700",
};

export default async function AdminSponsorsPage() {
  const sponsors = await db.sponsor.findMany({
    include: {
      events: {
        include: { event: { select: { title: true } } },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sponsors</h2>
          <p className="text-muted-foreground">Manage event sponsors ({sponsors.length} total)</p>
        </div>
        <Link href="/admin/sponsors/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Sponsor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sponsors</CardTitle>
        </CardHeader>
        <CardContent>
          {sponsors.length === 0 ? (
            <p className="text-muted-foreground">No sponsors yet. Add your first sponsor.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Tier</th>
                    <th className="pb-3 font-medium">Website</th>
                    <th className="pb-3 font-medium">Events</th>
                    <th className="pb-3 font-medium">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor) => (
                    <tr key={sponsor.id} className="border-b last:border-0">
                      <td className="flex items-center gap-3 py-3 pr-4">
                        {sponsor.logoUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            className="h-8 w-16 rounded object-contain"
                          />
                        )}
                        <span className="font-medium">{sponsor.name}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge className={tierColor[sponsor.tier]}>{sponsor.tier}</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        {sponsor.websiteUrl ? (
                          <a
                            href={sponsor.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {new URL(sponsor.websiteUrl).hostname}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {sponsor.events.map((es) => es.event.title).join(", ") || "—"}
                      </td>
                      <td className="py-3 text-muted-foreground">{sponsor.sortOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
