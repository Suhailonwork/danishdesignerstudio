import { BlogEditor } from "@/components/admin/blog-editor";
import { AdminPageHeader } from "@/components/admin/ui";
import { getBlogCategories } from "@/lib/data/queries";

export const metadata = { title: "New article" };

export default async function NewBlogPostPage() {
  const categories = await getBlogCategories();

  return (
    <>
      <AdminPageHeader title="New article" description="Write it, set the SEO, then publish." />
      <BlogEditor categories={categories} />
    </>
  );
}
