"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useLocalArray, writeLocalArray } from "@/hooks/use-local-storage";
import { effectivePrice, formatPrice } from "@/lib/utils";

interface ViewedItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice: number | null;
}

const KEY = "dds.viewed.v1";
const MAX = 8;

/** Records the current product in history and renders the rest of it. */
export function RecentlyViewed({ current }: { current: ViewedItem }) {
  const { value: history, hydrated } = useLocalArray<ViewedItem>(KEY);

  // The list shown is the history as it was *before* this product was recorded,
  // captured once so it does not disappear the moment we write.
  const [snapshotId, setSnapshotId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<ViewedItem[]>([]);

  if (hydrated && snapshotId !== current.id) {
    // Adjusting state during render is the supported way to respond to a prop
    // change without an extra effect pass.
    setSnapshotId(current.id);
    setSnapshot(history.filter((item) => item.id !== current.id).slice(0, MAX));
    writeLocalArray(
      KEY,
      [current, ...history.filter((item) => item.id !== current.id)].slice(0, MAX + 1)
    );
  }

  const items = useMemo(() => snapshot.slice(0, MAX), [snapshot]);

  if (!items.length) return null;

  return (
    <section className="border-t border-line pt-12" aria-label="Recently viewed">
      <h2 className="mb-8 text-2xl">Recently viewed</h2>
      <ul className="hide-scrollbar flex gap-5 overflow-x-auto pb-2">
        {items.map((item) => (
          <li key={item.id} className="w-36 shrink-0 sm:w-44">
            <Link href={`/product/${item.slug}`} className="group block">
              <div className="relative aspect-3/4 overflow-hidden bg-ivory-deep">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="176px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-snug text-ink">{item.name}</p>
              <p className="mt-1 text-sm tabular-nums text-ash">
                {formatPrice(effectivePrice(item.price, item.salePrice))}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
