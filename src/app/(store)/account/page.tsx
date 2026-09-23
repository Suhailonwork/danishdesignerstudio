import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, Sparkles } from "lucide-react";

import { AuthForm } from "@/components/store/auth-form";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getGlobalSeo, getMyOrders } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate, formatPrice, orderStatusTone, titleCase } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    seo: { noIndex: true, noFollow: true },
    title: "My account",
    description: "Manage your Danish Designer Studio orders, profile and saved addresses.",
    path: "/account",
  });
}

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md border border-line bg-white p-8 lg:p-10">
        <AuthForm redirectTo="/account" />
      </div>
    );
  }

  const orders = await getMyOrders(user.id);
  const recent = orders.slice(0, 3);
  const spent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-12">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Orders placed", value: String(orders.length), icon: Package },
          { label: "Lifetime value", value: formatPrice(spent), icon: ShoppingBag },
          { label: "Member since", value: "—", icon: Sparkles },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="border border-line bg-white p-6">
              <Icon className="h-5 w-5 text-ash" strokeWidth={1.3} />
              <p className="mt-4 font-display text-2xl tabular-nums">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ash">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <section aria-labelledby="recent-orders">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="recent-orders" className="text-2xl">
            Recent orders
          </h2>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-sm text-ash hover:text-ink"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length ? (
          <ul className="divide-y divide-line border-y border-line">
            {recent.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-4 py-5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-ash">
                    {formatDate(order.createdAt)} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <span
                  className={`border px-3 py-1 text-[0.62rem] uppercase tracking-[0.12em] ${orderStatusTone(order.status)}`}
                >
                  {titleCase(order.status)}
                </span>
                <span className="text-sm tabular-nums">{formatPrice(order.total)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-dashed border-line bg-white/60 px-6 py-12 text-center">
            <p className="font-display text-xl">No orders yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ash">
              When you place an order it will appear here with live tracking.
            </p>
            <ButtonLink href="/shop" size="sm" className="mt-5">
              Start shopping
            </ButtonLink>
          </div>
        )}
      </section>

      <section className="border border-line bg-white p-7">
        <h2 className="text-xl">Account details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="eyebrow mb-1">Name</dt>
            <dd className="text-sm">{user.fullName}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Email</dt>
            <dd className="text-sm">{user.email}</dd>
          </div>
        </dl>
        <ButtonLink href="/account/profile" variant="outline" size="sm" className="mt-6">
          Edit profile
        </ButtonLink>
      </section>
    </div>
  );
}
