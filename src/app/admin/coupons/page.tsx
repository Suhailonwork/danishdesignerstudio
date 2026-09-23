import { CouponsManager } from "@/components/admin/managers";
import { AdminPageHeader } from "@/components/admin/ui";
import { getCoupons } from "@/lib/data/queries";

export const metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <>
      <AdminPageHeader
        title="Coupons"
        description="Discount codes. Every code is re-validated on the server when an order is placed."
      />
      <CouponsManager coupons={coupons} />
    </>
  );
}
