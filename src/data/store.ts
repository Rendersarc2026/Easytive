// Site content for the public Home and About pages.
//
// All defaults live in site.ts. Sections that were edited in the admin
// earlier are stored in easytive.site_content (one row per section, only
// active rows are read); getSiteData() merges them over the defaults, cached
// under the "site-content" tag. Blog posts are separate: see blog.ts.

import { cacheLife, cacheTag } from "next/cache";
import type { StaticImageData } from "next/image";
import { db } from "@/lib/db";
import { isMediaPath } from "@/lib/media-path";
import { aboutCopy, heroPhotos as defaultHeroPhotos, type AboutCopy, doctors as defaultDoctors, heroCopy } from "./site";

// Brand photo bank: every image the site ships, addressable by key. Saved
// sections store photo *keys*; the getters resolve them back to imports so
// next/image keeps blur placeholders.
import balconyReading from "@/assets/brand/balcony-reading.jpg";
import beachLaugh from "@/assets/brand/beach-laugh.jpg";
import bedJump from "@/assets/brand/bed-jump.jpg";
import bottleHand from "@/assets/brand/bottle-hand.jpg";
import bottlesLight from "@/assets/brand/bottles-light.jpg";
import friendsCar from "@/assets/brand/friends-car.jpg";
import hotelMorning from "@/assets/brand/hotel-morning.jpg";
import iconEmboss from "@/assets/brand/icon-emboss.jpg";
import logoSketch from "@/assets/brand/logo-sketch.jpg";
import sunsetDance from "@/assets/brand/sunset-dance.jpg";
import sunsetRocks from "@/assets/brand/sunset-rocks.jpg";
import windowBlur from "@/assets/brand/window-blur.jpg";

const photoBank: Record<string, { src: StaticImageData; alt: string }> = {
  "balcony-reading": { src: balconyReading, alt: "Someone in a white robe reading on a sunny balcony" },
  "beach-laugh": { src: beachLaugh, alt: "A woman laughing on the beach, framed by a straw hat brim" },
  "bed-jump": { src: bedJump, alt: "A woman leaping onto a hotel bed in warm lamplight" },
  "bottle-hand": { src: bottleHand, alt: "A hand holding a clear Easytive bottle in warm light" },
  "bottles-light": { src: bottlesLight, alt: "Two clear Easytive bottles with brushed metal caps in warm light" },
  "friends-car": { src: friendsCar, alt: "Two women laughing in an open-top car" },
  "hotel-morning": { src: hotelMorning, alt: "A woman in a robe sipping from a mug on the edge of a hotel bed" },
  "icon-emboss": { src: iconEmboss, alt: "The Easytive mark embossed on a dark surface" },
  "logo-sketch": { src: logoSketch, alt: "A pencil construction sketch of the Easytive mark" },
  "sunset-dance": { src: sunsetDance, alt: "A couple dancing on a lakeside deck at sunset" },
  "sunset-rocks": { src: sunsetRocks, alt: "Two friends on sunlit rocks by the sea at golden hour" },
  "window-blur": { src: windowBlur, alt: "A woman by a window overlooking the sea, softly out of focus" },
};

// A photo reference is a photo bank key ("bottle-hand") or the /media path of
// an uploaded image.
export type Photo = { src: StaticImageData | string; alt: string };

function photoOf(ref: string | undefined, fallback: Photo, alt?: string): Photo {
  if (!ref) return fallback;
  const bank = photoBank[ref];
  if (bank) return alt ? { src: bank.src, alt } : bank;
  if (isMediaPath(ref)) return { src: ref, alt: alt ?? fallback.alt };
  return fallback;
}

export type HeroCopy = {
  lifestyle: { tag: string; line: string };
  proof: { tag: string; line: string; stats: { value: string; label: string }[] };
};
type HeroSlide = "lifestyle" | "proof";
export type HeroPhoto = Photo & { slide: HeroSlide; hold: number; pos?: string };
type Doctor = { name: string; role: string; reviews: string; photo?: string };
/** A board member as the pages get it: the photo reference resolved. */
export type DoctorCard = { name: string; role: string; reviews: string; image?: Photo };
export type { AboutCopy };

// ---- Saved sections ------------------------------------------------------------

type Overrides = {
  hero?: Partial<HeroCopy>;
  heroPhotos?: { photo: string; alt: string; slide: HeroSlide }[];
  about?: Partial<AboutCopy>;
  doctors?: Doctor[];
};

// The sections read, and the JSON kind each must be stored as. A row in the
// wrong shape is ignored (the default shows), so one bad row can't break a page.
const SHAPES: Record<keyof Overrides, "array" | "object"> = { hero: "object", heroPhotos: "array", about: "object", doctors: "array" };

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

export type SiteData = { hero: HeroCopy; heroPhotos: HeroPhoto[]; about: AboutCopy; doctors: DoctorCard[] };

function siteDataOf(o: Overrides): SiteData {
  const heroPhotos = (o.heroPhotos ?? [])
    .map((p) => ({ ...photoOf(p.photo, { src: "", alt: "" }, p.alt || undefined), slide: p.slide, hold: 5000 }))
    .filter((p) => p.src !== "");
  return {
    hero: {
      lifestyle: { tag: o.hero?.lifestyle?.tag ?? heroCopy.lifestyle.tag, line: o.hero?.lifestyle?.line ?? "Comfort, built into every day." },
      proof: {
        tag: o.hero?.proof?.tag ?? heroCopy.proof.tag,
        line: o.hero?.proof?.line ?? "Clinically studied doses. Tested every batch.",
        stats: o.hero?.proof?.stats ?? heroCopy.proof.stats,
      },
    },
    // Falls back to the default banner photos if none are left.
    heroPhotos: heroPhotos.length > 0 ? heroPhotos : defaultHeroPhotos.map((p) => ({ ...p })),
    about: {
      ...aboutCopy,
      ...(o.about ?? {}),
      story: o.about?.story ?? [...aboutCopy.story],
      principles: o.about?.principles ?? aboutCopy.principles.map((p) => ({ ...p })),
    },
    doctors: (o.doctors ?? defaultDoctors).map((d: Doctor) => {
      const image = photoOf(d.photo, { src: "", alt: "" }, d.name);
      return { name: d.name, role: d.role, reviews: d.reviews, image: image.src ? image : undefined };
    }),
  };
}

/** Home and About page content with saved sections applied. Cached; tag "site-content". */
export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-content");
  return siteDataOf(await readOverrides());
}
