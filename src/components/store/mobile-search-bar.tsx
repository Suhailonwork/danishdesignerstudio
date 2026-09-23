"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useStore } from "./store-provider";

const ROTATING = ["Sherwani", "Kurta Pajama", "Bandhgala", "Jodhpuri", "Nehru Jacket"];

/**
 * Always-visible search affordance on small screens, mirroring the reference
 * mobile layout. It opens the full search drawer rather than being a second
 * input to maintain.
 */
export function MobileSearchBar() {
  const { openPanel } = useStore();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % ROTATING.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="border-b border-line bg-ivory px-4 py-2.5 lg:hidden">
      <button
        type="button"
        onClick={() => openPanel("search")}
        className="flex w-full items-center gap-2.5 border border-line bg-white px-3.5 py-2.5 text-left transition-colors hover:border-ink"
      >
        <Search className="h-4 w-4 shrink-0 text-ash" strokeWidth={1.6} />
        <span className="truncate text-sm text-ash-light">
          Search for <span className="text-ash">{ROTATING[index]}</span>
        </span>
      </button>
    </div>
  );
}
