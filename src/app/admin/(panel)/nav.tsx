"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

// Sidebar links with the current section highlighted.
type NavLink = { href: string; label: string };

const contentLinks: NavLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
];

// The links on their own, with no active section when the pathname is unknown.
function NavLinks({ links, label, pathname }: { links: NavLink[]; label: string; pathname?: string }) {
  return (
    <nav aria-label={label}>
      {links.map((l) => {
        const on = pathname !== undefined && (l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href));
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

// The pathname can't be resolved while an unknown dynamic route (the admin
// catch-all, for one) is prerendered, so keep the read behind a boundary: the
// plain links make up the static shell and the highlight streams in after.
function ActiveNavLinks({ links, label }: { links: NavLink[]; label: string }) {
  const pathname = usePathname();
  return <NavLinks links={links} label={label} pathname={pathname} />;
}

export default function AdminNav({ links = contentLinks, label = "Admin" }: { links?: NavLink[]; label?: string }) {
  return (
    <Suspense fallback={<NavLinks links={links} label={label} />}>
      <ActiveNavLinks links={links} label={label} />
    </Suspense>
  );
}
