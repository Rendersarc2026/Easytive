"use server";

// Blog post mutations for the admin. Each one verifies the session, writes
// to easytive.blog_posts (src/data/blog.ts), and expires the "blog" cache tag
// so the blog and this admin show the change immediately.
//
// Rows are addressed by their database id (a hidden `id` field). A post's
// cover changes only when a new file is uploaded (`upload`); the image goes
// to the storage bucket. Deleting is a soft delete (is_active = false), and
// no image is ever removed from the bucket, so a post can be restored.

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createDraft, deletePost, hasCover, textToBody, updatePost } from "@/data/blog";
import { requireUser } from "@/lib/auth";
import { mediaKey, uploadImage, UploadError } from "@/lib/media";
import { hit, limitKey } from "@/lib/rate-limit";

const PAGE = "/admin/blog";

function str(fd: FormData, key: string, max: number): string {
  return String(fd.get(key) ?? "").trim().slice(0, max);
}

function postId(fd: FormData): number | null {
  const id = Number(fd.get("id"));
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * The bucket key of a freshly uploaded image, or undefined when no file was
 * sent. A rejected upload sends the editor back with ?error=upload-<reason>,
 * which the page explains.
 */
async function uploadedKey(fd: FormData, userId: string): Promise<string | undefined> {
  const file = fd.get("upload");
  if (!(file instanceof File) || file.size === 0) return undefined;
  if (!(await hit(limitKey("upload", userId), 60, 60 * 60)).ok) redirect(`${PAGE}?error=upload-rate`);
  try {
    return mediaKey(await uploadImage(file)) ?? undefined;
  } catch (err) {
    if (err instanceof UploadError) redirect(`${PAGE}?error=upload-${err.code}`);
    throw err;
  }
}

export async function addArticle() {
  await requireUser();
  await createDraft();
  updateTag("blog");
}

export async function saveArticle(fd: FormData) {
  const user = await requireUser();
  const id = postId(fd);
  if (!id) return;
  const input = {
    title: str(fd, "title", 200),
    tag: str(fd, "tag", 80),
    author: str(fd, "author", 120),
    publishedOn: str(fd, "date", 10),
    body: textToBody(String(fd.get("body") ?? "").slice(0, 100_000)),
  };
  // Same required fields as the form marks (the browser check can be skipped).
  // Checked before any upload, so a rejected save leaves nothing in the bucket.
  const sentFile = fd.get("upload") instanceof File && (fd.get("upload") as File).size > 0;
  const complete = input.title && input.author && /^\d{4}-\d{2}-\d{2}$/.test(input.publishedOn) && input.body.length > 0;
  if (!complete || (!sentFile && !(await hasCover(id)))) redirect(`${PAGE}?error=post-missing`);

  const coverKey = await uploadedKey(fd, user.id);
  await updatePost(id, { ...input, coverKey });
  updateTag("blog");
}

export async function deleteArticle(fd: FormData) {
  await requireUser();
  const id = postId(fd);
  if (!id) return;
  await deletePost(id);
  updateTag("blog");
}
