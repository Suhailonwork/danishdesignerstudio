import { TestimonialsManager } from "@/components/admin/managers";
import { AdminPageHeader } from "@/components/admin/ui";
import { getTestimonials } from "@/lib/data/queries";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Customer quotes shown in the homepage carousel."
      />
      <TestimonialsManager testimonials={testimonials} />
    </>
  );
}
