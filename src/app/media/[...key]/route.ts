// Serves uploaded images from the private storage bucket (see src/lib/media.ts).
// Only paths in the exact upload format are looked up, and each object is
// immutable, so browsers and the CDN may keep it for a year.

import { contentTypeOf, getObject, mediaKey } from "@/lib/media";

export async function GET(_req: Request, ctx: RouteContext<"/media/[...key]">): Promise<Response> {
  const { key: parts } = await ctx.params;
  const key = mediaKey(`/media/${parts.join("/")}`);
  if (!key) return new Response("Not found", { status: 404 });

  const res = await getObject(key);
  if (res.status === 404 || res.status === 400) return new Response("Not found", { status: 404 });
  if (!res.ok || !res.body) return new Response("Unavailable", { status: 502 });

  return new Response(res.body, {
    headers: {
      "Content-Type": contentTypeOf(key),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
