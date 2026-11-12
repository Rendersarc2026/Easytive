// Serves uploaded images and the hero videos from the private storage bucket
// (see src/lib/media.ts). Only paths in the exact upload format are looked up,
// and each object is immutable, so browsers and the CDN may keep it for a year.
// Range requests are passed through: Safari only plays a video when the server
// answers them with 206 Partial Content.

import { contentTypeOf, getObject, mediaKey } from "@/lib/media";

const PASS_HEADERS = ["Content-Length", "Content-Range", "ETag", "Last-Modified"];

export async function GET(req: Request, ctx: RouteContext<"/media/[...key]">): Promise<Response> {
  const { key: parts } = await ctx.params;
  const key = mediaKey(`/media/${parts.join("/")}`);
  if (!key) return new Response("Not found", { status: 404 });

  const range = req.headers.get("range");
  const res = await getObject(key, range);
  if (res.status === 404 || res.status === 400) return new Response("Not found", { status: 404 });
  if (res.status === 416) {
    return new Response(null, { status: 416, headers: { "Content-Range": res.headers.get("Content-Range") ?? "bytes */*" } });
  }
  if (!res.ok || !res.body) return new Response("Unavailable", { status: 502 });

  const headers = new Headers({
    "Content-Type": contentTypeOf(key),
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
  });
  for (const h of PASS_HEADERS) {
    const v = res.headers.get(h);
    if (v) headers.set(h, v);
  }
  return new Response(res.body, { status: res.status === 206 ? 206 : 200, headers });
}
