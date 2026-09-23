"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { HomeSection, Testimonial } from "@/types";
import { Rating } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function Testimonials({
  section,
  testimonials,
}: {
  section: HomeSection;
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const background = (section.config as { background?: string }).background;

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(((next % testimonials.length) + testimonials.length) % testimonials.length);
    },
    [index, testimonials.length]
  );

  useEffect(() => {
    if (testimonials.length < 2) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) return null;
  const item = testimonials[index];

  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 lg:py-28">
      {background ? (
        <Image
          src={background}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
      ) : null}
      <div className="absolute inset-0 bg-ink/55" />

      <div className="container-lux relative">
        <h2 className="text-center text-3xl text-ivory sm:text-4xl lg:text-[2.75rem]">
          {section.title ?? "What our customers say"}
        </h2>

        <div className="relative mx-auto mt-12 max-w-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.figure
              key={item.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-6 px-2 text-center text-ivory"
            >
              <Quote className="h-7 w-7 text-gold-soft" strokeWidth={1.2} />
              <Rating value={item.rating} className="justify-center" />
              <blockquote className="text-lg leading-relaxed text-ivory/92 sm:text-xl">
                “{item.content}”
              </blockquote>
              <figcaption className="space-y-1">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-ivory">
                  {item.authorName}
                </p>
                {item.location ? (
                  <p className="font-display text-base italic text-ivory/70">{item.location}</p>
                ) : null}
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          {testimonials.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous testimonial"
                className="absolute -left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ivory/35 text-ivory transition-colors hover:bg-ivory hover:text-ink lg:-left-14"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next testimonial"
                className="absolute -right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ivory/35 text-ivory transition-colors hover:bg-ivory hover:text-ink lg:-right-14"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>

        {testimonials.length > 1 ? (
          <div className="mt-10 flex justify-center gap-2">
            {testimonials.map((testimonial, i) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-1 w-8 transition-colors duration-300",
                  i === index ? "bg-ivory" : "bg-ivory/30 hover:bg-ivory/60"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
