"use server";

// Every content mutation in the admin lives here. Each one:
//   1. verifies the session (requireUser),
//   2. re-reads the saved overrides from the database (uncached),
//   3. changes the in-memory object and writes back the sections that changed,
//   4. expires the "site-content" tag so pages show the change immediately.
//
// List rows are addressed by index (a hidden `id` field). Forms that carry a
// photo accept either an uploaded file (`upload`) or a choice from the photo
// bank (`photo`); an upload wins when both are present.

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { heroCopy } from "@/data/site";
import {
  aboutOf,
  defaultArticleDrafts,
  defaultDoctorDrafts,
  defaultHeroPhotoDrafts,
  photoBank,
  readOverrides,
  textToBody,
  writeOverrides,
  type HeroSlide,
  type Overrides,
} from "@/data/store";
import { requireUser } from "@/lib/auth";
import { isMediaPath, uploadImage, UploadError } from "@/lib/media";
import { hit, limitKey } from "@/lib/rate-limit";

// Hard cap on any single field, so one request can't stuff the database.
const MAX_FIELD = 20_000;

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim().slice(0, MAX_FIELD);
}

function id(fd: FormData): number {
  return Number.parseInt(String(fd.get("id") ?? "-1"), 10);
}

async function save(o: Overrides) {
  await writeOverrides(o);
  updateTag("site-content");
}

/**
 * The photo a form chose: a fresh upload, else a photo bank key or an earlier
 * upload's /media path. A rejected upload sends the editor back to `page`
 * with ?error=upload-<reason>, which the page explains.
 */
async function photoFrom(fd: FormData, page: string, userId: string): Promise<string> {
  const file = fd.get("upload");
  if (file instanceof File && file.size > 0) {
    if (!(await hit(limitKey("upload", userId), 60, 60 * 60)).ok) redirect(`${page}?error=upload-rate`);
    try {
      return await uploadImage(file);
    } catch (err) {
      if (err instanceof UploadError) redirect(`${page}?error=upload-${err.code}`);
      throw err;
    }
  }
  const ref = str(fd, "photo");
  return photoBank[ref] || isMediaPath(ref) ? ref : "";
}

// ---- Home banner: slide text and stats ----------------------------------------

export async function saveHero(fd: FormData) {
  await requireUser();
  const o = await readOverrides();
  o.hero = {
    lifestyle: { tag: str(fd, "lifestyleTag"), line: str(fd, "lifestyleLine") },
    proof: {
      tag: str(fd, "proofTag"),
      line: str(fd, "proofLine"),
      stats: o.hero?.proof?.stats ?? heroCopy.proof.stats.map((s) => ({ ...s })),
    },
  };
  await save(o);
}

function statsOf(o: Overrides) {
  return o.hero?.proof?.stats ?? heroCopy.proof.stats.map((s) => ({ ...s }));
}

function withStats(o: Overrides, stats: { value: string; label: string }[]) {
  o.hero = { ...(o.hero ?? {}), proof: { tag: o.hero?.proof?.tag ?? heroCopy.proof.tag, line: o.hero?.proof?.line ?? "", stats } };
}

export async function addHeroStat() {
  await requireUser();
  const o = await readOverrides();
  withStats(o, [...statsOf(o), { value: "", label: "" }]);
  await save(o);
}

export async function saveHeroStat(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const o = await readOverrides();
  const stats = statsOf(o);
  if (i < 0 || i >= stats.length) return;
  stats[i] = { value: str(fd, "value"), label: str(fd, "label") };
  withStats(o, stats);
  await save(o);
}

export async function deleteHeroStat(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const o = await readOverrides();
  const stats = statsOf(o);
  if (i < 0 || i >= stats.length) return;
  stats.splice(i, 1);
  withStats(o, stats);
  await save(o);
}

// ---- Home banner: photos --------------------------------------------------------

const slideOf = (fd: FormData): HeroSlide => (fd.get("slide") === "proof" ? "proof" : "lifestyle");

export async function addHeroPhoto(fd: FormData) {
  const user = await requireUser();
  const photo = await photoFrom(fd, "/admin/home", user.id);
  if (!photo) redirect("/admin/home?error=photo-missing");
  const o = await readOverrides();
  o.heroPhotos = [...(o.heroPhotos ?? defaultHeroPhotoDrafts()), { photo, alt: str(fd, "alt"), slide: slideOf(fd) }];
  await save(o);
}

export async function saveHeroPhoto(fd: FormData) {
  const user = await requireUser();
  const i = id(fd);
  const photo = await photoFrom(fd, "/admin/home", user.id);
  const o = await readOverrides();
  const list = o.heroPhotos ?? defaultHeroPhotoDrafts();
  if (i < 0 || i >= list.length) return;
  list[i] = { photo: photo || list[i].photo, alt: str(fd, "alt"), slide: slideOf(fd) };
  o.heroPhotos = list;
  await save(o);
}

export async function deleteHeroPhoto(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.heroPhotos ?? defaultHeroPhotoDrafts();
  if (i < 0 || i >= list.length) return;
  if (list.length === 1) redirect("/admin/home?error=photo-last");
  list.splice(i, 1);
  o.heroPhotos = list;
  await save(o);
}

/** Swap a banner photo with its neighbour (`dir` is "up" or "down"). */
export async function moveHeroPhoto(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const j = fd.get("dir") === "up" ? i - 1 : i + 1;
  const o = await readOverrides();
  const list = o.heroPhotos ?? defaultHeroPhotoDrafts();
  if (i < 0 || j < 0 || i >= list.length || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  o.heroPhotos = list;
  await save(o);
}

// ---- About us: text ---------------------------------------------------------------

const ABOUT_TEXT = ["eyebrow", "heading", "intro", "statement", "valuesHeading", "teamHeading", "teamSub"] as const;

/** Saves whichever About fields the form carries; `story` is paragraphs separated by a blank line. */
export async function saveAboutText(fd: FormData) {
  await requireUser();
  const o = await readOverrides();
  const about = aboutOf(o);
  for (const key of ABOUT_TEXT) if (fd.has(key)) about[key] = str(fd, key);
  if (fd.has("story")) about.story = textToBody(String(fd.get("story") ?? "").slice(0, 100_000));
  o.about = about;
  await save(o);
}

// ---- About us: principles ("What guides us") ----------------------------------------

export async function addPrinciple() {
  await requireUser();
  const o = await readOverrides();
  const about = aboutOf(o);
  about.principles = [...about.principles, { label: "", title: "", body: "" }];
  o.about = about;
  await save(o);
}

export async function savePrinciple(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const o = await readOverrides();
  const about = aboutOf(o);
  if (i < 0 || i >= about.principles.length) return;
  about.principles[i] = { label: str(fd, "label"), title: str(fd, "title"), body: str(fd, "body") };
  o.about = about;
  await save(o);
}

export async function deletePrinciple(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const o = await readOverrides();
  const about = aboutOf(o);
  if (i < 0 || i >= about.principles.length) return;
  about.principles.splice(i, 1);
  o.about = about;
  await save(o);
}

// ---- About us: scientists -------------------------------------------------------------

export async function addDoctor() {
  await requireUser();
  const o = await readOverrides();
  o.doctors = [...(o.doctors ?? defaultDoctorDrafts()), { name: "", role: "", reviews: "" }];
  await save(o);
}

export async function saveDoctor(fd: FormData) {
  const user = await requireUser();
  const i = id(fd);
  const photo = await photoFrom(fd, "/admin/about", user.id);
  const o = await readOverrides();
  const list = o.doctors ?? defaultDoctorDrafts();
  if (i < 0 || i >= list.length) return;
  list[i] = { name: str(fd, "name"), role: str(fd, "role"), reviews: str(fd, "reviews"), ...(photo ? { photo } : {}) };
  o.doctors = list;
  await save(o);
}

export async function deleteDoctor(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.doctors ?? defaultDoctorDrafts();
  if (i < 0 || i >= list.length) return;
  list.splice(i, 1);
  o.doctors = list;
  await save(o);
}

// ---- Blog posts -----------------------------------------------------------------------

export async function addArticle() {
  await requireUser();
  const o = await readOverrides();
  o.articles = [{ photo: "bottle-hand", tag: "", title: "", author: "", date: "", body: [] }, ...(o.articles ?? defaultArticleDrafts())];
  await save(o);
}

export async function saveArticle(fd: FormData) {
  const user = await requireUser();
  const i = id(fd);
  const photo = await photoFrom(fd, "/admin/blog", user.id);
  const o = await readOverrides();
  const list = o.articles ?? defaultArticleDrafts();
  if (i < 0 || i >= list.length) return;
  list[i] = {
    photo: photo || list[i].photo,
    tag: str(fd, "tag"),
    title: str(fd, "title"),
    author: str(fd, "author"),
    date: str(fd, "date"),
    body: textToBody(String(fd.get("body") ?? "").slice(0, 100_000)),
  };
  o.articles = list;
  await save(o);
}

export async function deleteArticle(fd: FormData) {
  await requireUser();
  const i = id(fd);
  const o = await readOverrides();
  const list = o.articles ?? defaultArticleDrafts();
  if (i < 0 || i >= list.length) return;
  list.splice(i, 1);
  o.articles = list;
  await save(o);
}
