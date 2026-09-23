"use client";

import { useState } from "react";
import { Check, Star, X } from "lucide-react";
import { toast } from "sonner";

import type { Review } from "@/types";
import { setReviewFeatured, setReviewStatus } from "@/actions/admin/content";
import { deleteRecord } from "@/actions/admin/core";
import { AdminTable, Card, ConfirmAction, EmptyRow, Pill, Td } from "@/components/admin/ui";
import { cn, formatDate, titleCase } from "@/lib/utils";

export function ReviewsModeration({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const visible = reviews.filter((review) => filter === "all" || review.status === filter);
  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  async function moderate(id: string, status: "approved" | "rejected" | "pending") {
    const result = await setReviewStatus(id, status);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  async function feature(id: string, value: boolean) {
    const result = await setReviewFeatured(id, value);
    if (result.ok) toast.success(value ? "Review featured." : "Removed from featured.");
    else toast.error(result.message);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1">
        {(["pending", "approved", "rejected", "all"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={cn(
              "border px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.12em] transition-colors",
              filter === value
                ? "border-ink bg-ink text-ivory"
                : "border-line text-ash hover:border-ink hover:text-ink"
            )}
          >
            {titleCase(value)} ({counts[value]})
          </button>
        ))}
      </div>

      <Card>
        <AdminTable head={["Customer", "Product", "Rating", "Review", "Status", ""]}>
          {visible.length ? (
            visible.map((review) => (
              <tr key={review.id} className="hover:bg-ivory-deep/30">
                <Td>
                  <p className="text-sm">{review.authorName}</p>
                  <p className="mt-0.5 text-xs text-ash">{formatDate(review.createdAt)}</p>
                </Td>
                <Td className="max-w-48 truncate text-sm text-ash">
                  {review.productName ?? review.productId}
                </Td>
                <Td className="whitespace-nowrap text-sm tabular-nums">{review.rating}/5</Td>
                <Td>
                  {review.title ? <p className="text-sm">{review.title}</p> : null}
                  <p className="mt-0.5 max-w-80 truncate text-xs text-ash">{review.content}</p>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    <Pill
                      tone={
                        review.status === "approved"
                          ? "success"
                          : review.status === "rejected"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {titleCase(review.status)}
                    </Pill>
                    {review.isFeatured ? <Pill>Featured</Pill> : null}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center justify-end gap-3">
                    {review.status !== "approved" ? (
                      <button
                        type="button"
                        onClick={() => moderate(review.id, "approved")}
                        className="text-ash hover:text-emerald-700"
                        aria-label="Approve review"
                      >
                        <Check className="h-4 w-4" strokeWidth={1.6} />
                      </button>
                    ) : null}
                    {review.status !== "rejected" ? (
                      <button
                        type="button"
                        onClick={() => moderate(review.id, "rejected")}
                        className="text-ash hover:text-danger"
                        aria-label="Reject review"
                      >
                        <X className="h-4 w-4" strokeWidth={1.6} />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => feature(review.id, !review.isFeatured)}
                      className={cn(
                        "hover:text-gold",
                        review.isFeatured ? "text-gold" : "text-ash"
                      )}
                      aria-label={review.isFeatured ? "Unfeature review" : "Feature review"}
                    >
                      <Star
                        className={cn("h-4 w-4", review.isFeatured && "fill-gold")}
                        strokeWidth={1.6}
                      />
                    </button>
                    <ConfirmAction
                      label=""
                      onConfirm={() => deleteRecord("reviews", review.id)}
                    />
                  </div>
                </Td>
              </tr>
            ))
          ) : (
            <EmptyRow colSpan={6}>Nothing in this queue.</EmptyRow>
          )}
        </AdminTable>
      </Card>
    </div>
  );
}
