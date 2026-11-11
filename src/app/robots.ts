import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// /robots.txt: crawl the public site, skip the admin panel and API routes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
