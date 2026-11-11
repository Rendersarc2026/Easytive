import Link from "next/link";
import { siteDataOf, getOverrides } from "@/data/store";

// Dashboard: what's editable, how much of it, and where the edits land.

export default async function OverviewPage() {
  const data = siteDataOf(await getOverrides());
  const stats = [
    { href: "/admin/content", label: "Site content", value: "Hero · doctors · moments · steps · press" },
    { href: "/admin/products", label: "Products", value: Object.keys(data.products).length },
    { href: "/admin/journal", label: "Journal articles", value: data.articles.length },
    { href: "/admin/reviews", label: "Reviews", value: data.reviews.length },
    {
      href: "/admin/faq",
      label: "FAQ questions",
      value: data.faq.reduce((n, g) => n + g.items.length, 0),
    },
  ];

  return (
    <>
      <div className="a-toplabel">Admin</div>
      <h1>Easytive content panel</h1>
      <p className="a-lede">
        Every save goes to the database and the public pages re-render with the change on their next request — no deploys
        needed. Photos aren&apos;t uploaded; you pick from the brand photo bank the site already ships.
      </p>

      <div className="a-cards">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="a-row" style={{ textDecoration: "none", color: "inherit", textAlign: "inherit" }}>
            <span className="a-rowmain">
              <strong>{s.label}</strong>
              <span className="a-cardhint" style={{ display: "block" }}>
                {s.value}
              </span>
            </span>
            <span aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </>
  );
}
