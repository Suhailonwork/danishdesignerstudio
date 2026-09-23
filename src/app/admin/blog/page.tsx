import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

import { AdminPageHeader, AdminTable, Card, EmptyRow, LinkButton, Pill, Td } from "@/components/admin/ui";
import { DeleteRowButton } from "@/components/admin/delete-row-button";
import { getBlogPosts } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="The journal. Each article carries its own SEO and FAQ structured data."
        actions={
          <LinkButton href="/admin/blog/new" variant="primary">
            <Plus className="h-3.5 w-3.5" />
            New article
          </LinkButton>
        }
      />

      <Card>
        <AdminTable head={["Article", "Category", "Published", "Read", "Status", ""]}>
          {posts.length ? (
            posts.map((post) => (
              <tr key={post.id} className="hover:bg-ivory-deep/30">
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="relative aspect-video w-14 shrink-0 overflow-hidden bg-ivory-deep">
                      <Image src={post.coverImage} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="max-w-72 truncate text-sm hover:text-gold"
                    >
                      {post.title}
                    </Link>
                  </div>
                </Td>
                <Td className="text-xs text-ash">{post.categoryName}</Td>
                <Td className="text-xs text-ash">{formatDate(post.publishedAt)}</Td>
                <Td className="text-xs text-ash">{post.readingMinutes} min</Td>
                <Td>
                  <Pill tone={post.status === "published" ? "success" : "muted"}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </Pill>
                </Td>
                <Td>
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/blog/${post.id}`} className="text-xs text-ash hover:text-ink">
                      Edit
                    </Link>
                    <DeleteRowButton table="blog_posts" id={post.id} revalidate={["/blog"]} />
                  </div>
                </Td>
              </tr>
            ))
          ) : (
            <EmptyRow colSpan={6}>No articles yet.</EmptyRow>
          )}
        </AdminTable>
      </Card>
    </>
  );
}
