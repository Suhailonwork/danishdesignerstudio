"use client";

import { useActionState, useCallback, useState } from "react";
import { Eye, EyeOff, GripVertical, Plus } from "lucide-react";
import { toast } from "sonner";

import type { HomeSection, HomeSectionType } from "@/types";
import { saveHomeSection } from "@/actions/admin/content";
import { deleteRecord, reorderRecords, toggleBoolean } from "@/actions/admin/core";
import type { AdminResult } from "@/actions/admin/core";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input, Select } from "@/components/ui/field";
import { SectionConfigEditor } from "./section-config-editor";
import { Card, ConfirmAction, FormFeedback, Pill, SubmitButton, Toggle } from "@/components/admin/ui";
import { cn, titleCase } from "@/lib/utils";

const SECTION_TYPES: { value: HomeSectionType; label: string; hint: string }[] = [
  { value: "hero", label: "Hero", hint: "Large editorial banner plus two stacked cards." },
  { value: "featured_categories", label: "Featured categories", hint: "Category tiles." },
  { value: "new_arrivals", label: "New arrivals", hint: "Products flagged as new arrivals." },
  { value: "best_sellers", label: "Best sellers", hint: "Products flagged as best sellers." },
  { value: "trending", label: "Trending", hint: "Products flagged as trending." },
  { value: "editorial", label: "Editorial split", hint: "Text beside two stacked images." },
  { value: "inspiration", label: "Inspiration triptych", hint: "Three-panel editorial strip." },
  { value: "collection_banner", label: "Collection banners", hint: "Active or featured collections." },
  { value: "marquee_banner", label: "Marquee banner", hint: "Full-bleed scrolling wordmark." },
  { value: "testimonials", label: "Testimonials", hint: "Customer quote carousel." },
  { value: "instagram", label: "Instagram grid", hint: "Six-image social strip." },
  { value: "newsletter", label: "Newsletter", hint: "Email capture band." },
  { value: "trust_badges", label: "Trust badges", hint: "Delivery, payment and guarantee row." },
];

const CONFIG_TEMPLATES: Partial<Record<HomeSectionType, Record<string, unknown>>> = {
  hero: {
    primaryImage: "/media/banners/hero-primary.v3.jpg",
    primaryCta: { label: "Go to shop", href: "/shop" },
    cards: [
      {
        eyebrow: "Kurta Pajama",
        title: "New Modern",
        image: "/media/banners/hero-kurta.v3.jpg",
        cta: { label: "View product", href: "/category/kurta-pajama" },
      },
    ],
  },
  new_arrivals: { limit: 8, cta: { label: "See all", href: "/shop?sort=newest" } },
  best_sellers: { limit: 8, cta: { label: "See all", href: "/shop?sort=best_selling" } },
  trending: { limit: 8, cta: { label: "See all", href: "/shop?trending=1" } },
  featured_categories: { limit: 6 },
  collection_banner: { limit: 3, featuredOnly: true },
  editorial: {
    body: "Describe the story behind this section.",
    cta: { label: "Go to shop", href: "/shop" },
    images: ["/media/banners/editorial-vogue.v3.jpg", "/media/banners/editorial-couple.v3.jpg"],
  },
  inspiration: {
    cta: { label: "Start shopping", href: "/collections" },
    images: [
      "/media/banners/inspiration-1.v3.jpg",
      "/media/banners/inspiration-2.v3.jpg",
      "/media/banners/inspiration-3.v3.jpg",
    ],
  },
  marquee_banner: {
    image: "/media/banners/new-arrivals-strip.v3.jpg",
    cta: { label: "See new arrival", href: "/collection/new-collection" },
  },
  testimonials: { background: "/media/banners/testimonial-bg.v3.jpg" },
  instagram: {
    handle: "danishdesignerstudio",
    url: "https://instagram.com/danishdesignerstudio",
    images: [1, 2, 3, 4, 5, 6].map((n) => `/media/instagram/ig-${n}.v3.jpg`),
  },
  newsletter: { buttonText: "Subscribe" },
  trust_badges: {
    badges: [
      { icon: "truck", title: "Fast delivery", text: "Free shipping all over India" },
      { icon: "shield", title: "Secure checkout", text: "256-bit payment protection" },
    ],
  },
};

export function HomepageBuilder({ sections }: { sections: HomeSection[] }) {
  const serverOrder = sections.map((s) => s.id).join();
  const [order, setOrder] = useState(() => sections.map((s) => s.id));
  const [lastServerOrder, setLastServerOrder] = useState(serverOrder);
  const [editing, setEditing] = useState<HomeSection | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // When the server sends a new section list (after a save), adopt it. Doing
  // this during render avoids the extra pass an effect would cost.
  if (lastServerOrder !== serverOrder) {
    setLastServerOrder(serverOrder);
    setOrder(sections.map((s) => s.id));
  }

  const ordered = order
    .map((id) => sections.find((s) => s.id === id))
    .filter((s): s is HomeSection => Boolean(s));

  function move(index: number, delta: number) {
    setOrder((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function persistOrder() {
    setSaving(true);
    const result = await reorderRecords("home_sections", order, ["/"]);
    setSaving(false);
    if (result.ok) toast.success("Section order saved.");
    else toast.error(result.message);
  }

  async function toggleActive(section: HomeSection) {
    const result = await toggleBoolean(
      "home_sections",
      section.id,
      "is_active",
      !section.isActive,
      ["/"]
    );
    if (result.ok) toast.success(section.isActive ? "Section hidden." : "Section shown.");
    else toast.error(result.message);
  }

  const orderChanged = order.join() !== sections.map((s) => s.id).join();

  return (
    <>
      <Card
        title="Homepage sections"
        description="Reorder, hide or edit every band on the homepage. Content is stored as data, never hard-coded."
        actions={
          <div className="flex gap-2">
            {orderChanged ? (
              <Button size="sm" variant="outline" onClick={persistOrder} disabled={saving}>
                Save order
              </Button>
            ) : null}
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add section
            </Button>
          </div>
        }
      >
        <ul className="divide-y divide-line">
          {ordered.map((section, index) => {
            const meta = SECTION_TYPES.find((t) => t.value === section.type);
            return (
              <li
                key={section.id}
                className={cn(
                  "flex flex-wrap items-center gap-4 py-4",
                  !section.isActive && "opacity-55"
                )}
              >
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move section up"
                    className="text-xs text-ash hover:text-ink disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === ordered.length - 1}
                    aria-label="Move section down"
                    className="text-xs text-ash hover:text-ink disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>

                <GripVertical className="h-4 w-4 shrink-0 text-line-strong" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">
                    {section.title || meta?.label || titleCase(section.type)}
                  </p>
                  <p className="mt-0.5 text-xs text-ash">
                    {meta?.label ?? titleCase(section.type)}
                    {section.subtitle ? ` · ${section.subtitle}` : ""}
                  </p>
                </div>

                <Pill tone={section.isActive ? "success" : "muted"}>
                  {section.isActive ? "Visible" : "Hidden"}
                </Pill>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleActive(section)}
                    className="text-ash hover:text-ink"
                    aria-label={section.isActive ? "Hide section" : "Show section"}
                  >
                    {section.isActive ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.5} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(section);
                      setOpen(true);
                    }}
                    className="text-xs text-ash hover:text-ink"
                  >
                    Edit
                  </button>
                  <ConfirmAction
                    label="Delete"
                    onConfirm={() => deleteRecord("home_sections", section.id, ["/"])}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <SectionDrawer
        key={editing?.id ?? "new"}
        section={editing}
        open={open}
        onClose={() => setOpen(false)}
        nextOrder={ordered.length + 1}
      />
    </>
  );
}

function SectionDrawer({
  section,
  open,
  onClose,
  nextOrder,
}: {
  section: HomeSection | null;
  open: boolean;
  onClose: () => void;
  nextOrder: number;
}) {
  const [type, setType] = useState<HomeSectionType>(section?.type ?? "editorial");
  const [config, setConfig] = useState<Record<string, unknown>>(
    () => (section?.config as Record<string, unknown>) ?? {}
  );

  const runSave = useCallback(
    async (prev: AdminResult | null, formData: FormData) => {
      const result = await saveHomeSection(prev, formData);
      if (result.ok) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
      return result;
    },
    [onClose]
  );

  const [state, formAction] = useActionState<AdminResult | null, FormData>(runSave, null);

  const meta = SECTION_TYPES.find((t) => t.value === type);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={section ? "Edit section" : "Add section"}
      className="max-w-2xl"
    >
      <form action={formAction} className="space-y-5" key={section?.id ?? "new"}>
        {section ? <input type="hidden" name="id" value={section.id} /> : null}
        <input type="hidden" name="config" value={JSON.stringify(config)} />

        <Select
          name="type"
          label="Section type"
          value={type}
          onChange={(event) => {
            const next = event.target.value as HomeSectionType;
            setType(next);
            if (!section) setConfig(CONFIG_TEMPLATES[next] ?? {});
          }}
          hint={meta?.hint}
        >
          {SECTION_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Input name="title" label="Heading" defaultValue={section?.title ?? ""} />
        <Input name="subtitle" label="Subheading" defaultValue={section?.subtitle ?? ""} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="displayOrder"
            label="Display order"
            type="number"
            min={0}
            defaultValue={section?.displayOrder ?? nextOrder}
          />
          <div className="flex items-end pb-3">
            <Toggle
              name="isActive"
              label="Visible on the homepage"
              defaultChecked={section?.isActive ?? true}
            />
          </div>
        </div>

        <div className="space-y-3 border-t border-line pt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-ash">Section content</p>
            <button
              type="button"
              onClick={() => setConfig(CONFIG_TEMPLATES[type] ?? {})}
              className="text-xs text-ash underline underline-offset-4 hover:text-ink"
            >
              Reset to defaults
            </button>
          </div>

          <SectionConfigEditor type={type} config={config} onChange={setConfig} />

          {state?.fieldErrors?.config ? (
            <p className="text-xs text-danger">{state.fieldErrors.config}</p>
          ) : null}
        </div>

        <FormFeedback state={state} />
        <SubmitButton>{section ? "Save section" : "Add section"}</SubmitButton>
      </form>
    </Drawer>
  );
}
