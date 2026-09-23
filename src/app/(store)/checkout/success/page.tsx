import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Mail, Package, Truck } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { getGlobalSeo, getOrderByNumber, getSiteSettings } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { orderSchema } from "@/lib/seo/structured-data";
import { formatDate, formatPrice } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    seo: { noIndex: true, noFollow: true },
    title: "Order confirmed",
    description: "Thank you for your order.",
    path: "/checkout/success",
  });
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const [order, settings] = await Promise.all([
    orderNumber ? getOrderByNumber(orderNumber) : Promise.resolve(null),
    getSiteSettings(),
  ]);

  return (
    <div className="container-lux py-16 lg:py-24">
      {order ? <JsonLd data={orderSchema(order)} /> : null}

      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-700" strokeWidth={1.3} />
        </span>
        <h1 className="mt-7 text-4xl lg:text-5xl">Thank you for your order</h1>
        <p className="mt-4 text-sm leading-relaxed text-ash">
          {orderNumber ? (
            <>
              Your order <span className="text-ink">{orderNumber}</span> has been received. A
              confirmation is on its way to your inbox, and our team will be in touch within one
              working day to confirm measurements and dispatch.
            </>
          ) : (
            "Your order has been received. A confirmation is on its way to your inbox."
          )}
        </p>
      </div>

      {order ? (
        <div className="mx-auto mt-12 max-w-3xl border border-line bg-white">
          <div className="grid gap-4 border-b border-line p-6 sm:grid-cols-3 lg:p-8">
            <div>
              <p className="eyebrow mb-1">Order</p>
              <p className="text-sm">{order.orderNumber}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Placed</p>
              <p className="text-sm">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Total</p>
              <p className="text-sm tabular-nums">{formatPrice(order.total)}</p>
            </div>
          </div>

          <ul className="divide-y divide-line p-6 lg:p-8">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                {item.image ? (
                  <span className="relative aspect-3/4 w-16 shrink-0 overflow-hidden bg-ivory-deep">
                    <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                ) : null}
                <span className="flex-1">
                  <Link href={`/product/${item.slug}`} className="text-sm hover:text-gold">
                    {item.name}
                  </Link>
                  <span className="mt-1 block text-xs text-ash">
                    {[item.size, item.color].filter(Boolean).join(" · ")} · Qty {item.quantity}
                  </span>
                </span>
                <span className="text-sm tabular-nums">{formatPrice(item.total)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-line p-6 text-sm lg:p-8">
            <p className="eyebrow mb-2">Shipping to</p>
            <address className="not-italic leading-relaxed text-ink-soft">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              ) : null}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>
        </div>
      ) : null}

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
        {[
          { icon: Mail, title: "Confirmation email", text: "Check your inbox and spam folder." },
          { icon: Package, title: "In the atelier", text: "Dispatched within two working days." },
          { icon: Truck, title: "Free delivery", text: "Tracking shared as soon as it ships." },
        ].map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="text-center">
              <Icon className="mx-auto h-6 w-6 text-ash" strokeWidth={1.3} />
              <h2 className="mt-3 text-base">{step.title}</h2>
              <p className="mt-1 text-xs text-ash">{step.text}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
        <ButtonLink href="/account/orders" variant="outline">
          View my orders
        </ButtonLink>
      </div>

      <p className="mt-10 text-center text-xs text-ash">
        Questions? Write to{" "}
        <a href={`mailto:${settings.email}`} className="underline underline-offset-4">
          {settings.email}
        </a>{" "}
        or message us on WhatsApp.
      </p>
    </div>
  );
}
