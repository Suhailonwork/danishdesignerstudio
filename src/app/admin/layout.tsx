import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/shell";
import { getAdminContext } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Admin — Danish Designer Studio",
    template: "%s | Danish Designer Studio Admin",
  },
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, demoMode } = await getAdminContext();

  return (
    <AdminShell
      user={user ? { fullName: user.fullName, email: user.email } : null}
      demoMode={demoMode}
    >
      {children}
    </AdminShell>
  );
}
