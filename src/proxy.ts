import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register"];

/** Runs before every page request: refreshes the Supabase session cookie and does
 *  optimistic redirects. Not the security boundary — pages/actions re-check the user and RLS enforces data access. */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          // Refreshed tokens go to the request (so this render sees them) and to the response (so the browser keeps them).
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // Verifies the JWT and refreshes it if expired. Must run before any redirect decision.
  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);
  const path = request.nextUrl.pathname;

  const target =
    path === "/" ? (loggedIn ? "/tasks" : "/login")
    : !loggedIn && path.startsWith("/tasks") ? "/login"
    : loggedIn && AUTH_PAGES.includes(path) ? "/tasks"
    : null;
  if (!target) return response;

  const redirect = NextResponse.redirect(new URL(target, request.url));
  // Keep any refreshed session cookies on the redirect, or the user gets logged out.
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  // Skip static assets so CSS/JS/images never wait on an auth check.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
