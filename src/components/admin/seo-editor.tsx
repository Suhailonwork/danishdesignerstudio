"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

import type { SeoFields } from "@/types";
import { Input, Textarea } from "@/components/ui/field";
import { absoluteUrl, cn, truncate } from "@/lib/utils";

import { ImageField } from "./image-field";
import { Card, Toggle } from "./ui";

/**
 * SEO panel reused by every editable resource. The live preview is what makes
 * this usable by a non-technical shop owner.
 */
export function SeoEditor({
  seo,
  path,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  showKeywords = true,
}: {
  seo?: SeoFields | null;
  /** The public path this resource will live at, e.g. /product/black-kurta */
  path: string;
  fallbackTitle: string;
  fallbackDescription?: string | null;
  fallbackImage?: string | null;
  showKeywords?: boolean;
}) {
  const [title, setTitle] = useState(seo?.metaTitle ?? "");
  const [description, setDescription] = useState(seo?.metaDescription ?? "");

  const previewTitle = title || fallbackTitle;
  const previewDescription =
    description || fallbackDescription || "Add a meta description to control this snippet.";
  const url = absoluteUrl(path);

  const titleLength = previewTitle.length;
  const descriptionLength = previewDescription.length;

  return (
    <Card
      title="Search engine optimisation"
      description="Controls the title, snippet and social card for this page."
    >
      <div className="space-y-6">
        {/* Google-style preview */}
        <div className="border border-line bg-ivory-deep/40 p-5">
          <p className="eyebrow mb-3 flex items-center gap-2">
            <Globe className="h-3.5 w-3.5" />
            Search preview
          </p>
          <div className="max-w-2xl space-y-1 bg-white p-4">
            <p className="truncate text-xs text-emerald-800">{url}</p>
            <p className="text-lg leading-snug text-[#1a0dab]">{truncate(previewTitle, 60)}</p>
            <p className="text-sm leading-relaxed text-[#4d5156]">
              {truncate(previewDescription, 158)}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-5 text-[0.7rem]">
            <span className={cn(titleLength > 60 ? "text-danger" : "text-ash")}>
              Title {titleLength}/60
            </span>
            <span className={cn(descriptionLength > 158 ? "text-danger" : "text-ash")}>
              Description {descriptionLength}/158
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Input
            name="metaTitle"
            label="Meta title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={fallbackTitle}
            hint="Leave blank to use the page title."
          />
          <Input
            name="canonicalUrl"
            label="Canonical URL"
            defaultValue={seo?.canonicalUrl ?? ""}
            placeholder={url}
            hint="Leave blank for the automatic canonical."
          />
        </div>

        <Textarea
          name="metaDescription"
          label="Meta description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={fallbackDescription ?? ""}
          hint="Aim for 140–158 characters."
        />

        {showKeywords ? (
          <Input
            name="keywords"
            label="Keywords"
            defaultValue={seo?.keywords?.join(", ") ?? ""}
            placeholder="sherwani, groom wear, wedding"
            hint="Comma separated."
          />
        ) : null}

        <div className="grid gap-5 lg:grid-cols-2">
          <Input
            name="ogTitle"
            label="Open Graph title"
            defaultValue={seo?.ogTitle ?? ""}
            placeholder={previewTitle}
          />
          <Input
            name="ogDescription"
            label="Open Graph description"
            defaultValue={seo?.ogDescription ?? ""}
            placeholder={truncate(previewDescription, 90)}
          />
        </div>

        <ImageField
          name="ogImage"
          label="Social share image"
          defaultValue={seo?.ogImage ?? fallbackImage ?? ""}
          hint="1200 × 630 works best. Falls back to the main image."
        />

        <div className="flex flex-wrap gap-8 border-t border-line pt-5">
          <Toggle
            name="noIndex"
            label="No index"
            description="Hide this page from search engines."
            defaultChecked={seo?.noIndex ?? false}
          />
          <Toggle
            name="noFollow"
            label="No follow"
            description="Tell crawlers not to follow links on this page."
            defaultChecked={seo?.noFollow ?? false}
          />
        </div>
      </div>
    </Card>
  );
}
