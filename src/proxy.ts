import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, looksLikeSessionToken } from "@/lib/session";

// Outer fence for /admin, before any rendering starts: a request with no
// plausible session cookie is sent to the login page straight away.
//
// This is deliberately only a shape check. The real decision (is this token
// in the database, unexpired, and its account enabled?) is made on every page
// and in every server action by lib/auth.ts, which is what actually protects
// the data. Keeping the database out of the proxy keeps it fast, and a forged
// cookie that passes here still gets nothing.

const OPEN_PATHS = new Set(["/admin/login"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!OPEN_PATHS.has(pathname) && !looksLikeSessionToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next();
  // Signed-in pages must never be stored by a shared cache or indexed.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
