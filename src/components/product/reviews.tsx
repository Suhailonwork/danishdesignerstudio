"use client";

import { useActionState, useState } from "react";
import { Loader2, MessageSquarePlus, Star } from "lucide-react";

import type { Review } from "@/types";
import { submitReview, type ActionResult } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { EmptyState, Rating } from "@/components/ui/primitives";
import { cn, formatDate, initials } from "@/lib/utils";

function RatingBreakdown({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="space-y-2">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-3 text-xs text-ash">
          <span className="w-10 shrink-0 tabular-nums">{star} star</span>
          <span className="h-1.5 flex-1 bg-ivory-deep">
            <span
              className="block h-full bg-gold"
              style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
            />
          </span>
          <span className="w-6 shrink-0 text-right tabular-nums">{count}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  productSlug,
  reviews,
  ratingAverage,
  ratingCount,
}: {
  productId: string;
  productSlug: string;
  reviews: Review[];
  ratingAverage: number;
  ratingCount: number;
}) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    submitReview,
    null
  );

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : ratingAverage;

  return (
    <section id="reviews" className="border-t border-line pt-14" aria-label="Customer reviews">
      <div className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
        <div className="space-y-6">
          <h2 className="text-2xl lg:text-3xl">Customer reviews</h2>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-5xl">{average.toFixed(1)}</span>
            <div className="space-y-1">
              <Rating value={average} size="md" />
              <p className="text-xs text-ash">
                Based on {reviews.length || ratingCount} review
                {(reviews.length || ratingCount) === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {reviews.length ? <RatingBreakdown reviews={reviews} /> : null}

          <Button variant="outline" onClick={() => setShowForm((v) => !v)} className="w-full">
            <MessageSquarePlus className="h-4 w-4" />
            {showForm ? "Close" : "Write a review"}
          </Button>
        </div>

        <div className="space-y-8">
          {showForm ? (
            <form
              action={formAction}
              className="space-y-5 border border-line bg-white p-6 lg:p-8"
              noValidate
            >
              <h3 className="font-display text-xl">Share your experience</h3>

              <input type="hidden" name="productId" value={productId} />
              <input type="hidden" name="productSlug" value={productSlug} />
              <input type="hidden" name="rating" value={rating} />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute h-0 w-0 opacity-0"
              />

              <fieldset className="space-y-2">
                <legend className="text-[0.68rem] uppercase tracking-[0.16em] text-ash">
                  Your rating
                </legend>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      aria-pressed={rating === star}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          star <= rating ? "fill-gold text-gold" : "text-line-strong"
                        )}
                        strokeWidth={1.3}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="authorName"
                  label="Your name"
                  required
                  error={state?.fieldErrors?.authorName}
                />
                <Input name="title" label="Headline" placeholder="Sums up your experience" />
              </div>

              <Textarea
                name="content"
                label="Your review"
                required
                rows={5}
                placeholder="How was the fit, the fabric and the finishing?"
                error={state?.fieldErrors?.content}
              />

              {state ? (
                <p
                  className={cn(
                    "border px-4 py-3 text-sm",
                    state.ok
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                  )}
                  role="status"
                >
                  {state.message}
                </p>
              ) : null}

              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Submit review
              </Button>
            </form>
          ) : null}

          {reviews.length ? (
            <ul className="divide-y divide-line">
              {reviews.map((review) => (
                <li key={review.id} className="flex gap-4 py-6 first:pt-0">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ivory-deep text-sm text-ink">
                    {initials(review.authorName)}
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm text-ink">{review.authorName}</span>
                      {review.isVerifiedPurchase ? (
                        <span className="text-[0.65rem] uppercase tracking-[0.12em] text-emerald-700">
                          Verified purchase
                        </span>
                      ) : null}
                      <span className="text-xs text-ash">{formatDate(review.createdAt)}</span>
                    </div>
                    <Rating value={review.rating} />
                    {review.title ? (
                      <p className="font-display text-lg text-ink">{review.title}</p>
                    ) : null}
                    <p className="text-sm leading-relaxed text-ink-soft">{review.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : !showForm ? (
            <EmptyState
              title="No reviews yet"
              description="Be the first to tell other customers how this piece fits and feels."
              action={
                <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                  Write the first review
                </Button>
              }
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
