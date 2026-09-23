"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import type { MediaItem } from "@/types";
import { deleteRecord } from "@/actions/admin/core";
import { Button } from "@/components/ui/button";
import { Card, ConfirmAction, Pill } from "@/components/admin/ui";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, formatDate, slugify } from "@/lib/utils";

const BUCKETS = [
  "product-images",
  "category-images",
  "collection-images",
  "blog-images",
  "site-assets",
  "avatars",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const [query, setQuery] = useState("");
  const [bucket, setBucket] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [targetBucket, setTargetBucket] = useState("site-assets");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let list = [...items];
    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter((item) =>
        [item.name, item.alt, item.folder].filter(Boolean).some((field) =>
          String(field).toLowerCase().includes(needle)
        )
      );
    }
    if (bucket) list = list.filter((item) => item.bucket === bucket);
    return list;
  }, [items, query, bucket]);

  async function upload(files: FileList) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Connect Supabase to upload files");
      return;
    }

    setUploading(true);
    let uploaded = 0;

    for (const file of Array.from(files)) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 8MB`);
        continue;
      }
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${new Date().getFullYear()}/${slugify(
        file.name.replace(/\.[^.]+$/, "")
      ).slice(0, 48)}-${Date.now()}.${extension}`;

      const { error } = await supabase.storage.from(targetBucket).upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
      });

      if (error) {
        toast.error(`${file.name}: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from(targetBucket).getPublicUrl(path);
      await supabase.from("media").insert({
        name: file.name,
        url: data.publicUrl,
        bucket: targetBucket,
        path,
        mime_type: file.type,
        size_bytes: file.size,
        folder: targetBucket,
      });
      uploaded += 1;
    }

    setUploading(false);
    if (uploaded) {
      toast.success(`${uploaded} file${uploaded === 1 ? "" : "s"} uploaded`);
      window.location.reload();
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error("Could not copy — select the URL manually.");
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Upload" description="Files land in Supabase Storage and are catalogued here.">
        <div className="flex flex-wrap items-end gap-4">
          <label className="min-w-48 flex-1">
            <span className="mb-1.5 block text-[0.68rem] uppercase tracking-[0.16em] text-ash">
              Destination bucket
            </span>
            <select
              value={targetBucket}
              onChange={(event) => setTargetBucket(event.target.value)}
              className="w-full border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
            >
              {BUCKETS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload files
          </Button>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) upload(event.target.files);
              event.target.value = "";
            }}
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search media"
            aria-label="Search media"
            className="w-full border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <select
          value={bucket}
          onChange={(event) => setBucket(event.target.value)}
          aria-label="Filter by bucket"
          className="border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        >
          <option value="">All buckets</option>
          {BUCKETS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {filtered.length ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <li key={item.id} className="group border border-line bg-white">
              <div className="relative aspect-square overflow-hidden bg-ivory-deep">
                <Image
                  src={item.url}
                  alt={item.alt ?? item.name}
                  fill
                  sizes="(min-width: 1280px) 18vw, (min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs text-ink" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <Pill tone="muted">{item.bucket}</Pill>
                  <span className="text-[0.65rem] text-ash">{formatBytes(item.sizeBytes)}</span>
                </div>
                <p className="text-[0.65rem] text-ash">{formatDate(item.createdAt)}</p>
                <div className="flex items-center justify-between gap-2 border-t border-line pt-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[0.7rem] transition-colors",
                      copied === item.url ? "text-emerald-700" : "text-ash hover:text-ink"
                    )}
                  >
                    {copied === item.url ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied === item.url ? "Copied" : "Copy URL"}
                  </button>
                  <ConfirmAction
                    label=""
                    icon={<Trash2 className="h-3 w-3" />}
                    onConfirm={() => deleteRecord("media", item.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <p className="py-10 text-center text-sm text-ash">
            No media matches this filter. Uploads appear here automatically.
          </p>
        </Card>
      )}
    </div>
  );
}
