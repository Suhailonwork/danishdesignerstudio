import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  IndianRupee,
  Package,
  ShoppingCart,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import { SalesChart } from "@/components/admin/sales-chart";
import {
  AdminPageHeader,
  AdminTable,
  Card,
  EmptyRow,
  LinkButton,
  Pill,
  StatCard,
  Td,
} from "@/components/admin/ui";
import { getDashboardStats } from "@/lib/data/queries";
import { formatDate, formatPrice, orderStatusTone, titleCase } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="A live view of sales, stock and the customers behind them."
        actions={
          <>
            <LinkButton href="/admin/products/new" variant="primary">
              New product
            </LinkButton>
            <LinkButton href="/admin/orders">View orders</LinkButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue (paid)"
          value={formatPrice(stats.revenue)}
          hint={`Average order ${formatPrice(stats.averageOrderValue)}`}
          icon={<IndianRupee className="h-4 w-4" />}
        />
        <StatCard
          label="Orders"
          value={String(stats.orderCount)}
          hint={`${stats.statusCounts.pending ?? 0} awaiting action`}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatCard
          label="Customers"
          value={String(stats.customerCount)}
          hint="Registered accounts"
          icon={<UsersRound className="h-4 w-4" />}
        />
        <StatCard
          label="Products"
          value={String(stats.productCount)}
          hint={`${stats.publishedCount} published`}
          icon={<Package className="h-4 w-4" />}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Low stock"
          value={String(stats.lowStock.length)}
          hint="At or below the reorder threshold"
          tone={stats.lowStock.length ? "warning" : "default"}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          label="Out of stock"
          value={String(stats.outOfStock.length)}
          hint="Not purchasable right now"
          tone={stats.outOfStock.length ? "danger" : "default"}
          icon={<Boxes className="h-4 w-4" />}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Sales overview" description="Paid orders over the most recent days.">
          <SalesChart data={stats.series} />
        </Card>

        <Card
          title="Top products"
          description="By units sold."
          actions={
            <Link href="/admin/products" className="text-xs text-ash hover:text-ink">
              All products
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {stats.topProducts.map((product, index) => (
              <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="w-5 shrink-0 text-xs tabular-nums text-ash">{index + 1}</span>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="min-w-0 flex-1 truncate text-sm hover:text-gold"
                >
                  {product.name}
                </Link>
                <span className="shrink-0 text-xs tabular-nums text-ash">
                  {product.soldCount} sold
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card
          title="Recent orders"
          actions={
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs text-ash hover:text-ink"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <AdminTable head={["Order", "Customer", "Status", "Total", ""]}>
            {stats.recentOrders.length ? (
              stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <Td>
                    <Link href={`/admin/orders/${order.id}`} className="text-sm hover:text-gold">
                      {order.orderNumber}
                    </Link>
                    <p className="mt-0.5 text-xs text-ash">{formatDate(order.createdAt)}</p>
                  </Td>
                  <Td>
                    <p className="text-sm">{order.customerName}</p>
                    <p className="mt-0.5 truncate text-xs text-ash">{order.email}</p>
                  </Td>
                  <Td>
                    <span
                      className={`inline-flex border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.12em] ${orderStatusTone(order.status)}`}
                    >
                      {titleCase(order.status)}
                    </span>
                  </Td>
                  <Td className="tabular-nums">{formatPrice(order.total)}</Td>
                  <Td className="text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-ash hover:text-ink"
                    >
                      Open
                    </Link>
                  </Td>
                </tr>
              ))
            ) : (
              <EmptyRow colSpan={5}>No orders yet.</EmptyRow>
            )}
          </AdminTable>
        </Card>

        <Card
          title="Needs attention"
          description="Stock that will stop you selling."
          actions={
            <Link href="/admin/inventory" className="text-xs text-ash hover:text-ink">
              Inventory
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {[...stats.outOfStock, ...stats.lowStock].slice(0, 7).map((product) => (
              <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="min-w-0 flex-1 truncate text-sm hover:text-gold"
                >
                  {product.name}
                </Link>
                <Pill tone={product.stockQuantity <= 0 ? "danger" : "warning"}>
                  {product.stockQuantity <= 0 ? "Out" : `${product.stockQuantity} left`}
                </Pill>
              </li>
            ))}
            {!stats.outOfStock.length && !stats.lowStock.length ? (
              <li className="flex items-center gap-2 py-6 text-sm text-ash">
                <TrendingUp className="h-4 w-4 text-emerald-700" />
                Every product is comfortably in stock.
              </li>
            ) : null}
          </ul>
        </Card>
      </div>
    </>
  );
}
