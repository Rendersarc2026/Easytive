import Link from "next/link";
import { aboutOf, articleDrafts, doctorDrafts, getOverrides, heroPhotoDrafts } from "@/data/store";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

// Dashboard: one tile per section of the admin, with what's in it and when it
// was last changed, plus a link to each public page.

const SECTION_OF: Record<string, string> = {
  hero: "Home banner",
  heroPhotos: "Home banner",
  about: "About us",
  doctors: "About us",
  articles: "Blog",
};

const when = (d: Date) => d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";

export default async function DashboardPage() {
  const user = await requireUser();
  const sql = db();
  const [o, edits, [counts]] = await Promise.all([
    getOverrides(),
    sql<{ key: string; updated_at: Date; email: string | null }[]>`
      select c.key, c.updated_at, u.email
      from easytive.site_content c
      left join easytive.admin_users u on u.id = c.updated_by
    `,
    sql<{ active: number }[]>`select count(*) filter (where is_active)::int as active from easytive.admin_users`,
  ]);

  // Latest change per admin section.
  const last = new Map<string, { at: Date; by: string | null }>();
  for (const e of edits) {
    const section = SECTION_OF[e.key];
    if (!section) continue;
    const prev = last.get(section);
    if (!prev || e.updated_at > prev.at) last.set(section, { at: e.updated_at, by: e.email });
  }
  const lastLine = (section: string) => {
    const l = last.get(section);
    return l ? `Last edited ${when(l.at)}${l.by ? ` by ${l.by}` : ""}` : "Showing the original content";
  };

  const posts = articleDrafts(o);
  const about = aboutOf(o);
  const photos = heroPhotoDrafts(o);
  const people = doctorDrafts(o).length;

  const tiles = [
    { href: "/admin/home", title: "Home banner", stat: `${photos.length} photos`, line: lastLine("Home banner"), view: "/" },
    { href: "/admin/about", title: "About us", stat: `${about.principles.length} principles · ${people} scientists`, line: lastLine("About us"), view: "/about" },
    { href: "/admin/blog", title: "Blog", stat: `${posts.filter((p) => p.title).length} posts`, line: lastLine("Blog"), view: "/blog" },
  ];

  return (
    <>
      <div className="a-toplabel">Dashboard</div>
      <h1>Welcome back</h1>
      <p className="a-lede">Pick a section to edit. Every save goes live on the site straight away; no deploy needed.</p>

      <div className="a-tiles">
        {tiles.map((t) => (
          <div className="a-tile" key={t.href}>
            <span className="a-tile-label">{t.title}</span>
            <span className="a-tile-count small">{t.stat}</span>
            <span className="a-tile-hint">{t.line}</span>
            <span className="a-tile-links">
              <Link className="a-btn small" href={t.href} prefetch={false}>
                Edit
              </Link>
              <a className="a-btn small ghost" href={t.view} target="_blank" rel="noreferrer">
                View page
              </a>
            </span>
          </div>
        ))}
        <div className="a-tile">
          <span className="a-tile-label">Your profile</span>
          <span className="a-tile-count small">{user.email}</span>
          <span className="a-tile-hint">
            {user.role === "admin" ? `Admin · ${counts.active} active ${counts.active === 1 ? "account" : "accounts"}` : "Editor"}
          </span>
          <span className="a-tile-links">
            <Link className="a-btn small ghost" href="/admin/profile" prefetch={false}>
              Profile
            </Link>
            {user.role === "admin" && (
              <Link className="a-btn small ghost" href="/admin/users" prefetch={false}>
                Users
              </Link>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
