"use client";

import { useActionState, useCallback, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import type { SeoFields } from "@/types";
import type { AdminResult } from "@/actions/admin/core";
import { deleteRecord } from "@/actions/admin/core";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input, Select, Textarea } from "@/components/ui/field";

import { ImageField } from "./image-field";
import { SeoEditor } from "./seo-editor";
import { AdminTable, Card, ConfirmAction, EmptyRow, FormFeedback, SubmitButton, Toggle } from "./ui";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "toggle"
  | "image"
  | "date"
  | "url";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
  half?: boolean;
  bucket?: string;
}

export interface ResourceRecord {
  id: string;
}

interface SeoConfig {
  pathPrefix: string;
  slugField: string;
  titleField: string;
  imageField?: string;
}

export function ResourceManager<T extends ResourceRecord>({
  table,
  title,
  description,
  items,
  columns,
  head,
  fields,
  action,
  toFormValues,
  seo,
  createLabel = "Add new",
  revalidate = [],
  extraFormContent,
}: {
  table: string;
  title: string;
  description?: string;
  items: T[];
  head: string[];
  columns: (item: T) => ReactNode;
  fields: FieldDef[];
  action: (prev: AdminResult | null, formData: FormData) => Promise<AdminResult>;
  /** Maps a record onto the field defaults for editing. */
  toFormValues: (item: T) => Record<string, string | number | boolean | null | undefined>;
  seo?: SeoConfig;
  createLabel?: string;
  revalidate?: string[];
  extraFormContent?: (item: T | null) => ReactNode;
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);

  // Reacting inside the action keeps the drawer in step with the result without
  // a state-syncing effect.
  const runAction = useCallback(
    async (prev: AdminResult | null, formData: FormData) => {
      const result = await action(prev, formData);
      if (result.ok) {
        toast.success(result.message);
        setOpen(false);
        setEditing(null);
      } else {
        toast.error(result.message);
      }
      return result;
    },
    [action]
  );

  const [state, formAction] = useActionState<AdminResult | null, FormData>(runAction, null);

  const values = editing ? toFormValues(editing) : {};
  const seoValue = ((editing as { seo?: SeoFields | null } | null)?.seo ?? null) as SeoFields | null;
  const slugValue = seo ? String(values[seo.slugField] ?? "") : "";

  return (
    <>
      <Card
        title={title}
        description={description}
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            {createLabel}
          </Button>
        }
      >
        <AdminTable head={[...head, ""]}>
          {items.length ? (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-ivory-deep/30">
                {columns(item)}
                <td className="px-4 py-4 text-right last:pr-0">
                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(item);
                        setOpen(true);
                      }}
                      className="text-xs text-ash hover:text-ink"
                    >
                      Edit
                    </button>
                    <ConfirmAction
                      label="Delete"
                      onConfirm={() => deleteRecord(table, item.id, revalidate)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <EmptyRow colSpan={head.length + 1}>Nothing here yet — add the first one.</EmptyRow>
          )}
        </AdminTable>
      </Card>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? `Edit ${title.toLowerCase().replace(/s$/, "")}` : createLabel}
        className="max-w-2xl"
      >
        <form action={formAction} className="space-y-5" key={editing?.id ?? "new"}>
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const raw = values[field.name];
              const defaultValue =
                raw === undefined || raw === null ? field.defaultValue : raw;
              const span = field.half ? "" : "sm:col-span-2";

              if (field.type === "toggle") {
                return (
                  <div key={field.name} className={span}>
                    <Toggle
                      name={field.name}
                      label={field.label}
                      description={field.hint}
                      defaultChecked={Boolean(defaultValue)}
                    />
                  </div>
                );
              }

              if (field.type === "image") {
                return (
                  <div key={field.name} className={span}>
                    <ImageField
                      name={field.name}
                      label={field.label}
                      hint={field.hint}
                      defaultValue={String(defaultValue ?? "")}
                      bucket={field.bucket}
                    />
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.name} className={span}>
                    <Textarea
                      name={field.name}
                      label={field.label}
                      hint={field.hint}
                      rows={field.rows ?? 4}
                      required={field.required}
                      placeholder={field.placeholder}
                      defaultValue={String(defaultValue ?? "")}
                      error={state?.fieldErrors?.[field.name]}
                    />
                  </div>
                );
              }

              if (field.type === "select") {
                return (
                  <div key={field.name} className={span}>
                    <Select
                      name={field.name}
                      label={field.label}
                      hint={field.hint}
                      required={field.required}
                      defaultValue={String(defaultValue ?? "")}
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                );
              }

              return (
                <div key={field.name} className={span}>
                  <Input
                    name={field.name}
                    label={field.label}
                    hint={field.hint}
                    required={field.required}
                    placeholder={field.placeholder}
                    type={
                      field.type === "number"
                        ? "number"
                        : field.type === "date"
                          ? "date"
                          : field.type === "url"
                            ? "url"
                            : "text"
                    }
                    defaultValue={
                      field.type === "date" && defaultValue
                        ? String(defaultValue).slice(0, 10)
                        : String(defaultValue ?? "")
                    }
                    error={state?.fieldErrors?.[field.name]}
                  />
                </div>
              );
            })}
          </div>

          {extraFormContent ? extraFormContent(editing) : null}

          {seo ? (
            <SeoEditor
              seo={seoValue}
              path={`${seo.pathPrefix}/${slugValue || "new"}`}
              fallbackTitle={String(values[seo.titleField] ?? title)}
              fallbackImage={seo.imageField ? String(values[seo.imageField] ?? "") : undefined}
            />
          ) : null}

          <FormFeedback state={state} />

          <div className="sticky bottom-0 -mx-5 border-t border-line bg-ivory/95 px-5 py-4 backdrop-blur-sm md:-mx-7 md:px-7">
            <SubmitButton>{editing ? "Save changes" : "Create"}</SubmitButton>
          </div>
        </form>
      </Drawer>
    </>
  );
}
