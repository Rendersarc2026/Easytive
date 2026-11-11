"use server";

import type { MorePage } from "@/components/InfiniteMore";
import { getPublicPage, isCursor, PAGE_SIZE } from "@/data/blog";
import { PostCard } from "./post-card";

/** Next page of /blog, as rendered cards (infinite scroll). Only published posts; cached like the page. */
export async function loadMorePostsAction(cursor: string, limit: number = PAGE_SIZE): Promise<MorePage> {
  if (!isCursor(cursor)) return { items: null, next: null };
  const page = await getPublicPage(cursor, limit);
  return { items: page.posts.map((p) => <PostCard key={p.slug} post={p} />), next: page.next };
}
