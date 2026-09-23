import { notFound } from "next/navigation";

import { OrderDetail } from "@/components/admin/order-detail";
import { AdminPageHeader } from "@/components/admin/ui";
import { getOrderById } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  return { title: order ? order.orderNumber : "Order" };
}

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <>
      <AdminPageHeader
        title={order.orderNumber}
        description={`Placed ${formatDate(order.createdAt)} by ${order.customerName}`}
      />
      <OrderDetail order={order} />
    </>
  );
}
