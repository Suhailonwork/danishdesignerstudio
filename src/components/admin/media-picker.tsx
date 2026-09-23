"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { FolderOpen, ImageOff, Loader2, Trash2, Upload, Video } from "lucide-react";
import { toast } from "sonner";

import { Drawer } from "@/components/ui/drawer";
import { FieldShell } from "@/components/ui/field";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, slugify } from "@/lib/utils";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE = 8 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;

export type MediaKind = "image" | "video";

interface LibraryItem {
  id: string;
  name: string;
  url: string;
  bucket: string;
  mimeType: string;
}

export async function uploadMedia(file: File, bucket: string, kind: MediaKind): Promise<string> {
  const allowed = kind === "video" ? VIDEO_TYPES : IMAGE_TYPES;
  const max = kind === "video" ? MAX_VIDEO : MAX_IMAGE;

  if (!allowed.includes(file.type)) {
    throw new Error(
      kind === "video" ? "Use an MP4 or WebM video." : "Use a JPG, PNG, WebP, AVIF or SVG image."
    );
  }
  if (file.size > max) {
    throw new Error(`${kind === "video" ? "Videos" : "Images"} must be under ${max / 1024 / 1024}MB.`);
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Connect Supabase to upload. You can paste a URL instead.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? (kind === "video" ? "mp4" : "jpg");
  const path = `${new Date().getFullYear()}/${slugify(file.name.replace(/\.[^.]+$/, "")).slice(
    0,
    48
  )}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  await supabase.from("media").insert({
    name: file.name,
    url: data.publicUrl,
    bucket,
    path,
    mime_type: file.type,
    size_bytes: file.size,
    folder: bucket,
  });

  return data.publicUrl;
}

/** Thumbnail + preview for whatever the field currently points at. */
function Preview({ value, kind, className }: { value: string; kind: MediaKind; className?: string }) {
  if (!value) {
    return (
      <span className={cn("grid h-full w-full place-items-center text-ash-light", className)}>
        {kind === "video" ? (
          <Video className="h-5 w-5" strokeWidth={1.3} />
        ) : (
          <ImageOff className="h-5 w-5" strokeWidth={1.3} />
        )}
      </span>
    );
  }

  if (kind === "video") {
    return <video src={value} muted playsInline className="h-full w-full object-cover" />;
  }

  return <Image src={value} alt="" fill sizes="96px" className="object-cover" />;
}

/**
 * One media field: upload a new file, reuse something from the library, or
 * paste a URL. Used everywhere the admin can change an image or a video.
 */
export function MediaPicker({
  name,
  label,
  hint,
  defaultValue = "",
  value: controlledValue,
  onChange,
  kind = "image",
  bucket = "site-assets",
  aspect = "portrait",
}: {
  name?: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  kind?: MediaKind;
  bucket?: string;
  aspect?: "portrait" | "wide" | "square";
}) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue ?? internal;

  const setValue = useCallback(
    (next: string) => {
      if (onChange) onChange(next);
      else setInternal(next);
    },
    [onChange]
  );

  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setUploading(true);
    try {
      setValue(await uploadMedia(file, bucket, kind));
      toast.success(kind === "video" ? "Video uploaded" : "Image uploaded");
    } catch (error) {
      toast.error("Upload failed", { description: (error as Error).message });
    } finally {
      setUploading(false);
    }
  }

  const box =
    aspect === "wide" ? "aspect-video w-32" : aspect === "square" ? "aspect-square w-24" : "aspect-3/4 w-20";

  return (
    <FieldShell label={label} hint={hint}>
      <div className="flex gap-4">
        <div className={cn("relative shrink-0 overflow-hidden border border-line bg-ivory-deep", box)}>
          <Preview value={value} kind={kind} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            type="url"
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={kind === "video" ? "https://… .mp4" : "/media/… or https://…"}
            className="w-full border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 text-xs text-ink transition-colors hover:border-ink disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              Upload
            </button>

            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 text-xs text-ink transition-colors hover:border-ink"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Library
            </button>

            {value ? (
              <button
                type="button"
                onClick={() => setValue("")}
                className="inline-flex items-center gap-1.5 text-xs text-ash hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={(kind === "video" ? VIDEO_TYPES : IMAGE_TYPES).join(",")}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onFile(file);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      <MediaLibraryDrawer
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        kind={kind}
        onSelect={(url) => {
          setValue(url);
          setLibraryOpen(false);
        }}
      />
    </FieldShell>
  );
}

function MediaLibraryDrawer({
  open,
  onClose,
  onSelect,
  kind,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  kind: MediaKind;
}) {
  const [items, setItems] = useState<LibraryItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [loadedFor, setLoadedFor] = useState(false);

  // Fetch lazily the first time the drawer opens.
  if (open && !loadedFor) {
    setLoadedFor(true);
    fetch("/api/admin/media")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load the library"))))
      .then((data: { items: LibraryItem[] }) => setItems(data.items))
      .catch(() => setItems([]));
  }

  const filtered = (items ?? []).filter((item) => {
    const isVideo = item.mimeType.startsWith("video/");
    if (kind === "video" ? !isVideo : isVideo) return false;
    return item.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <Drawer open={open} onClose={onClose} title="Media library" className="max-w-2xl">
      <div className="space-y-5">
        <input
          data-autofocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the library"
          aria-label="Search media library"
          className="w-full border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />

        {items === null ? (
          <p className="flex items-center gap-2 py-10 text-sm text-ash">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading the library…
          </p>
        ) : filtered.length ? (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.url)}
                  className="group block w-full border border-line transition-colors hover:border-ink"
                >
                  <span className="relative block aspect-square overflow-hidden bg-ivory-deep">
                    <Preview value={item.url} kind={kind} />
                  </span>
                  <span className="block truncate px-2 py-1.5 text-left text-[0.65rem] text-ash">
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-ash">
            Nothing here yet. Upload a file and it becomes reusable across the whole site.
          </p>
        )}
      </div>
    </Drawer>
  );
}
