// The site's public address, for canonical links, the sitemap and share cards.
// SITE_URL wins (set it once the custom domain is live, e.g. https://easytive.com);
// otherwise Vercel's production domain; otherwise local dev.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (process.env.SITE_URL ?? (vercel ? `https://${vercel}` : "http://localhost:3000")).replace(/\/+$/, "");

export const SITE_NAME = "Easytive";

export const SITE_DESCRIPTION =
  "Easytive is a science-led health brand committed to expanding the possibilities of everyday life. We bring together global health research and the expertise of doctors and scientists to develop thoughtful care that helps people live beyond the limitations of their health.";

/**
 * Open Graph defaults. A page that sets its own `openGraph` replaces the layout's
 * whole object (Next.js doesn't merge it), so pages spread this and add their `url`.
 */
export const siteOpenGraph = { type: "website", siteName: SITE_NAME } as const;

/** Absolute URL for a site path ("/journal" → "https://…/journal"). */
export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** JSON-LD for a <script type="application/ld+json">; "<" is escaped so text can't close the tag. */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

/** First ~155 characters of some text, cut at a word, for meta descriptions. */
export function excerpt(text: string, max = 155): string {
  const clean = text.replace(/\*([^*\n]+)\*/g, "$1").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : max).replace(/[,;:.\s]+$/, "")}…`;
}
