"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { Customer } from "@/types";
import { setUserRole } from "@/actions/admin/settings";
import { AdminTable, Card, EmptyRow, Pill, Td } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export function UsersTable({ users, currentUserId }: { users: Customer[]; currentUserId?: string }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function changeRole(id: string, role: "admin" | "staff" | "customer") {
    setBusy(id);
    const result = await setUserRole(id, role);
    setBusy(null);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <Card title="Accounts" description="Promote a customer to staff or admin to give them panel access.">
      <AdminTable head={["Name", "Email", "Role", "Joined", ""]}>
        {users.length ? (
          users.map((user) => (
            <tr key={user.id} className="hover:bg-ivory-deep/30">
              <Td className="text-sm">
                {user.fullName}
                {user.id === currentUserId ? (
                  <span className="ml-2 text-xs text-ash">(you)</span>
                ) : null}
              </Td>
              <Td className="text-xs text-ash">{user.email}</Td>
              <Td>
                <Pill tone={user.isAdmin ? "success" : "muted"}>
                  {user.isAdmin ? "Admin" : "Customer"}
                </Pill>
              </Td>
              <Td className="text-xs text-ash">{formatDate(user.createdAt)}</Td>
              <Td className="text-right">
                <select
                  disabled={busy === user.id || user.id === currentUserId}
                  defaultValue={user.isAdmin ? "admin" : "customer"}
                  onChange={(event) =>
                    changeRole(user.id, event.target.value as "admin" | "staff" | "customer")
                  }
                  aria-label={`Change role for ${user.fullName}`}
                  className="border border-line bg-white px-3 py-2 text-xs outline-none focus:border-ink disabled:opacity-50"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </Td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={5}>No accounts yet.</EmptyRow>
        )}
      </AdminTable>
    </Card>
  );
}
