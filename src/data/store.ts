// Content for the About page.
//
// Defaults live in site.ts. Sections edited in the admin earlier are stored in
// easytive.site_content (one row per section, only active rows are read);
// getSiteData() merges them over the defaults, cached under the "site-content"
// tag. Blog posts are separate: see blog.ts.

import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { isMediaPath } from "@/lib/media-path";
import { aboutCopy, type AboutCopy, doctors as defaultDoctors } from "./site";

/** `photo` is the /media path of an uploaded headshot. */
type Doctor = { name: string; role: string; reviews: string; photo?: string };
/** A board member as the pages get it: the photo checked and resolved. */
export type DoctorCard = { name: string; role: string; reviews: string; image?: { src: string; alt: string } };

// ---- Saved sections ------------------------------------------------------------

type Overrides = { about?: Partial<AboutCopy>; doctors?: Doctor[] };

// The sections read, and the JSON kind each must be stored as. A row in the
// wrong shape is ignored (the default shows), so one bad row can't break a page.
const SHAPES: Record<keyof Overrides, "array" | "object"> = { about: "object", doctors: "array" };

async function readOverrides(): Promise<Overrides> {
  const rows = await db()<{ key: string; value: unknown }[]>`
    select key, value from easytive.site_content where is_active and key = any(${Object.keys(SHAPES)})
  `;
  const o: Record<string, unknown> = {};
  for (const { key, value } of rows) {
    const shape = SHAPES[key as keyof Overrides];
    const ok = shape === "array" ? Array.isArray(value) : typeof value === "object" && value !== null && !Array.isArray(value);
    if (ok) o[key] = value;
    else console.warn(`site_content: ignoring "${key}", stored value has the wrong shape`);
  }
  return o as Overrides;
}

// ---- Public, cached content for pages ---------------------------------------------

export type SiteData = { about: AboutCopy; doctors: DoctorCard[] };

function siteDataOf(o: Overrides): SiteData {
  return {
    about: {
      ...aboutCopy,
      ...(o.about ?? {}),
      story: o.about?.story ?? [...aboutCopy.story],
      principles: o.about?.principles ?? aboutCopy.principles.map((p) => ({ ...p })),
    },
    doctors: (o.doctors ?? defaultDoctors).map((d: Doctor) => ({
      name: d.name,
      role: d.role,
      reviews: d.reviews,
      image: d.photo && isMediaPath(d.photo) ? { src: d.photo, alt: d.name } : undefined,
    })),
  };
}

/** About page content with saved sections applied. Cached; tag "site-content". */
export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-content");
  return siteDataOf(await readOverrides());
}
