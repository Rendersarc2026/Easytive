import type { MetadataRoute } from "next";
import { getSitemapPosts } from "@/data/blog";
import { absoluteUrl } from "@/lib/site";

// /sitemap.xml: the public pages plus every published article. Follows the
// blog cache, so a new post shows up here when the admin saves it. An
// article's lastmod is its last save, so edits get recrawled.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapPosts();
  const latest = posts.reduce<string | undefined>((max, p) => (!max || p.updatedAt > max ? p.updatedAt : max), undefined);

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/journal"), lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
    ...posts.map((p) => ({
      url: absoluteUrl(`/journal/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
