"use client";

import { deleteRecord } from "@/actions/admin/core";
import { ConfirmAction } from "@/components/admin/ui";

export function DeleteRowButton({
  table,
  id,
  revalidate = [],
  label = "Delete",
}: {
  table: string;
  id: string;
  revalidate?: string[];
  label?: string;
}) {
  return (
    <ConfirmAction label={label} onConfirm={() => deleteRecord(table, id, revalidate)} />
  );
}
