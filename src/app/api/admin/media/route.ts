import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getMediaItems } from "@/lib/data/queries";

/** Media library listing for the admin pickers. Admin-only. */
export async function GET() {
  const user = await getCurrentUser();

  // In demo mode there is no session, but the bundled library is not sensitive.
  const items = await getMediaItems();
  if (!user?.isAdmin && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      bucket: item.bucket,
      mimeType: item.mimeType,
    })),
  });
}
