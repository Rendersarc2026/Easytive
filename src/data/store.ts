// Server-side content store for the admin panel.
//
// All site defaults live in site.ts. The admin writes edits to the database
// (easytive.site_content, one row per section), and every getter in here
// merges those overrides over the defaults and hands back fully-resolved
// content.
//
// Public pages call getSiteData() (cached with `use cache`; the tag
// "site-content" lets admin saves update it immediately via updateTag).
// Admin pages call getOverrides() (same cache and tag) to prefill their forms;
// admin actions call readOverrides() (uncached) before they save.

import { cacheLife, cacheTag } from "next/cache";
import type { StaticImageData } from "next/image";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isMediaPath } from "@/lib/media-path";
import { aboutCopy, heroPhotos as defaultHeroPhotos, type AboutCopy, slugify, doctors as defaultDoctors, faq as defaultFaq, heroCopy, press as defaultPress, products as defaultProducts, reviews as defaultReviews, articles as defaultArticles, moments as defaultMoments, steps as defaultSteps, announcement as defaultAnnouncement, reviewCount as defaultReviewCount, type Product, type ProductKey } from "./site";

// Brand photo bank: every image the site ships, addressable by key. The admin
// stores photo *keys* in overrides; the getters resolve them back to imports
// so next/image keeps blur placeholders and no uploads are needed.
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

/** Photo choices for admin <select>s, in a stable order. */
export const photoOptions = Object.entries(photoBank).map(([key, v]) => ({ key, label: v.alt }));

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

export type Article = { slug: string; image: Photo; tag: string; title: string; author: string; date: string; body: string[] };
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
  articles?: { photo: string; tag: string; title: string; author: string; date: string; body?: string[] }[];
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
const OVERRIDE_KEYS = ["announcement", "hero", "products", "articles", "reviews", "faq", "doctors", "moments", "steps", "press", "reviewCount", "about", "heroPhotos"] as const satisfies readonly (keyof Overrides)[];

type OverrideKey = (typeof OVERRIDE_KEYS)[number];

// The JSON kind each section must be stored as.
const SHAPES: Record<OverrideKey, "array" | "object" | "string"> = {
  announcement: "array",
  hero: "object",
  products: "object",
  articles: "array",
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

// What each section looked like when it was read, so a save only touches the
// sections that actually changed (two people editing different sections at
// the same moment don't overwrite each other).
const loaded = new WeakMap<Overrides, Map<string, string>>();

async function readOverridesRows(): Promise<Overrides> {
  const rows = await db()<{ key: string; value: unknown }[]>`select key, value from easytive.site_content`;
  const o: Record<string, unknown> = {};
  const seen = new Map<string, string>();
  for (const row of rows) {
    if (!(OVERRIDE_KEYS as readonly string[]).includes(row.key)) continue;
    // A section stored in the wrong shape is ignored (the site default shows),
    // so one bad row can't break every page that reads it.
    if (!hasExpectedShape(row.key as OverrideKey, row.value)) {
      console.warn(`site_content: ignoring "${row.key}", stored value has the wrong shape`);
      continue;
    }
    o[row.key] = row.value;
    seen.set(row.key, JSON.stringify(row.value));
  }
  loaded.set(o as Overrides, seen);
  return o as Overrides;
}

/** Uncached read for admin actions: they mutate and save, so they need the live rows. */
export async function readOverrides(): Promise<Overrides> {
  return readOverridesRows();
}

/**
 * Cached read for admin pages (form prefill, counts). Shares the
 * "site-content" tag with getSiteData, and every save calls
 * updateTag("site-content"), so a page right after a save is still fresh.
 * Saves themselves re-read with readOverrides(), so a stale form never
 * overwrites newer data.
 */
export async function getOverrides(): Promise<Overrides> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-content");
  return readOverridesRows();
}

/**
 * Saves the overrides object an admin action just mutated. Checks the session
 * itself, so no code path can write content without a signed-in account.
 */
export async function writeOverrides(o: Overrides): Promise<void> {
  const user = await requireUser();
  const before = loaded.get(o) ?? new Map<string, string>();
  const sql = db();
  await sql.begin(async (tx) => {
    for (const key of OVERRIDE_KEYS) {
      const value = o[key];
      if (value === undefined) {
        if (before.has(key)) await tx`delete from easytive.site_content where key = ${key}`;
        continue;
      }
      if (before.get(key) === JSON.stringify(value)) continue;
      // Pass the value itself: the driver encodes it as JSON once. (A string
      // that was already JSON.stringify'd would be encoded twice and stored
      // as a JSON string instead of a list/object.)
      await tx`
        insert into easytive.site_content (key, value, updated_by)
        values (${key}, ${tx.json(value as Parameters<typeof tx.json>[0])}, ${user.id})
        on conflict (key) do update set value = excluded.value, updated_at = now(), updated_by = excluded.updated_by
      `;
    }
  });
}

// ---- Merge helpers (pure; shared by the public cache and admin forms) -------

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

export function articlesOf(o: Overrides): Article[] {
  const list = o.articles
    ? o.articles.map((a, i) => ({
        image: photoOf(a.photo, defaultArticles[i]?.image ?? photoBank["bottle-hand"], a.title || undefined),
        tag: a.tag,
        title: a.title,
        author: a.author,
        date: a.date,
        body: a.body ?? defaultArticles[i]?.body ?? [],
      }))
    : defaultArticles.map((a) => ({ image: a.image, tag: a.tag, title: a.title, author: a.author, date: a.date, body: [...a.body] }));
  // Slugs come from titles; a repeated title gets -2, -3… so every article keeps its own URL.
  const seen = new Map<string, number>();
  return list.map((a) => {
    const base = slugify(a.title);
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return { ...a, slug: n === 1 ? base : `${base}-${n}` };
  });
}

/** Paragraphs → admin textarea text (blank line between), and back. */
export const bodyToText = (body: string[]) => body.join("\n\n");
export const textToBody = (text: string) =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);

// ---- Admin drafts -----------------------------------------------------------
// Admin forms prefill from these (raw shapes with photo keys), while the
// actions in the panel mutate the same override lists — so the form index and
// the override index always line up.

const keyBySrc = new Map(Object.entries(photoBank).map(([key, v]) => [v.src, key]));
const photoKeyOf = (img: StaticImageData | string | undefined): string =>
  typeof img === "string" ? img : img ? (keyBySrc.get(img) ?? "") : "";

// Both shapes an element can be in: an override row (photo key) or a default
// row (imported image). Read whichever side is present.
type WithPhoto<T> = T & { photo?: string; image?: { src: StaticImageData | string } };

const photoOfRaw = (raw: { photo?: string; image?: { src: StaticImageData | string } }) => raw.photo ?? photoKeyOf(raw.image?.src);

export type ArticleDraft = { photo: string; tag: string; title: string; author: string; date: string; body: string[] };
export type MomentDraft = { photo: string; label: string; line: string };
export type StepDraft = { photo: string; pill: string; title: string; body: string };
export type ReviewDraft = { quote: string; name: string; about: string; product: string };

export function articleDrafts(o: Overrides): ArticleDraft[] {
  return (o.articles ?? defaultArticles).map((raw0) => {
    const a = raw0 as WithPhoto<{ tag: string; title: string; author: string; date: string; body?: string[] }>;
    return { photo: photoOfRaw(a), tag: a.tag, title: a.title, author: a.author, date: a.date, body: a.body ?? [] };
  });
}

export function momentDrafts(o: Overrides): MomentDraft[] {
  return (o.moments ?? defaultMoments).map((raw0) => {
    const m = raw0 as WithPhoto<{ label: string; line: string }>;
    return { photo: photoOfRaw(m), label: m.label, line: m.line };
  });
}

export function stepDrafts(o: Overrides): StepDraft[] {
  return (o.steps ?? defaultSteps).map((raw0) => {
    const s = raw0 as WithPhoto<{ pill: string; title: string; body: string }>;
    return { photo: photoOfRaw(s), pill: s.pill, title: s.title, body: s.body };
  });
}

export function reviewDrafts(o: Overrides): ReviewDraft[] {
  return o.reviews ?? defaultReviews.map((r) => ({ ...r }));
}

export function heroPhotoDrafts(o: Overrides): HeroPhotoDraft[] {
  return o.heroPhotos ?? defaultHeroPhotoDrafts();
}

export function defaultHeroPhotoDrafts(): HeroPhotoDraft[] {
  return defaultHeroPhotos.map((p) => ({ photo: photoKeyOf(typeof p.src === "string" ? undefined : p.src), alt: p.alt, slide: p.slide }));
}

export function aboutOf(o: Overrides): AboutCopy {
  return {
    ...aboutCopy,
    ...(o.about ?? {}),
    story: o.about?.story ?? [...aboutCopy.story],
    principles: o.about?.principles ?? aboutCopy.principles.map((p) => ({ ...p })),
  };
}

export function doctorDrafts(o: Overrides): Doctor[] {
  return o.doctors ?? defaultDoctors.map((d) => ({ ...d }));
}

export function faqDrafts(o: Overrides): FaqGroups {
  return o.faq ?? defaultFaq.map((g) => ({ group: g.group, items: g.items.map((i) => ({ ...i })) }));
}

// Base lists for admin actions: what a section edits when no override exists.
export function defaultArticleDrafts(): ArticleDraft[] {
  return defaultArticles.map((a) => ({ photo: photoKeyOf(a.image.src), tag: a.tag, title: a.title, author: a.author, date: a.date, body: [...a.body] }));
}
export function defaultMomentDrafts(): MomentDraft[] {
  return defaultMoments.map((m) => ({ photo: photoKeyOf(m.image.src), label: m.label, line: m.line }));
}
export function defaultStepDrafts(): StepDraft[] {
  return defaultSteps.map((s) => ({ photo: photoKeyOf(s.image.src), pill: s.pill, title: s.title, body: s.body }));
}
export function defaultReviewDrafts(): ReviewDraft[] {
  return defaultReviews.map((r) => ({ ...r }));
}
export function defaultDoctorDrafts(): Doctor[] {
  return defaultDoctors.map((d) => ({ ...d }));
}
export function defaultFaqDrafts(): FaqGroups {
  return defaultFaq.map((g) => ({ group: g.group, items: g.items.map((i) => ({ ...i })) }));
}

// ---- Public, cached content for pages ---------------------------------------

export type SiteData = {
  announcement: string[];
  hero: HeroCopy;
  heroPhotos: HeroPhoto[];
  about: AboutCopy;
  articles: Article[];
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
    // Untitled posts are drafts: listed in the admin, hidden from readers.
    articles: articlesOf(o).filter((a) => a.title.trim() !== ""),
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
