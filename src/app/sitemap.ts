import type { MetadataRoute } from "next";
import { getSitemapPosts } from "@/data/blog";
import { absoluteUrl } from "@/lib/site";

// /sitemap.xml: the public pages plus every published article. Follows the
// blog cache, so a new post shows up here when the admin saves it.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapPosts();
  const latest = posts.find((p) => p.publishedOn)?.publishedOn ?? undefined;

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.publishedOn ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
