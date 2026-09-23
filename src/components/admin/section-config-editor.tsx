"use client";

import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import type { HomeSectionType } from "@/types";
import { Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { MediaPicker } from "./media-picker";
import { Toggle } from "./ui";

/* ------------------------------------------------------------------ */
/* Field schema per section type                                       */
/* ------------------------------------------------------------------ */

type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "number"
  | "toggle"
  | "image"
  | "video"
  | "imageList"
  | "cards"
  | "badges";

interface ConfigField {
  path: string;
  label: string;
  type: FieldType;
  hint?: string;
  bucket?: string;
  aspect?: "portrait" | "wide" | "square";
  max?: number;
}

const CTA = (prefix: string, label = "Button"): ConfigField[] => [
  { path: `${prefix}.label`, label: `${label} text`, type: "text" },
  { path: `${prefix}.href`, label: `${label} link`, type: "url", hint: "e.g. /shop" },
];

export const SECTION_FIELDS: Partial<Record<HomeSectionType, ConfigField[]>> = {
  hero: [
    {
      path: "primaryImage",
      label: "Main background image",
      type: "image",
      aspect: "portrait",
      hint: "Tall image. The heading sits on top, so avoid pictures with text in them.",
    },
    {
      path: "primaryVideo",
      label: "Main background video (optional)",
      type: "video",
      hint: "Plays muted on loop and replaces the image when set.",
    },
    ...CTA("primaryCta", "Main button"),
    { path: "cards", label: "Side cards", type: "cards" },
  ],
  featured_categories: [
    { path: "limit", label: "How many categories", type: "number", hint: "Six fits the row exactly." },
  ],
  new_arrivals: [
    { path: "limit", label: "How many products", type: "number" },
    ...CTA("cta", "Link"),
  ],
  best_sellers: [
    { path: "limit", label: "How many products", type: "number" },
    ...CTA("cta", "Link"),
  ],
  trending: [
    { path: "limit", label: "How many products", type: "number" },
    ...CTA("cta", "Link"),
  ],
  editorial: [
    { path: "body", label: "Body copy", type: "textarea" },
    ...CTA("cta"),
    { path: "images", label: "Images", type: "imageList", max: 2, aspect: "portrait" },
  ],
  inspiration: [
    ...CTA("cta"),
    {
      path: "images",
      label: "Panel images",
      type: "imageList",
      max: 3,
      aspect: "portrait",
      hint: "The first sits behind the heading; the other two fill the strip.",
    },
  ],
  collection_banner: [
    { path: "limit", label: "How many collections", type: "number" },
    { path: "featuredOnly", label: "Featured collections only", type: "toggle" },
  ],
  marquee_banner: [
    { path: "image", label: "Background image", type: "image", aspect: "wide" },
    { path: "video", label: "Background video (optional)", type: "video" },
    ...CTA("cta"),
  ],
  testimonials: [
    { path: "background", label: "Background image", type: "image", aspect: "wide" },
  ],
  instagram: [
    { path: "handle", label: "Instagram handle", type: "text", hint: "Without the @." },
    { path: "url", label: "Profile link", type: "url" },
    { path: "images", label: "Grid images", type: "imageList", max: 12, aspect: "square" },
  ],
  newsletter: [{ path: "buttonText", label: "Button text", type: "text" }],
  trust_badges: [{ path: "badges", label: "Badges", type: "badges" }],
};

/* ------------------------------------------------------------------ */
/* Dotted-path helpers                                                 */
/* ------------------------------------------------------------------ */

type Config = Record<string, unknown>;

function getPath(config: Config, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Config)[key];
    return undefined;
  }, config);
}

function setPath(config: Config, path: string, value: unknown): Config {
  const keys = path.split(".");
  const next: Config = { ...config };
  let cursor: Config = next;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }
    const existing = cursor[key];
    cursor[key] = existing && typeof existing === "object" ? { ...(existing as Config) } : {};
    cursor = cursor[key] as Config;
  });

  return next;
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

interface HeroCard {
  eyebrow?: string;
  title?: string;
  image?: string;
  cta?: { label?: string; href?: string };
}

interface TrustBadge {
  icon?: string;
  title?: string;
  text?: string;
}

const BADGE_ICONS = ["truck", "shield", "credit-card", "percent"];

/**
 * Renders a friendly form for a homepage section's payload, so images, videos,
 * button text and links are all editable without touching JSON.
 */
export function SectionConfigEditor({
  type,
  config,
  onChange,
}: {
  type: HomeSectionType;
  config: Config;
  onChange: (next: Config) => void;
}) {
  const [showJson, setShowJson] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const fields = SECTION_FIELDS[type] ?? [];
  const update = (path: string, value: unknown) => onChange(setPath(config, path, value));

  return (
    <div className="space-y-5">
      {fields.length === 0 ? (
        <p className="border border-line bg-ivory-deep/40 px-4 py-3 text-sm text-ash">
          This section has no extra settings — its heading and subheading above are all it needs.
        </p>
      ) : null}

      {fields.map((field) => {
        const value = getPath(config, field.path);

        switch (field.type) {
          case "image":
          case "video":
            return (
              <MediaPicker
                key={field.path}
                label={field.label}
                hint={field.hint}
                kind={field.type}
                aspect={field.aspect}
                bucket="site-assets"
                value={typeof value === "string" ? value : ""}
                onChange={(next) => update(field.path, next)}
              />
            );

          case "imageList":
            return (
              <ImageListEditor
                key={field.path}
                label={field.label}
                hint={field.hint}
                max={field.max ?? 6}
                aspect={field.aspect}
                values={Array.isArray(value) ? (value as string[]) : []}
                onChange={(next) => update(field.path, next)}
              />
            );

          case "cards":
            return (
              <HeroCardsEditor
                key={field.path}
                label={field.label}
                cards={Array.isArray(value) ? (value as HeroCard[]) : []}
                onChange={(next) => update(field.path, next)}
              />
            );

          case "badges":
            return (
              <BadgesEditor
                key={field.path}
                label={field.label}
                badges={Array.isArray(value) ? (value as TrustBadge[]) : []}
                onChange={(next) => update(field.path, next)}
              />
            );

          case "toggle":
            return (
              <Toggle
                key={field.path}
                label={field.label}
                description={field.hint}
                checked={Boolean(value)}
                onChange={(checked) => update(field.path, checked)}
              />
            );

          case "textarea":
            return (
              <Textarea
                key={field.path}
                label={field.label}
                hint={field.hint}
                rows={4}
                value={typeof value === "string" ? value : ""}
                onChange={(event) => update(field.path, event.target.value)}
              />
            );

          case "number":
            return (
              <Input
                key={field.path}
                label={field.label}
                hint={field.hint}
                type="number"
                min={1}
                value={typeof value === "number" ? value : ""}
                onChange={(event) => update(field.path, Number(event.target.value) || 0)}
              />
            );

          default:
            return (
              <Input
                key={field.path}
                label={field.label}
                hint={field.hint}
                value={typeof value === "string" ? value : ""}
                onChange={(event) => update(field.path, event.target.value)}
              />
            );
        }
      })}

      {/* Escape hatch for anything the form does not cover. */}
      <div className="border-t border-line pt-4">
        <button
          type="button"
          onClick={() => {
            if (!showJson) {
              setJsonDraft(JSON.stringify(config, null, 2));
              setJsonError(null);
            }
            setShowJson((v) => !v);
          }}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ash hover:text-ink"
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showJson && "rotate-180")} />
          Advanced (raw JSON)
        </button>

        {showJson ? (
          <div className="mt-3 space-y-2">
            <Textarea
              label=""
              rows={12}
              value={jsonDraft}
              onChange={(event) => {
                setJsonDraft(event.target.value);
                try {
                  const parsed = JSON.parse(event.target.value);
                  setJsonError(null);
                  onChange(parsed as Config);
                } catch {
                  setJsonError("Not valid JSON yet — the form above is unchanged.");
                }
              }}
              className="font-mono text-xs"
              error={jsonError ?? undefined}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ImageListEditor({
  label,
  hint,
  values,
  max,
  aspect,
  onChange,
}: {
  label: string;
  hint?: string;
  values: string[];
  max: number;
  aspect?: "portrait" | "wide" | "square";
  onChange: (next: string[]) => void;
}) {
  const list = values.length ? values : [""];

  const set = (index: number, url: string) =>
    onChange(list.map((value, i) => (i === index ? url : value)).filter((v, i) => v || i < list.length));

  return (
    <fieldset className="space-y-3 border border-line p-4">
      <legend className="px-2 text-[0.68rem] uppercase tracking-[0.16em] text-ash">{label}</legend>
      {hint ? <p className="text-xs text-ash">{hint}</p> : null}

      {list.map((url, index) => (
        <div key={index} className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <MediaPicker
              label={`Image ${index + 1}`}
              kind="image"
              aspect={aspect}
              value={url}
              onChange={(next) => set(index, next)}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(list.filter((_, i) => i !== index))}
            aria-label={`Remove image ${index + 1}`}
            className="mb-3 grid h-9 w-9 shrink-0 place-items-center border border-line text-ash hover:border-danger hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      {list.length < max ? (
        <button
          type="button"
          onClick={() => onChange([...list.filter(Boolean), ""])}
          className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs transition-colors hover:border-ink"
        >
          <Plus className="h-3.5 w-3.5" />
          Add image
        </button>
      ) : null}
    </fieldset>
  );
}

function HeroCardsEditor({
  label,
  cards,
  onChange,
}: {
  label: string;
  cards: HeroCard[];
  onChange: (next: HeroCard[]) => void;
}) {
  const set = (index: number, patch: Partial<HeroCard>) =>
    onChange(cards.map((card, i) => (i === index ? { ...card, ...patch } : card)));

  return (
    <fieldset className="space-y-4 border border-line p-4">
      <legend className="px-2 text-[0.68rem] uppercase tracking-[0.16em] text-ash">{label}</legend>
      <p className="text-xs text-ash">
        Two cards sit beside the main hero image. Each has its own picture, labels and link.
      </p>

      {cards.map((card, index) => (
        <div key={index} className="space-y-4 border border-line p-4">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Card {index + 1}</span>
            <button
              type="button"
              onClick={() => onChange(cards.filter((_, i) => i !== index))}
              aria-label={`Remove card ${index + 1}`}
              className="text-ash hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Small label"
              value={card.eyebrow ?? ""}
              onChange={(event) => set(index, { eyebrow: event.target.value })}
            />
            <Input
              label="Heading"
              value={card.title ?? ""}
              onChange={(event) => set(index, { title: event.target.value })}
            />
          </div>

          <MediaPicker
            label="Card image"
            kind="image"
            aspect="wide"
            value={card.image ?? ""}
            onChange={(next) => set(index, { image: next })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Button text"
              value={card.cta?.label ?? ""}
              onChange={(event) => set(index, { cta: { ...card.cta, label: event.target.value } })}
            />
            <Input
              label="Button link"
              value={card.cta?.href ?? ""}
              onChange={(event) => set(index, { cta: { ...card.cta, href: event.target.value } })}
            />
          </div>
        </div>
      ))}

      {cards.length < 2 ? (
        <button
          type="button"
          onClick={() => onChange([...cards, { eyebrow: "", title: "", image: "", cta: { label: "", href: "/shop" } }])}
          className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs transition-colors hover:border-ink"
        >
          <Plus className="h-3.5 w-3.5" />
          Add card
        </button>
      ) : null}
    </fieldset>
  );
}

function BadgesEditor({
  label,
  badges,
  onChange,
}: {
  label: string;
  badges: TrustBadge[];
  onChange: (next: TrustBadge[]) => void;
}) {
  const set = (index: number, patch: Partial<TrustBadge>) =>
    onChange(badges.map((badge, i) => (i === index ? { ...badge, ...patch } : badge)));

  return (
    <fieldset className="space-y-4 border border-line p-4">
      <legend className="px-2 text-[0.68rem] uppercase tracking-[0.16em] text-ash">{label}</legend>

      {badges.map((badge, index) => (
        <div key={index} className="grid gap-3 border border-line p-3 sm:grid-cols-[8rem_1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-[0.62rem] uppercase tracking-[0.12em] text-ash">Icon</span>
            <select
              value={badge.icon ?? "shield"}
              onChange={(event) => set(index, { icon: event.target.value })}
              className="w-full border border-line bg-white px-2 py-2 text-sm outline-none focus:border-ink"
            >
              {BADGE_ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Title"
            value={badge.title ?? ""}
            onChange={(event) => set(index, { title: event.target.value })}
          />
          <Input
            label="Text"
            value={badge.text ?? ""}
            onChange={(event) => set(index, { text: event.target.value })}
          />
          <button
            type="button"
            onClick={() => onChange(badges.filter((_, i) => i !== index))}
            aria-label={`Remove badge ${index + 1}`}
            className="mb-1 grid h-9 w-9 shrink-0 self-end place-items-center border border-line text-ash hover:border-danger hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      {badges.length < 4 ? (
        <button
          type="button"
          onClick={() => onChange([...badges, { icon: "shield", title: "", text: "" }])}
          className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs transition-colors hover:border-ink"
        >
          <Plus className="h-3.5 w-3.5" />
          Add badge
        </button>
      ) : null}
    </fieldset>
  );
}
