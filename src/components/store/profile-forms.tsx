"use client";

import { useActionState, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteAddress,
  saveAddress,
  updateProfile,
  type ProfileResult,
} from "@/actions/account";
import type { Address } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox, Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

function Feedback({ state }: { state: ProfileResult | null }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={cn(
        "border px-4 py-3 text-sm",
        state.ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900"
      )}
    >
      {state.message}
    </p>
  );
}

export function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string | null;
  email: string;
}) {
  const [state, formAction, pending] = useActionState<ProfileResult | null, FormData>(
    updateProfile,
    null
  );

  return (
    <form action={formAction} className="space-y-5 border border-line bg-white p-7" noValidate>
      <h2 className="text-xl">Profile</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="fullName"
          label="Full name"
          defaultValue={fullName}
          required
          error={state?.fieldErrors?.fullName}
        />
        <Input name="phone" label="Phone" type="tel" defaultValue={phone ?? ""} />
      </div>

      <Input label="Email" value={email} disabled readOnly hint="Contact support to change your email address." />

      <Feedback state={state} />

      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Save changes
      </Button>
    </form>
  );
}

export function AddressBook({ addresses }: { addresses: Address[] }) {
  const [showForm, setShowForm] = useState(!addresses.length);
  const [state, formAction, pending] = useActionState<ProfileResult | null, FormData>(
    saveAddress,
    null
  );
  const [removing, setRemoving] = useState<string | null>(null);

  async function onDelete(id: string) {
    setRemoving(id);
    const result = await deleteAddress(id);
    setRemoving(null);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <section className="space-y-5 border border-line bg-white p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl">Saved addresses</h2>
        <Button variant="outline" size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-3.5 w-3.5" />
          {showForm ? "Close" : "Add address"}
        </Button>
      </div>

      {addresses.length ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className="relative border border-line p-5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-ash">
                  {address.label}
                  {address.isDefault ? " · Default" : ""}
                </p>
                <button
                  type="button"
                  onClick={() => onDelete(address.id)}
                  disabled={removing === address.id}
                  aria-label={`Delete ${address.label} address`}
                  className="text-ash transition-colors hover:text-danger disabled:opacity-50"
                >
                  {removing === address.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
              <address className="mt-3 not-italic leading-relaxed text-ink-soft">
                {address.fullName}
                <br />
                {address.line1}
                {address.line2 ? (
                  <>
                    <br />
                    {address.line2}
                  </>
                ) : null}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
                <br />
                {address.phone}
              </address>
            </li>
          ))}
        </ul>
      ) : !showForm ? (
        <p className="text-sm text-ash">No addresses saved yet.</p>
      ) : null}

      {showForm ? (
        <form action={formAction} className="space-y-4 border-t border-line pt-6" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="label" label="Label" placeholder="Home, Office…" defaultValue="Home" />
            <Input
              name="fullName"
              label="Recipient name"
              required
              error={state?.fieldErrors?.fullName}
            />
          </div>
          <Input name="phone" label="Phone" type="tel" required error={state?.fieldErrors?.phone} />
          <Input name="line1" label="Address line 1" required error={state?.fieldErrors?.line1} />
          <Input name="line2" label="Address line 2" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input name="city" label="City" required error={state?.fieldErrors?.city} />
            <Input name="state" label="State" required error={state?.fieldErrors?.state} />
            <Input
              name="postalCode"
              label="PIN code"
              required
              inputMode="numeric"
              error={state?.fieldErrors?.postalCode}
            />
          </div>
          <Input name="country" label="Country" defaultValue="India" />
          <Checkbox name="isDefault" label="Set as my default shipping address" />

          <Feedback state={state} />

          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save address
          </Button>
        </form>
      ) : null}
    </section>
  );
}
