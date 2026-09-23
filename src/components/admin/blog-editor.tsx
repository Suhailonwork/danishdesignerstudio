"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { BlogCategory, BlogPost } from "@/types";
import { saveBlogPost } from "@/actions/admin/content";
import type { AdminResult } from "@/actions/admin/core";
import { Input, Select, Textarea } from "@/components/ui/field";
import { slugify } from "@/lib/utils";

import { ImageField } from "./image-field";
import { SeoEditor } from "./seo-editor";
import { Card, FormFeedback, SubmitButton, Toggle } from "./ui";

export function BlogEditor({
  post,
  categories,
}: {
  post?: BlogPost;
  categories: BlogCategory[];
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<AdminResult | null, FormData>(saveBlogPost, null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [faqs, setFaqs] = useState(
    post?.faqs.length ? post.faqs : [{ question: "", answer: "" }]
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message);
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card title="Article">
            <div className="space-y-5">
              <Input
                name="title"
                label="Title"
                required
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (!post) setSlug(slugify(event.target.value));
                }}
                error={state?.fieldErrors?.title}
              />
              <Input
                name="slug"
                label="URL slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                hint={`/blog/${slug || "your-article"}`}
              />
              <Textarea
                name="excerpt"
                label="Excerpt"
                rows={3}
                required
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                hint="Shown on the journal index and used as the default meta description."
                error={state?.fieldErrors?.excerpt}
              />
              <Textarea
                name="content"
                label="Content"
                rows={22}
                required
                defaultValue={post?.content ?? ""}
                hint="Simple markdown: ## heading, ### subheading, **bold**, - list, 1. numbered."
                error={state?.fieldErrors?.content}
                className="font-mono text-xs leading-relaxed"
              />
            </div>
          </Card>

          <Card
            title="FAQ"
            description="Rendered on the page and published as FAQ structured data."
          >
            <div className="space-y-5">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-3 border border-line p-4">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">Question {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => setFaqs((c) => c.filter((_, i) => i !== index))}
                      className="text-ash hover:text-danger"
                      aria-label={`Remove question ${index + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Input
                    name="faqQuestion"
                    label="Question"
                    defaultValue={faq.question}
                    placeholder="How far in advance should I order?"
                  />
                  <Textarea
                    name="faqAnswer"
                    label="Answer"
                    rows={3}
                    defaultValue={faq.answer}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFaqs((c) => [...c, { question: "", answer: "" }])}
                className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs transition-colors hover:border-ink"
              >
                <Plus className="h-3.5 w-3.5" />
                Add question
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publishing">
            <div className="space-y-5">
              <Toggle
                name="isPublished"
                label="Published"
                description="Drafts are hidden from the journal and the sitemap."
                defaultChecked={post?.status === "published"}
              />
              <Input
                name="publishedAt"
                label="Publish date"
                type="date"
                defaultValue={(post?.publishedAt ?? new Date().toISOString()).slice(0, 10)}
                hint="A future date schedules the article."
              />
              <Select name="categoryId" label="Category" defaultValue="">
                <option value="">Uncategorised</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <Input name="authorName" label="Author" defaultValue={post?.authorName ?? "Danish Designer Studio Studio"} />
              <Input
                name="tags"
                label="Tags"
                defaultValue={post?.tags.join(", ") ?? ""}
                hint="Comma separated."
              />
            </div>
          </Card>

          <Card title="Cover image">
            <ImageField
              name="coverImage"
              label="Cover"
              bucket="blog-images"
              defaultValue={coverImage}
              hint="16:9 works best."
            />
            <input type="hidden" value={coverImage} onChange={() => setCoverImage(coverImage)} />
          </Card>

          {post ? (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-ash hover:text-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on the storefront
            </Link>
          ) : null}
        </div>
      </div>

      <SeoEditor
        seo={post?.seo}
        path={`/blog/${slug || "your-article"}`}
        fallbackTitle={title || "Article title"}
        fallbackDescription={excerpt}
        fallbackImage={post?.coverImage}
      />

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-ivory/95 py-4 backdrop-blur-sm">
        <SubmitButton>{post ? "Save article" : "Create article"}</SubmitButton>
        <span className="flex-1" />
        <div className="w-full sm:w-auto">
          <FormFeedback state={state} />
        </div>
      </div>
    </form>
  );
}
