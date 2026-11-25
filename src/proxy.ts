import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, looksLikeSessionToken } from "@/lib/session";

// Two jobs, before any rendering starts:
//
// 1. Link previews are switched off. Chat and social apps (WhatsApp, iMessage,
//    Facebook, X, LinkedIn, Slack, Telegram, Discord…) fetch a shared link with
//    their own bot and build a card from its title, description and image. Those
//    bots get an empty 403 here, so a shared link shows as a bare URL. Search
//    engine crawlers (Googlebot, Bingbot) are not on the list and see the site as
//    normal. To bring previews back, delete PREVIEW_BOT and its check below; the
//    Open Graph tags and app/opengraph-image.jpg are still in place.
//
// 2. Outer fence for /admin: a request with no plausible session cookie is sent
//    to the login page straight away. This is deliberately only a shape check.
//    The real decision (is this token in the database, unexpired, and its account
//    enabled?) is made on every page and in every server action by lib/auth.ts,
//    which is what actually protects the data. Keeping the database out of the
//    proxy keeps it fast, and a forged cookie that passes here still gets nothing.

// iMessage's preview fetch identifies itself as facebookexternalhit + Twitterbot;
// Microsoft Teams and Skype as SkypeUriPreview. Only bot names here: in-app
// browsers (Instagram, LINE, Snapchat…) carry their app's name in real visitors'
// user agents, so matching on those would lock people out.
const PREVIEW_BOT =
  /WhatsApp|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|SkypeUriPreview|Pinterestbot|redditbot|vkShare|Embedly|Iframely/i;

const ADMIN_OPEN_PATHS = new Set(["/admin/login"]);

export function proxy(request: NextRequest) {
  if (PREVIEW_BOT.test(request.headers.get("user-agent") ?? "")) {
    return new NextResponse(null, {
      status: 403,
      // Don't let a CDN serve this empty answer to anyone else.
      headers: { "Cache-Control": "private, no-store", Vary: "User-Agent" },
    });
  }

  const { pathname } = request.nextUrl;
  if (pathname !== "/admin" && !pathname.startsWith("/admin/")) return NextResponse.next();

  if (!ADMIN_OPEN_PATHS.has(pathname) && !looksLikeSessionToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next();
  // Signed-in pages must never be stored by a shared cache or indexed.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Every page and the share image; not build assets or files search engines need.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
