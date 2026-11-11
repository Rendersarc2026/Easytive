"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Sidebar links with the current section highlighted.
type NavLink = { href: string; label: string };

const contentLinks: NavLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/home", label: "Home banner" },
  { href: "/admin/about", label: "About us" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminNav({ links = contentLinks, label = "Admin" }: { links?: NavLink[]; label?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      {links.map((l) => {
        const on = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          // No prefetch: a prefetch that gets cancelled part-way through the
          // session lookup can leave a database connection stuck (and the
          // admin is small, so navigating without it is still quick).
          <Link key={l.href} href={l.href} prefetch={false} className={`a-navlink${on ? " on" : ""}`} aria-current={on ? "page" : undefined}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
