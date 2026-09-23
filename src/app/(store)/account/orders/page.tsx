import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/primitives";
import { requireUser } from "@/lib/auth";
import { getGlobalSeo, getMyOrders } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate, formatPrice, orderStatusTone, titleCase } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    seo: { noIndex: true, noFollow: true },
    title: "My orders",
    description: "Track your Danish Designer Studio orders and download invoices.",
    path: "/account/orders",
  });
}

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await getMyOrders(user.id);

  if (!orders.length) {
    return (
      <EmptyState
        icon={<Package className="h-9 w-9" strokeWidth={1.1} />}
        title="No orders yet"
        description="Once you place an order you will be able to follow it from the atelier to your door right here."
        action={<ButtonLink href="/shop">Start shopping</ButtonLink>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">Your orders</h2>

      <ul className="space-y-5">
        {orders.map((order) => (
          <li key={order.id} className="border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
              <div>
                <p className="text-sm text-ink">{order.orderNumber}</p>
                <p className="mt-1 text-xs text-ash">Placed {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`border px-3 py-1 text-[0.62rem] uppercase tracking-[0.12em] ${orderStatusTone(order.status)}`}
                >
                  {titleCase(order.status)}
                </span>
                <span
                  className={`border px-3 py-1 text-[0.62rem] uppercase tracking-[0.12em] ${orderStatusTone(order.paymentStatus)}`}
                >
                  {titleCase(order.paymentStatus)}
                </span>
                <span className="text-sm tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>

            <ul className="divide-y divide-line px-5">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  {item.image ? (
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative aspect-3/4 w-14 shrink-0 overflow-hidden bg-ivory-deep"
                    >
                      <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                    </Link>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${item.slug}`} className="text-sm hover:text-gold">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-ash">
                      {[item.size, item.color].filter(Boolean).join(" · ")} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums">{formatPrice(item.total)}</p>
                </li>
              ))}
            </ul>

            {order.trackingNumber ? (
              <p className="flex flex-wrap items-center gap-2 border-t border-line bg-ivory-deep/60 px-5 py-3.5 text-xs text-ink-soft">
                <Truck className="h-3.5 w-3.5" strokeWidth={1.5} />
                {order.courier ? `${order.courier} · ` : ""}Tracking {order.trackingNumber}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
