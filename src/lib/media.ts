// Image uploads, stored in the Supabase Storage bucket over its S3 API.
//
// The bucket is private. Uploaded images are served by this site at
// /media/<key> (src/app/media/[...key]/route.ts), which fetches them from the
// bucket with the same credentials. Keys are random and objects are never
// overwritten, so those responses can be cached forever.
//
// Blog posts store the object key ("uploads/2026/<uuid>.jpg"); pages show it
// at /media/<key>.

import { randomUUID } from "node:crypto";
import { AwsClient } from "aws4fetch";
export { mediaKey } from "./media-path";

/** Largest accepted upload. Vercel rejects request bodies over 4.5 MB. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
} as const;
type Ext = keyof typeof TYPES;

export function contentTypeOf(key: string): string {
  return TYPES[key.slice(key.lastIndexOf(".") + 1) as Ext] ?? "application/octet-stream";
}

function config() {
  const { S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;
  if (!S3_ENDPOINT || !S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET) {
    throw new Error("S3_* storage settings are missing. Add them to .env (and to Vercel).");
  }
  const client = new AwsClient({ accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY, region: S3_REGION, service: "s3" });
  const objectUrl = (key: string) => `${S3_ENDPOINT.replace(/\/$/, "")}/${S3_BUCKET}/${key}`;
  return { client, objectUrl };
}

/** What the file really is, from its first bytes (the browser's type is not trusted). */
function sniff(head: Uint8Array): Ext | null {
  const at = (i: number, ...bytes: number[]) => bytes.every((b, j) => head[i + j] === b);
  const ascii = (i: number, text: string) => at(i, ...[...text].map((c) => c.charCodeAt(0)));
  if (at(0, 0xff, 0xd8, 0xff)) return "jpg";
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "png";
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "webp";
  if (ascii(4, "ftyp") && (ascii(8, "avif") || ascii(8, "avis"))) return "avif";
  return null;
}

export type UploadProblem = "empty" | "size" | "type" | "store";

/** A rejected upload. `code` goes into the page URL (?error=upload-<code>) so the page can explain it. */
export class UploadError extends Error {
  readonly code: UploadProblem;
  constructor(code: UploadProblem) {
    super(`upload rejected: ${code}`);
    this.code = code;
  }
}

/**
 * Store an uploaded image and return its bucket key. Only JPEG, PNG, WebP
 * and AVIF are accepted, checked from the file's contents, up to 4 MB.
 */
export async function uploadImage(file: File): Promise<string> {
  if (file.size === 0) throw new UploadError("empty");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("size");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniff(bytes.subarray(0, 16));
  if (!ext) throw new UploadError("type");

  const key = `uploads/${new Date().getUTCFullYear()}/${randomUUID()}.${ext}`;
  const { client, objectUrl } = config();
  const res = await client.fetch(objectUrl(key), {
    method: "PUT",
    body: bytes,
    headers: { "Content-Type": TYPES[ext], "Cache-Control": "public, max-age=31536000, immutable" },
  });
  if (!res.ok) {
    console.error("upload failed:", res.status, (await res.text()).slice(0, 300));
    throw new UploadError("store");
  }
  return key;
}

/** Fetch a stored object (for the /media route). */
export async function getObject(key: string): Promise<Response> {
  const { client, objectUrl } = config();
  return client.fetch(objectUrl(key), { method: "GET" });
}

