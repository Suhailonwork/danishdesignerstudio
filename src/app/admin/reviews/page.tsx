import { ReviewsModeration } from "@/components/admin/reviews-moderation";
import { AdminPageHeader } from "@/components/admin/ui";
import { getAllReviews } from "@/lib/data/queries";

export const metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <>
      <AdminPageHeader
        title="Reviews"
        description="New reviews arrive as pending and only appear on the storefront once approved."
      />
      <ReviewsModeration reviews={reviews} />
    </>
  );
}
