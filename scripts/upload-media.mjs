// Put files into the storage bucket from the command line and print their
// /media paths. For files the admin can't take, like the hero videos.
//
//   node scripts/upload-media.mjs path/to/video.mp4 path/to/poster.jpg
//
// Each file gets a fresh random key (uploads/<year>/<uuid>.<ext>), the same
// shape admin uploads use, so the /media route serves it. Needs the S3_*
// settings from .env. Encode videos for the web first (muted, H.264, faststart).

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AwsClient } from "aws4fetch";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(path.join(root, file));
  } catch {
    // file absent: fine, the variables may already be in the environment
  }
}

const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", mp4: "video/mp4" };

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/upload-media.mjs <file> [file...]");
  process.exit(1);
}

const { S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;
if (!S3_ENDPOINT || !S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET) {
  console.error("S3_* storage settings are missing from .env.");
  process.exit(1);
}
const client = new AwsClient({ accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY, region: S3_REGION, service: "s3" });

for (const file of files) {
  const ext = path.extname(file).slice(1).toLowerCase().replace("jpeg", "jpg");
  const type = TYPES[ext];
  if (!type) {
    console.error(`${file}: only ${Object.keys(TYPES).join(", ")} files are served`);
    process.exitCode = 1;
    continue;
  }
  const key = `uploads/${new Date().getUTCFullYear()}/${randomUUID()}.${ext}`;
  const res = await client.fetch(`${S3_ENDPOINT.replace(/\/$/, "")}/${S3_BUCKET}/${key}`, {
    method: "PUT",
    body: await readFile(file),
    headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
  if (!res.ok) {
    console.error(`${file}: upload failed (${res.status}) ${(await res.text()).slice(0, 300)}`);
    process.exitCode = 1;
    continue;
  }
  console.log(`${file} → /media/${key}`);
}
