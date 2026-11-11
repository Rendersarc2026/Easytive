"use server";

import { getAdminPage, isCursor, PAGE_SIZE } from "@/data/blog";
import { requireUser } from "@/lib/auth";
import type { MorePage } from "@/components/InfiniteMore";
import { PostRow } from "./post-row";

/** Next page of the admin post list, as rendered rows (infinite scroll). */
export async function loadMoreAdminPostsAction(cursor: string, limit: number = PAGE_SIZE): Promise<MorePage> {
  await requireUser();
  if (!isCursor(cursor)) return { items: null, next: null };
  const page = await getAdminPage(cursor, limit);
  return { items: page.posts.map((p) => <PostRow key={p.id} post={p} />), next: page.next };
}
