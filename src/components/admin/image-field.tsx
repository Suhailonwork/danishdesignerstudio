"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, FolderOpen, ImageOff, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { FieldShell } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { MediaPicker, uploadMedia } from "./media-picker";

/**
 * Single image field. A thin wrapper over MediaPicker so every image in the
 * admin — categories, collections, banners, testimonials, blog covers, OG
 * images, the logo — can be uploaded, picked from the library, or pasted.
 */
export function ImageField({
  name,
  label,
  defaultValue = "",
  hint,
  bucket = "site-assets",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  bucket?: string;
}) {
  return (
    <MediaPicker
      name={name}
      label={label}
      hint={hint}
      bucket={bucket}
      kind="image"
      aspect="portrait"
      defaultValue={defaultValue}
    />
  );
}

/** Ordered product gallery: upload many, reorder, or pull from the library. */
export function ImageListField({
  name,
  label,
  defaultValues = [],
  bucket = "product-images",
}: {
  name: string;
  label: string;
  defaultValues?: string[];
  bucket?: string;
}) {
  const [values, setValues] = useState<string[]>(defaultValues.length ? defaultValues : [""]);
  const [uploading, setUploading] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function update(index: number, next: string) {
    setValues((current) => current.map((value, i) => (i === index ? next : value)));
  }

  function move(index: number, delta: number) {
    setValues((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function onFiles(files: FileList) {
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      try {
        uploaded.push(await uploadMedia(file, bucket, "image"));
      } catch (error) {
        toast.error(`${file.name}: ${(error as Error).message}`);
      }
    }
    if (uploaded.length) {
      setValues((current) => [...current.filter(Boolean), ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`);
    }
    setUploading(false);
  }

  return (
    <FieldShell label={label} hint="The first image is used as the product thumbnail.">
      <div className="space-y-3">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-line bg-ivory-deep">
              {value ? (
                <Image src={value} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <span className="grid h-full place-items-center text-ash-light">
                  <ImageOff className="h-4 w-4" strokeWidth={1.3} />
                </span>
              )}
              {index === 0 && value ? (
                <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-0.5 text-center text-[0.55rem] uppercase tracking-[0.1em] text-ivory">
                  Main
                </span>
              ) : null}
            </div>

            <input
              type="url"
              name={name}
              value={value}
              onChange={(event) => update(index, event.target.value)}
              placeholder="/media/products/..."
              className="min-w-0 flex-1 border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
            />

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setPickerIndex(pickerIndex === index ? null : index)}
                aria-label={`Choose image ${index + 1} from the library`}
                className="grid h-8 w-8 place-items-center border border-line text-ash hover:border-ink hover:text-ink"
              >
                <FolderOpen className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move image up"
                className={cn(
                  "grid h-8 w-8 place-items-center border border-line text-ash",
                  index === 0 ? "opacity-40" : "hover:border-ink hover:text-ink"
                )}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === values.length - 1}
                aria-label="Move image down"
                className={cn(
                  "grid h-8 w-8 place-items-center border border-line text-ash",
                  index === values.length - 1 ? "opacity-40" : "hover:border-ink hover:text-ink"
                )}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setValues((c) => c.filter((_, i) => i !== index))}
                aria-label="Remove image"
                className="grid h-8 w-8 place-items-center border border-line text-ash hover:border-danger hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setValues((current) => [...current, ""])}
            className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs text-ink transition-colors hover:border-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            Add row
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs text-ink transition-colors hover:border-ink disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            Upload images
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) onFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {/* Library browser, reusing the picker so there is one implementation. */}
        {pickerIndex !== null ? (
          <div className="border border-line bg-ivory-deep/40 p-4">
            <MediaPicker
              label={`Replace image ${pickerIndex + 1}`}
              kind="image"
              aspect="portrait"
              value={values[pickerIndex] ?? ""}
              onChange={(url) => {
                update(pickerIndex, url);
                setPickerIndex(null);
              }}
            />
            <button
              type="button"
              onClick={() => setPickerIndex(null)}
              className="mt-2 text-xs text-ash underline underline-offset-4 hover:text-ink"
            >
              Done
            </button>
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
}
