"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { Order } from "@/types";
import { AdminTable, Card, EmptyRow, Td } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, orderStatusTone, titleCase } from "@/lib/utils";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const filtered = useMemo(() => {
    let list = [...orders];
    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter((order) =>
        [order.orderNumber, order.customerName, order.email, order.phone]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(needle))
      );
    }
    if (status) list = list.filter((order) => order.status === status);
    if (payment) list = list.filter((order) => order.paymentStatus === payment);
    return list;
  }, [orders, query, status, payment]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search order number, name, email or phone"
            aria-label="Search orders"
            className="w-full border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ink"
          />
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by order status"
          className="border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        >
          <option value="">Any status</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {titleCase(value)}
            </option>
          ))}
        </select>

        <select
          value={payment}
          onChange={(event) => {
            setPayment(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by payment status"
          className="border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        >
          <option value="">Any payment</option>
          {["unpaid", "paid", "failed", "refunded", "partially_refunded"].map((value) => (
            <option key={value} value={value}>
              {titleCase(value)}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <AdminTable head={["Order", "Customer", "Items", "Status", "Payment", "Total", ""]}>
          {visible.length ? (
            visible.map((order) => (
              <tr key={order.id} className="hover:bg-ivory-deep/30">
                <Td>
                  <Link href={`/admin/orders/${order.id}`} className="text-sm hover:text-gold">
                    {order.orderNumber}
                  </Link>
                  <p className="mt-0.5 text-xs text-ash">{formatDate(order.createdAt)}</p>
                </Td>
                <Td>
                  <p className="text-sm">{order.customerName}</p>
                  <p className="mt-0.5 max-w-48 truncate text-xs text-ash">{order.email}</p>
                </Td>
                <Td className="text-sm tabular-nums text-ash">{order.items.length}</Td>
                <Td>
                  <span
                    className={`inline-flex border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.12em] ${orderStatusTone(order.status)}`}
                  >
                    {titleCase(order.status)}
                  </span>
                </Td>
                <Td>
                  <span
                    className={`inline-flex border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.12em] ${orderStatusTone(order.paymentStatus)}`}
                  >
                    {titleCase(order.paymentStatus)}
                  </span>
                </Td>
                <Td className="text-sm tabular-nums">{formatPrice(order.total)}</Td>
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
            <EmptyRow colSpan={7}>No orders match these filters.</EmptyRow>
          )}
        </AdminTable>
      </Card>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="text-ash">
            Page {safePage} of {totalPages} · {filtered.length} orders
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
