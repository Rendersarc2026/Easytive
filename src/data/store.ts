// Site content for the public pages.
//
// All site defaults live in site.ts. Sections saved earlier from the admin
// sit in easytive.site_content (one row per section); getSiteData() merges
// them over the defaults and hands back fully-resolved content, cached under
// the "site-content" tag. (Blog posts are separate: see blog.ts.)

import { cacheLife, cacheTag } from "next/cache";
import type { StaticImageData } from "next/image";
import { db } from "@/lib/db";
import { isMediaPath } from "@/lib/media-path";
import { aboutCopy, heroPhotos as defaultHeroPhotos, type AboutCopy, doctors as defaultDoctors, faq as defaultFaq, heroCopy, press as defaultPress, products as defaultProducts, reviews as defaultReviews, moments as defaultMoments, steps as defaultSteps, announcement as defaultAnnouncement, reviewCount as defaultReviewCount, type Product, type ProductKey } from "./site";

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

export const photoBank: Record<string, { src: StaticImageData; alt: string }> = {
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

/** Image source for a photo reference (bank key or /media path), or null. For admin previews. */
export function photoSrc(ref: string | undefined): StaticImageData | string | null {
  if (!ref) return null;
  if (photoBank[ref]) return photoBank[ref].src;
  return isMediaPath(ref) ? ref : null;
}

// A photo reference is a photo bank key ("bottle-hand") or the /media path of
// an image uploaded in the admin.
export type Photo = { src: StaticImageData | string; alt: string };

function photoOf(ref: string | undefined, fallback: Photo, alt?: string): Photo {
  if (!ref) return fallback;
  const bank = photoBank[ref];
  if (bank) return alt ? { src: bank.src, alt } : bank;
  if (isMediaPath(ref)) return { src: ref, alt: alt ?? fallback.alt };
  return fallback;
}

// ---- Editable shapes --------------------------------------------------------
// *Draft types are what the admin stores (images as string keys).
// *The page-facing getters resolve keys into real images.

export type HeroCopy = {
  lifestyle: { tag: string; line: string };
  proof: { tag: string; line: string; stats: { value: string; label: string }[] };
};

export type Review = { quote: string; name: string; about: string; product: ProductKey };
export type FaqGroups = { group: string; items: { q: string; a: string }[] }[];
export type Doctor = { name: string; role: string; reviews: string; photo?: string };
/** A board member as the pages get it: the photo reference resolved. */
export type DoctorCard = { name: string; role: string; reviews: string; image?: Photo };
export type HeroSlide = "lifestyle" | "proof";
export type HeroPhotoDraft = { photo: string; alt: string; slide: HeroSlide };
export type HeroPhoto = Photo & { slide: HeroSlide; hold: number; pos?: string };
export type { AboutCopy };
export type Moment = { image: Photo; label: string; line: string };
export type Step = { image: Photo; pill: string; title: string; body: string };
export type ProductsMap = Record<ProductKey, Product>;

const PRODUCT_KEYS = Object.keys(defaultProducts) as ProductKey[];

// ---- Overrides in the database ----------------------------------------------

export type Overrides = {
  announcement?: string[];
  hero?: Partial<HeroCopy>;
  products?: Partial<Record<ProductKey, Partial<Product>>>;
  reviews?: { quote: string; name: string; about: string; product: string }[];
  faq?: FaqGroups;
  doctors?: Doctor[];
  moments?: { photo: string; label: string; line: string }[];
  steps?: { photo: string; pill: string; title: string; body: string }[];
  press?: string[];
  reviewCount?: string;
  about?: Partial<AboutCopy>;
  heroPhotos?: HeroPhotoDraft[];
};

// The sections that may be stored: one row each, keyed by these names.
const OVERRIDE_KEYS = ["announcement", "hero", "products", "reviews", "faq", "doctors", "moments", "steps", "press", "reviewCount", "about", "heroPhotos"] as const satisfies readonly (keyof Overrides)[];

type OverrideKey = (typeof OVERRIDE_KEYS)[number];

// The JSON kind each section must be stored as.
const SHAPES: Record<OverrideKey, "array" | "object" | "string"> = {
  announcement: "array",
  hero: "object",
  products: "object",
  reviews: "array",
  faq: "array",
  doctors: "array",
  moments: "array",
  steps: "array",
  press: "array",
  reviewCount: "string",
  about: "object",
  heroPhotos: "array",
};

function hasExpectedShape(key: OverrideKey, value: unknown): boolean {
  const shape = SHAPES[key];
  if (shape === "array") return Array.isArray(value);
  if (shape === "object") return typeof value === "object" && value !== null && !Array.isArray(value);
  return typeof value === "string";
}

async function readOverridesRows(): Promise<Overrides> {
  const rows = await db()<{ key: string; value: unknown }[]>`select key, value from easytive.site_content`;
  const o: Record<string, unknown> = {};
  for (const row of rows) {
    if (!(OVERRIDE_KEYS as readonly string[]).includes(row.key)) continue;
    // A section stored in the wrong shape is ignored (the site default shows),
    // so one bad row can't break every page that reads it.
    if (!hasExpectedShape(row.key as OverrideKey, row.value)) {
      console.warn(`site_content: ignoring "${row.key}", stored value has the wrong shape`);
      continue;
    }
    o[row.key] = row.value;
  }
  return o as Overrides;
}

// ---- Merge helpers (pure) ----------------------------------------------------

export function heroOf(o: Overrides): HeroCopy {
  return {
    lifestyle: { tag: o.hero?.lifestyle?.tag ?? heroCopy.lifestyle.tag, line: o.hero?.lifestyle?.line ?? "Comfort, built into every day." },
    proof: {
      tag: o.hero?.proof?.tag ?? heroCopy.proof.tag,
      line: o.hero?.proof?.line ?? "Clinically studied doses. Tested every batch.",
      stats: o.hero?.proof?.stats ?? heroCopy.proof.stats,
    },
  };
}

export function productsOf(o: Overrides): ProductsMap {
  const out = {} as ProductsMap;
  for (const key of PRODUCT_KEYS) {
    out[key] = { ...(defaultProducts[key] as Product), ...(o.products?.[key] ?? {}) };
  }
  return out;
}

export function aboutOf(o: Overrides): AboutCopy {
  return {
    ...aboutCopy,
    ...(o.about ?? {}),
    story: o.about?.story ?? [...aboutCopy.story],
    principles: o.about?.principles ?? aboutCopy.principles.map((p) => ({ ...p })),
  };
}

// ---- Public, cached content for pages ---------------------------------------

export type SiteData = {
  announcement: string[];
  hero: HeroCopy;
  heroPhotos: HeroPhoto[];
  about: AboutCopy;
  doctors: DoctorCard[];
  products: ProductsMap;
  reviews: Review[];
  faq: FaqGroups;
  moments: Moment[];
  steps: Step[];
  press: string[];
  reviewCount: string;
};

/** Banner photos for the home page. Falls back to the defaults if none are left. */
export function heroPhotosOf(o: Overrides): HeroPhoto[] {
  const list = (o.heroPhotos ?? [])
    .map((p) => ({ ...photoOf(p.photo, { src: "", alt: "" }, p.alt || undefined), slide: p.slide, hold: 5000 }))
    .filter((p) => p.src !== "");
  return list.length > 0 ? list : defaultHeroPhotos.map((p) => ({ ...p }));
}

/** Merge overrides over the defaults into fully-resolved page data. Pure. */
export function siteDataOf(o: Overrides): SiteData {
  return {
    announcement: [...(o.announcement ?? defaultAnnouncement)],
    hero: heroOf(o),
    heroPhotos: heroPhotosOf(o),
    about: aboutOf(o),
    doctors: ((o.doctors ?? defaultDoctors) as Doctor[]).map((d) => {
      const image = photoOf(d.photo, { src: "", alt: "" }, d.name);
      return { name: d.name, role: d.role, reviews: d.reviews, image: image.src ? image : undefined };
    }),
    products: productsOf(o),
    reviews:
      o.reviews?.map((r) => ({ ...r, product: (PRODUCT_KEYS as string[]).includes(r.product) ? (r.product as ProductKey) : "daily" })) ??
      defaultReviews.map((r) => ({ ...r })),
    faq: o.faq ?? defaultFaq.map((g) => ({ group: g.group, items: g.items.map((i) => ({ ...i })) })),
    moments: o.moments
      ? o.moments.map((m, i) => ({
          image: photoOf(m.photo, defaultMoments[i]?.image ?? photoBank["friends-car"]),
          label: m.label,
          line: m.line,
        }))
      : defaultMoments.map((m) => ({ image: m.image, label: m.label, line: m.line })),
    steps: o.steps
      ? o.steps.map((s, i) => ({
          image: photoOf(s.photo, defaultSteps[i]?.image ?? photoBank["hotel-morning"]),
          pill: s.pill,
          title: s.title,
          body: s.body,
        }))
      : defaultSteps.map((s) => ({ image: s.image, pill: s.pill, title: s.title, body: s.body })),
    press: [...(o.press ?? defaultPress)],
    reviewCount: o.reviewCount ?? defaultReviewCount,
  };
}

/**
 * All site content with overrides applied. Cached: public pages query the
 * database at most once per profile window; admin saves call
 * updateTag("site-content") so the next render is fresh immediately.
 */
export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-content");
  return siteDataOf(await readOverridesRows());
}
