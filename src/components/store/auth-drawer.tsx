"use client";

import { User } from "lucide-react";

import { Drawer } from "@/components/ui/drawer";

import { AuthForm } from "./auth-form";
import { useStore } from "./store-provider";

export function AuthDrawer() {
  const { panel, closePanel } = useStore();

  return (
    <Drawer
      open={panel === "auth"}
      onClose={closePanel}
      title={
        <span className="flex items-center gap-2">
          <User className="h-4 w-4" strokeWidth={1.5} />
          Sign in
        </span>
      }
    >
      <AuthForm compact onSuccess={closePanel} />
    </Drawer>
  );
}
