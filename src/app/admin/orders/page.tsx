import { OrdersTable } from "@/components/admin/orders-table";
import { AdminPageHeader, StatCard } from "@/components/admin/ui";
import { getOrders } from "@/lib/data/queries";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const revenue = paid.reduce((sum, o) => sum + o.total, 0);
  const awaiting = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description="Search, filter and fulfil orders. Status changes are visible to the customer straight away."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total orders" value={String(orders.length)} />
        <StatCard label="Revenue (paid)" value={formatPrice(revenue)} />
        <StatCard
          label="Awaiting action"
          value={String(awaiting)}
          tone={awaiting ? "warning" : "default"}
        />
      </div>

      <OrdersTable orders={orders} />
    </>
  );
}
