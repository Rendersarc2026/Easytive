import Link from "next/link";
import { siteDataOf, getOverrides } from "@/data/store";

// Dashboard: what's editable, how much of it, and where the edits land.

export default async function OverviewPage() {
  const data = siteDataOf(await getOverrides());
  const faqCount = data.faq.reduce((n, g) => n + g.items.length, 0);
  const stats = [
    { href: "/admin/products", label: "Products", count: Object.keys(data.products).length, hint: "Names, prices and badges" },
    { href: "/admin/journal", label: "Journal articles", count: data.articles.length, hint: "Posts on /blog" },
    { href: "/admin/reviews", label: "Reviews", count: data.reviews.length, hint: "Customer quotes" },
    { href: "/admin/faq", label: "FAQ questions", count: faqCount, hint: `In ${data.faq.length} groups` },
  ];

  return (
    <>
      <div className="a-toplabel">Admin</div>
      <h1>Easytive content panel</h1>
      <p className="a-lede">
        Every save goes to the database and the public pages re-render with the change on their next request — no deploys
        needed. Photos aren&apos;t uploaded; you pick from the brand photo bank the site already ships.
      </p>

      <div className="a-tiles">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="a-tile">
            <span className="a-tile-count">{s.count}</span>
            <span className="a-tile-label">
              {s.label} <span aria-hidden>→</span>
            </span>
            <span className="a-tile-hint">{s.hint}</span>
          </Link>
        ))}
        <Link href="/admin/content" className="a-tile wide">
          <span className="a-tile-label">
            Site content <span aria-hidden>→</span>
          </span>
          <span className="a-tile-hint">Announcement bar, hero, doctors, moments, daily steps and press mentions</span>
        </Link>
      </div>
    </>
  );
}
