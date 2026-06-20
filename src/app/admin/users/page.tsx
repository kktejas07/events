import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const roleColor: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  SUPER_ADMIN: "bg-red-100 text-red-700",
  SCANNER: "bg-blue-100 text-blue-700",
  USER: "bg-gray-100 text-gray-700",
};

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: {
      _count: {
        select: { orders: true, tickets: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="text-muted-foreground">Registered users ({users.length} total)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground">No users registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Orders</th>
                    <th className="pb-3 font-medium">Tickets</th>
                    <th className="pb-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 pr-4">
                        <Badge className={roleColor[user.role]}>{user.role}</Badge>
                      </td>
                      <td className="py-3 pr-4">{user._count.orders}</td>
                      <td className="py-3 pr-4">{user._count.tickets}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
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
