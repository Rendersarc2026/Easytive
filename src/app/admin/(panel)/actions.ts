"use server";

// Every admin mutation lives here. Each one:
//   1. verifies the session (requireAdmin),
//   2. re-reads overrides.json (uncached, so it sees what's on disk),
//   3. mutates the in-memory object and writes it back in one go,
//   4. expires the "site-content" tag so public pages re-render immediately.
//
// Lists avoid nested <form>s: each row/sub-entity gets its own form with a
// hidden `id` (index). Plain string lists (announcement, press) are edited as
// one textarea, one line per entry.

import { updateTag } from "next/cache";
import {
  defaultArticleDrafts,
  defaultDoctorDrafts,
  defaultFaqDrafts,
  defaultMomentDrafts,
  defaultReviewDrafts,
  defaultStepDrafts,
  readOverrides,
  textToBody,
  writeOverrides,
  type Overrides,
} from "@/data/store";
import { products, heroCopy, type ProductKey } from "@/data/site";
import { requireAdmin } from "@/lib/auth";

const PRODUCT_KEYS = Object.keys(products) as ProductKey[];

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function id(fd: FormData): number {
  return Number.parseInt(String(fd.get("id") ?? "-1"), 10);
}

const VALID = new Set(PRODUCT_KEYS);

// The list each section edits when it has no override saved yet: a clone of
// the site defaults. Mutating it and writing the whole list keeps untouched
// rows intact.

// ---- Products ---------------------------------------------------------------

export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const key = str(fd, "key") as ProductKey;
  if (!VALID.has(key)) return;
  const price = Number.parseInt(str(fd, "price"), 10);
  const badge = str(fd, "badge");
  const patch: NonNullable<Overrides["products"]>[ProductKey] = {
    name: str(fd, "name"),
    desc: str(fd, "desc"),
    price: Number.isFinite(price) && price >= 0 ? price : 0,
    tint: str(fd, "tint"),
    l1: str(fd, "l1"),
    l2: str(fd, "l2"),
    badge: badge ? badge : undefined,
    sachet: fd.get("sachet") === "on" ? true : undefined,
  };
  const o = await readOverrides();
  o.products = { ...(o.products ?? {}), [key]: patch };
  await writeOverrides(o);
  updateTag("site-content");
}

// ---- Hero ---------------------------------------------------------------------

export async function saveHero(fd: FormData) {
  await requireAdmin();
  const o = await readOverrides();
  o.hero = {
    lifestyle: { tag: str(fd, "lifestyleTag"), line: str(fd, "lifestyleLine") },
    proof: {
      tag: str(fd, "proofTag"),
      line: str(fd, "proofLine"),
      stats: o.hero?.proof?.stats ?? heroCopy.proof.stats.map((s) => ({ ...s })),
    },
  };
  await writeOverrides(o);
  updateTag("site-content");
}

export async function addHeroStat() {
  await requireAdmin();
  const o = await readOverrides();
  const stats = o.hero?.proof?.stats ?? heroCopy.proof.stats.map((s) => ({ ...s }));
  o.hero = { ...(o.hero ?? {}), proof: { tag: o.hero?.proof?.tag ?? "", line: o.hero?.proof?.line ?? "", stats: [...stats, { value: "", label: "" }] } };
  await writeOverrides(o);
  updateTag("site-content");
}

export async function saveHeroStat(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const stats = o.hero?.proof?.stats ?? heroCopy.proof.stats.map((s) => ({ ...s }));
  if (i >= 0 && i < stats.length) {
    stats[i] = { value: str(fd, "value"), label: str(fd, "label") };
    o.hero = { ...(o.hero ?? {}), proof: { tag: o.hero?.proof?.tag ?? "", line: o.hero?.proof?.line ?? "", stats } };
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function deleteHeroStat(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const stats = o.hero?.proof?.stats ?? heroCopy.proof.stats.map((s) => ({ ...s }));
  if (i >= 0 && i < stats.length) {
    stats.splice(i, 1);
    o.hero = { ...(o.hero ?? {}), proof: { tag: o.hero?.proof?.tag ?? "", line: o.hero?.proof?.line ?? "", stats } };
    await writeOverrides(o);
    updateTag("site-content");
  }
}

// ---- One-liner strings ---------------------------------------------------------

export async function saveAnnouncement(fd: FormData) {
  await requireAdmin();
  const o = await readOverrides();
  o.announcement = str(fd, "lines")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  await writeOverrides(o);
  updateTag("site-content");
}

export async function savePress(fd: FormData) {
  await requireAdmin();
  const o = await readOverrides();
  o.press = str(fd, "lines")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  await writeOverrides(o);
  updateTag("site-content");
}

export async function saveReviewCount(fd: FormData) {
  await requireAdmin();
  const o = await readOverrides();
  o.reviewCount = str(fd, "reviewCount");
  await writeOverrides(o);
  updateTag("site-content");
}

// ---- Advisory board ------------------------------------------------------------

export async function addDoctor() {
  await requireAdmin();
  const o = await readOverrides();
  o.doctors = [...(o.doctors ?? defaultDoctorDrafts()), { name: "", role: "", reviews: "" }];
  await writeOverrides(o);
  updateTag("site-content");
}

export async function saveDoctor(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.doctors ?? defaultDoctorDrafts();
  if (i >= 0 && i < list.length) {
    list[i] = { name: str(fd, "name"), role: str(fd, "role"), reviews: str(fd, "reviews") };
    o.doctors = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function deleteDoctor(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.doctors ?? defaultDoctorDrafts();
  if (i >= 0 && i < list.length) {
    list.splice(i, 1);
    o.doctors = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

// ---- Moments & steps ------------------------------------------------------------

export async function addMoment() {
  await requireAdmin();
  const o = await readOverrides();
  o.moments = [...(o.moments ?? defaultMomentDrafts()), { photo: "", label: "", line: "" }];
  await writeOverrides(o);
  updateTag("site-content");
}

export async function saveMoment(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.moments ?? defaultMomentDrafts();
  if (i >= 0 && i < list.length) {
    list[i] = { photo: str(fd, "photo"), label: str(fd, "label"), line: str(fd, "line") };
    o.moments = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function deleteMoment(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.moments ?? defaultMomentDrafts();
  if (i >= 0 && i < list.length) {
    list.splice(i, 1);
    o.moments = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function addStep() {
  await requireAdmin();
  const o = await readOverrides();
  o.steps = [...(o.steps ?? defaultStepDrafts()), { photo: "", pill: "", title: "", body: "" }];
  await writeOverrides(o);
  updateTag("site-content");
}

export async function saveStep(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.steps ?? defaultStepDrafts();
  if (i >= 0 && i < list.length) {
    list[i] = { photo: str(fd, "photo"), pill: str(fd, "pill"), title: str(fd, "title"), body: str(fd, "body") };
    o.steps = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function deleteStep(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.steps ?? defaultStepDrafts();
  if (i >= 0 && i < list.length) {
    list.splice(i, 1);
    o.steps = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

// ---- Journal articles ------------------------------------------------------------

export async function addArticle() {
  await requireAdmin();
  const o = await readOverrides();
  o.articles = [...(o.articles ?? defaultArticleDrafts()), { photo: "", tag: "", title: "", author: "", date: "", body: [] }];
  await writeOverrides(o);
  updateTag("site-content");
}

export async function saveArticle(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.articles ?? defaultArticleDrafts();
  if (i >= 0 && i < list.length) {
    list[i] = {
      photo: str(fd, "photo"),
      tag: str(fd, "tag"),
      title: str(fd, "title"),
      author: str(fd, "author"),
      date: str(fd, "date"),
      body: textToBody(String(fd.get("body") ?? "")),
    };
    o.articles = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function deleteArticle(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.articles ?? defaultArticleDrafts();
  if (i >= 0 && i < list.length) {
    list.splice(i, 1);
    o.articles = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

// ---- Reviews ----------------------------------------------------------------------

export async function addReview(fd: FormData) {
  await requireAdmin();
  const o = await readOverrides();
  const product = str(fd, "product");
  o.reviews = [
    ...(o.reviews ?? defaultReviewDrafts()),
    {
      quote: str(fd, "quote"),
      name: str(fd, "name"),
      about: str(fd, "about"),
      product: VALID.has(product as ProductKey) ? product : "daily",
    },
  ];
  await writeOverrides(o);
  updateTag("site-content");
}

export async function saveReview(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.reviews ?? defaultReviewDrafts();
  if (i >= 0 && i < list.length) {
    const product = str(fd, "product");
    list[i] = {
      quote: str(fd, "quote"),
      name: str(fd, "name"),
      about: str(fd, "about"),
      product: VALID.has(product as ProductKey) ? product : (list[i].product ?? "daily"),
    };
    o.reviews = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function deleteReview(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.reviews ?? defaultReviewDrafts();
  if (i >= 0 && i < list.length) {
    list.splice(i, 1);
    o.reviews = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

// ---- FAQ -----------------------------------------------------------------------------

export async function addFaqGroup(fd: FormData) {
  await requireAdmin();
  const o = await readOverrides();
  o.faq = [...(o.faq ?? defaultFaqDrafts()), { group: str(fd, "group"), items: [] }];
  await writeOverrides(o);
  updateTag("site-content");
}

export async function saveFaqGroup(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.faq ?? defaultFaqDrafts();
  if (i >= 0 && i < list.length) {
    const qs = fd.getAll("q").map((v) => String(v));
    const as = fd.getAll("a").map((v) => String(v));
    const drops = new Set<string>(fd.getAll("dropItem").map((v) => String(v)));
    const items = qs
      .map((q, k) => ({ q: q.trim(), a: as[k] ?? "" }))
      .filter((it, k) => !drops.has(String(k)) && !(it.q === "" && it.a.trim() === ""));
    list[i] = { group: str(fd, "group"), items };
    o.faq = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function addFaqItem(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.faq ?? defaultFaqDrafts();
  if (i >= 0 && i < list.length) {
    list[i] = { group: list[i].group, items: [...list[i].items, { q: "", a: "" }] };
    o.faq = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}

export async function deleteFaqGroup(fd: FormData) {
  await requireAdmin();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.faq ?? defaultFaqDrafts();
  if (i >= 0 && i < list.length) {
    list.splice(i, 1);
    o.faq = list;
    await writeOverrides(o);
    updateTag("site-content");
  }
}
