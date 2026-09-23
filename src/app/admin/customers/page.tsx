import { AdminPageHeader, AdminTable, Card, EmptyRow, StatCard, Td } from "@/components/admin/ui";
import { getCustomers, getOrders } from "@/lib/data/queries";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const [customers, orders] = await Promise.all([getCustomers(), getOrders()]);

  const spendByEmail = new Map<string, { orders: number; total: number }>();
  for (const order of orders) {
    const entry = spendByEmail.get(order.email) ?? { orders: 0, total: 0 };
    entry.orders += 1;
    if (order.paymentStatus === "paid") entry.total += order.total;
    spendByEmail.set(order.email, entry);
  }

  const totalRevenue = Array.from(spendByEmail.values()).reduce((sum, e) => sum + e.total, 0);

  return (
    <>
      <AdminPageHeader
        title="Customers"
        description="Everyone with an account, and what they have spent."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Customers" value={String(customers.length)} />
        <StatCard label="Orders placed" value={String(orders.length)} />
        <StatCard label="Lifetime revenue" value={formatPrice(totalRevenue)} />
      </div>

      <Card>
        <AdminTable head={["Customer", "Email", "Phone", "Orders", "Spent", "Joined"]}>
          {customers.length ? (
            customers.map((customer) => {
              const stats = spendByEmail.get(customer.email);
              return (
                <tr key={customer.id} className="hover:bg-ivory-deep/30">
                  <Td className="text-sm">{customer.fullName}</Td>
                  <Td className="text-xs text-ash">{customer.email}</Td>
                  <Td className="text-xs text-ash">{customer.phone ?? "—"}</Td>
                  <Td className="text-sm tabular-nums">
                    {stats?.orders ?? customer.ordersCount}
                  </Td>
                  <Td className="text-sm tabular-nums">
                    {formatPrice(stats?.total ?? customer.totalSpent)}
                  </Td>
                  <Td className="text-xs text-ash">{formatDate(customer.createdAt)}</Td>
                </tr>
              );
            })
          ) : (
            <EmptyRow colSpan={6}>No customers yet.</EmptyRow>
          )}
        </AdminTable>
      </Card>
    </>
  );
}
