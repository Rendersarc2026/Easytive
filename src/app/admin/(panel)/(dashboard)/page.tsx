import Link from "next/link";
import { getPostCounts, lastBlogEdit } from "@/data/blog";
import { requireUser } from "@/lib/auth";

// Dashboard: the blog tile (what's in it, when it was last changed, a link to
// the public page) plus the signed-in account.

const when = (d: Date) => d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";

export default async function DashboardPage() {
  const user = await requireUser();
  const [counts, blogEdit] = await Promise.all([getPostCounts(), lastBlogEdit()]);


  const tiles = [
    {
      href: "/admin/blog",
      title: "Blog",
      stat: `${counts.live} ${counts.live === 1 ? "post" : "posts"}`,
      line: blogEdit ? `Last edited ${when(blogEdit.at)}${blogEdit.email ? ` by ${blogEdit.email}` : ""}` : "No posts yet",
      view: "/blog",
    },
  ];

  return (
    <>
      <div className="a-toplabel">Dashboard</div>
      <h1>Welcome back</h1>
      <p className="a-lede">Add, edit or remove blog posts. Every save goes live on the site straight away; no deploy needed.</p>

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
          <span className="a-tile-hint">Change your password or sign out everywhere</span>
          <span className="a-tile-links">
            <Link className="a-btn small ghost" href="/admin/profile" prefetch={false}>
              Profile
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
