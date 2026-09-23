import { InventoryManager } from "@/components/admin/inventory-manager";
import { AdminPageHeader, StatCard } from "@/components/admin/ui";
import { getAllProducts, getInventoryTransactions } from "@/lib/data/queries";

export const metadata = { title: "Inventory" };

export default async function InventoryPage() {
  const [products, transactions] = await Promise.all([
    getAllProducts(),
    getInventoryTransactions(),
  ]);

  const low = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  );
  const out = products.filter((p) => p.stockQuantity <= 0);
  const units = products.reduce((sum, p) => sum + p.stockQuantity, 0);

  return (
    <>
      <AdminPageHeader
        title="Inventory"
        description="Restock, reduce or set exact counts. Every change is recorded with a reason."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Units in stock" value={units.toLocaleString("en-IN")} />
        <StatCard
          label="Low stock"
          value={String(low.length)}
          tone={low.length ? "warning" : "default"}
        />
        <StatCard
          label="Out of stock"
          value={String(out.length)}
          tone={out.length ? "danger" : "default"}
        />
      </div>

      <InventoryManager products={products} transactions={transactions} />
    </>
  );
}
