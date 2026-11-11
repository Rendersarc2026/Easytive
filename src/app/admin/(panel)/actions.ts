"use server";

// Blog post mutations for the admin. Each one:
//   1. verifies the session (requireUser),
//   2. re-reads the saved overrides from the database (uncached),
//   3. changes the in-memory object and writes back the sections that changed,
//   4. expires the "site-content" tag so pages show the change immediately.
//
// List rows are addressed by index (a hidden `id` field). A post's cover photo
// changes only when a new file is uploaded (`upload`).

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { defaultArticleDrafts, readOverrides, textToBody, writeOverrides, type Overrides } from "@/data/store";
import { requireUser } from "@/lib/auth";
import { uploadImage, UploadError } from "@/lib/media";
import { hit, limitKey } from "@/lib/rate-limit";

// Hard cap on any single field, so one request can't stuff the database.
const MAX_FIELD = 20_000;

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim().slice(0, MAX_FIELD);
}

function id(fd: FormData): number {
  return Number.parseInt(String(fd.get("id") ?? "-1"), 10);
}

async function save(o: Overrides) {
  await writeOverrides(o);
  updateTag("site-content");
}

/**
 * The uploaded photo's /media path, or "" when no file was sent. A rejected
 * upload sends the editor back to `page` with ?error=upload-<reason>, which
 * the page explains.
 */
async function photoFrom(fd: FormData, page: string, userId: string): Promise<string> {
  const file = fd.get("upload");
  if (file instanceof File && file.size > 0) {
    if (!(await hit(limitKey("upload", userId), 60, 60 * 60)).ok) redirect(`${page}?error=upload-rate`);
    try {
      return await uploadImage(file);
    } catch (err) {
      if (err instanceof UploadError) redirect(`${page}?error=upload-${err.code}`);
      throw err;
    }
  }
  return "";
}

// ---- Blog posts -----------------------------------------------------------------------

export async function addArticle() {
  await requireUser();
  const o = await readOverrides();
  o.articles = [{ photo: "bottle-hand", tag: "", title: "", author: "", date: "", body: [] }, ...(o.articles ?? defaultArticleDrafts())];
  await save(o);
}

export async function saveArticle(fd: FormData) {
  const user = await requireUser();
  const i = id(fd);
  const photo = await photoFrom(fd, "/admin/blog", user.id);
  const o = await readOverrides();
  const list = o.articles ?? defaultArticleDrafts();
  if (i < 0 || i >= list.length) return;
  list[i] = {
    photo: photo || list[i].photo,
    tag: str(fd, "tag"),
    title: str(fd, "title"),
    author: str(fd, "author"),
    date: str(fd, "date"),
    body: textToBody(String(fd.get("body") ?? "").slice(0, 100_000)),
  };
  o.articles = list;
  await save(o);
}

export async function deleteArticle(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.articles ?? defaultArticleDrafts();
  if (i < 0 || i >= list.length) return;
  list.splice(i, 1);
  o.articles = list;
  await save(o);
}
