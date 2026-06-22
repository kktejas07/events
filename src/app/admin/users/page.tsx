"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { Eye, Ban, Loader2 } from "lucide-react";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  banned: boolean;
  _count: { orders: number; tickets: number };
  createdAt: string;
}

const roleColor: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  SUPER_ADMIN: "bg-red-500/10 text-red-400 border-red-500/30",
  SCANNER: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  USER: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=20`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
        setTotalPages(json.meta.totalPages);
        setTotal(json.meta.total);
      } else toast.error(json.error || "Failed to load users");
    } catch {
      toast.error("Network error");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, [fetchUsers]);

  async function handleBan(id: string, banned: boolean) {
    const action = banned ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned: !banned }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`User ${banned ? "unbanned" : "banned"}`);
        fetchUsers();
      } else {
        toast.error(json.error || "Failed to update user");
      }
    } catch {
      toast.error("Network error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Users</h2>
        <p className="text-gray-400">Registered users ({users.length} total)</p>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-gray-400">No users registered yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 font-medium text-gray-400">Name</th>
                    <th className="pb-3 font-medium text-gray-400">Email</th>
                    <th className="pb-3 font-medium text-gray-400">Role</th>
                    <th className="pb-3 font-medium text-gray-400">Orders</th>
                    <th className="pb-3 font-medium text-gray-400">Tickets</th>
                    <th className="pb-3 font-medium text-gray-400">Status</th>
                    <th className="pb-3 font-medium text-gray-400">Joined</th>
                    <th className="pb-3 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 font-medium text-white">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-3 pr-4 text-gray-400">{user.email}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${roleColor[user.role] || "bg-gray-500/10 text-gray-400"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-300">{user._count.orders}</td>
                      <td className="py-3 pr-4 text-gray-300">{user._count.tickets}</td>
                      <td className="py-3 pr-4">
                        {user.banned ? (
                          <span className="inline-block rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                            Banned
                          </span>
                        ) : (
                          <span className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${user.banned ? "text-green-400 hover:bg-green-500/10" : "text-orange-400 hover:bg-orange-500/10"}`}
                          onClick={() => handleBan(user.id, user.banned)}
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
            />
          </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
