import Image from "next/image";

import { Breadcrumbs } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  eyebrow,
  image,
  breadcrumbs,
  align = "center",
  size = "md",
}: {
  title: string;
  description?: string | null;
  eyebrow?: string;
  image?: string | null;
  breadcrumbs?: { label: string; href?: string }[];
  align?: "center" | "left";
  size?: "sm" | "md" | "lg";
}) {
  const heights = {
    sm: "py-12 lg:py-16",
    md: "py-16 lg:py-24",
    lg: "py-24 lg:py-36",
  };

  if (image) {
    return (
      <section className="relative isolate overflow-hidden bg-ink">
        <Image src={image} alt="" fill sizes="100vw" priority className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/45 to-ink/30" />
        <div
          className={cn(
            "container-lux relative text-ivory",
            heights[size],
            align === "center" ? "text-center" : "text-left"
          )}
        >
          {breadcrumbs ? (
            <Breadcrumbs
              items={breadcrumbs}
              className={cn(
                "mb-5 [&_a]:text-ivory/70 [&_a:hover]:text-ivory [&_li]:text-ivory/70 [&_span]:text-ivory",
                align === "center" && "flex justify-center"
              )}
            />
          ) : null}
          {eyebrow ? <p className="eyebrow mb-3 text-ivory/70">{eyebrow}</p> : null}
          <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {description ? (
            <p
              className={cn(
                "mt-5 max-w-2xl text-sm leading-relaxed text-ivory/85 sm:text-base",
                align === "center" && "mx-auto"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-line bg-ivory-deep/60">
      <div
        className={cn(
          "container-lux",
          heights[size],
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {breadcrumbs ? (
          <Breadcrumbs
            items={breadcrumbs}
            className={cn("mb-5", align === "center" && "flex justify-center")}
          />
        ) : null}
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="text-4xl leading-tight sm:text-5xl lg:text-[3.5rem]">{title}</h1>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-2xl text-sm leading-relaxed text-ash sm:text-base",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
