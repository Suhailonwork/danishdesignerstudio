"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
  badge,
  videoUrl,
}: {
  images: ProductImage[];
  productName: string;
  badge?: string | null;
  videoUrl?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const safeImages = images.length
    ? images
    : [{ id: "placeholder", url: "/media/banners/og-default.v3.jpg", alt: productName, displayOrder: 1 }];

  const go = useCallback(
    (delta: number) => {
      setActive((current) => (current + delta + safeImages.length) % safeImages.length);
    },
    [safeImages.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [lightbox, go]);

  const current = safeImages[active];

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-5">
      {/* Main stage */}
      <div className="relative flex-1">
        <div
          className="group relative aspect-3/4 w-full overflow-hidden bg-ivory-deep"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setZoom({
              x: ((event.clientX - rect.left) / rect.width) * 100,
              y: ((event.clientY - rect.top) / rect.height) * 100,
            });
          }}
          onMouseLeave={() => setZoom(null)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src={current.url}
                alt={current.alt || productName}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-300 ease-out"
                style={
                  zoom
                    ? {
                        transform: "scale(1.75)",
                        transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      }
                    : undefined
                }
              />
            </motion.div>
          </AnimatePresence>

          {showVideo && videoUrl ? (
            <div className="absolute inset-0 bg-ink">
              <video
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-cover"
                aria-label={`${productName} video`}
              />
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-ivory/40 text-ivory"
                aria-label="Close video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {badge ? (
            <span className="pointer-events-none absolute left-4 top-4 bg-white/95 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-ink">
              {badge}
            </span>
          ) : null}

          {videoUrl && !showVideo ? (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-ink/90 px-4 py-2.5 text-[0.66rem] uppercase tracking-[0.16em] text-ivory backdrop-blur-sm transition-colors hover:bg-ink"
            >
              <Play className="h-3.5 w-3.5" />
              Play video
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="View full size"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-line bg-white/92 text-ink opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Expand className="h-4 w-4" strokeWidth={1.5} />
          </button>

          {safeImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/92 text-ink opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/92 text-ink opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 ? (
        <ul
          className="hide-scrollbar flex shrink-0 gap-3 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible"
          aria-label="Product images"
        >
          {safeImages.map((image, index) => (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "relative block aspect-3/4 w-16 overflow-hidden border bg-ivory-deep transition-all duration-300 lg:w-full",
                  index === active ? "border-ink" : "border-transparent opacity-65 hover:opacity-100"
                )}
              >
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] grid place-items-center bg-ink/95 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} image viewer`}
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close viewer"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative h-[82vh] w-full max-w-4xl">
              <Image
                src={current.url}
                alt={current.alt || productName}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {safeImages.length > 1 ? (
              <div className="absolute bottom-6 flex gap-2">
                {safeImages.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Image ${index + 1}`}
                    className={cn(
                      "h-1 w-10 transition-colors",
                      index === active ? "bg-ivory" : "bg-ivory/35"
                    )}
                  />
                ))}
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
