import { notFound } from "next/navigation";

import { BlogEditor } from "@/components/admin/blog-editor";
import { AdminPageHeader } from "@/components/admin/ui";
import { getBlogCategories, getBlogPosts } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.id === id);
  return { title: post ? post.title : "Article" };
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()]);
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader
        title={post.title}
        description={`${post.categoryName} · ${formatDate(post.publishedAt)} · ${post.readingMinutes} min read`}
      />
      <BlogEditor post={post} categories={categories} />
    </>
  );
}
