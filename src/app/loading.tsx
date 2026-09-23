import { Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div className="container-lux space-y-10 py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-[26rem] w-full" />
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-3/4 w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
