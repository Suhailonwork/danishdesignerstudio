import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
const configured = SUPABASE_URL.length > 16 && SUPABASE_ANON_KEY.length > 16;

/**
 * Refreshes the Supabase session cookie on every request so Server Components
 * always see a valid session, and gates /admin behind an authenticated admin.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!configured) {
    // Without a database there is nothing to authenticate; the admin panel
    // renders in read-only demo mode and every write path refuses.
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isAuthRoute = pathname === "/admin/sign-in" || pathname === "/admin/no-access";

    if (!user && !isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/sign-in";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (user && !isAuthRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, role")
        .eq("id", user.id)
        .maybeSingle();

      const isAdmin =
        Boolean(profile?.is_admin) || profile?.role === "admin" || profile?.role === "staff";

      if (!isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/no-access";
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
  }

  if (!user && (pathname.startsWith("/account/orders") || pathname.startsWith("/account/profile"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/account/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets, images and the favicon — those never
     * need a session refresh and skipping them keeps navigation fast.
     */
    "/((?!_next/static|_next/image|favicon.ico|media/|logo.svg|icon.svg|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
