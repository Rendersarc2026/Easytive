// Server-side content store for the admin panel.
//
// All site defaults live in site.ts. The admin writes edits to overrides.json
// (git-friendly JSON next to site.ts), and every getter in here merges the
// overrides over the defaults and hands back fully-resolved content.
//
// Public pages call getSiteData() (cached with `use cache`; the tag
// "site-content" lets admin saves update it immediately via updateTag).
// Admin pages call readOverrides() directly (uncached) to prefill their forms.

import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import type { StaticImageData } from "next/image";
import { slugify, doctors as defaultDoctors, faq as defaultFaq, heroCopy, press as defaultPress, products as defaultProducts, reviews as defaultReviews, articles as defaultArticles, moments as defaultMoments, steps as defaultSteps, announcement as defaultAnnouncement, reviewCount as defaultReviewCount, type Product, type ProductKey } from "./site";

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

/** Photo choices for admin <select>s, in a stable order. */
export const photoOptions = Object.entries(photoBank).map(([key, v]) => ({ key, label: v.alt }));

export type Photo = { src: StaticImageData; alt: string };

function photoOf(key: string, fallback: Photo): Photo {
  return photoBank[key] ?? fallback;
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
export type Doctor = { name: string; role: string; reviews: string };
export type Moment = { image: Photo; label: string; line: string };
export type Step = { image: Photo; pill: string; title: string; body: string };
export type ProductsMap = Record<ProductKey, Product>;

const PRODUCT_KEYS = Object.keys(defaultProducts) as ProductKey[];

// ---- Overrides on disk ------------------------------------------------------

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
};

const OVERRIDES_PATH = path.join(process.cwd(), "src", "data", "overrides.json");

async function readOverridesFile(): Promise<Overrides> {
  try {
    return JSON.parse(await fs.readFile(OVERRIDES_PATH, "utf8")) as Overrides;
  } catch {
    return {};
  }
}

/** Uncached read: used by admin pages/actions so they always see what's on disk. */
export async function readOverrides(): Promise<Overrides> {
  return readOverridesFile();
}

/** List edit saver. Call inside admin actions after mutating. */
export async function writeOverrides(o: Overrides): Promise<void> {
  await fs.writeFile(OVERRIDES_PATH, `${JSON.stringify(o, null, 2)}\n`, "utf8");
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
        image: photoOf(a.photo, defaultArticles[i]?.image ?? photoBank["bottle-hand"]),
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
const photoKeyOf = (img: StaticImageData | undefined): string => (img ? (keyBySrc.get(img) ?? "") : "");

// Both shapes an element can be in: an override row (photo key) or a default
// row (imported image). Read whichever side is present.
type WithPhoto<T> = T & { photo?: string; image?: { src: StaticImageData } };

const photoOfRaw = (raw: { photo?: string; image?: { src: StaticImageData } }) => raw.photo ?? photoKeyOf(raw.image?.src);

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
  articles: Article[];
  doctors: Doctor[];
  products: ProductsMap;
  reviews: Review[];
  faq: FaqGroups;
  moments: Moment[];
  steps: Step[];
  press: string[];
  reviewCount: string;
};

/** Merge overrides over the defaults into fully-resolved page data. Pure. */
export function siteDataOf(o: Overrides): SiteData {
  return {
    announcement: [...(o.announcement ?? defaultAnnouncement)],
    hero: heroOf(o),
    articles: articlesOf(o),
    doctors: o.doctors ?? defaultDoctors.map((d) => ({ ...d })),
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
 * All site content with overrides applied. Cached: public pages read the JSON
 * at most once per profile window; admin saves call updateTag("site-content")
 * so the next render is fresh immediately.
 */
export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-content");
  return siteDataOf(await readOverridesFile());
}
