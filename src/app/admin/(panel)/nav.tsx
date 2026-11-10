"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Sidebar links with the current section highlighted.
type NavLink = { href: string; label: string };

const contentLinks: NavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/faq", label: "FAQ" },
];

export default function AdminNav({ links = contentLinks, label = "Admin" }: { links?: NavLink[]; label?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      {links.map((l) => {
        const on = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={`a-navlink${on ? " on" : ""}`} aria-current={on ? "page" : undefined}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
