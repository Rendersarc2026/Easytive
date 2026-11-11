"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { prelaunchNav } from "@/data/site";
import { Logo } from "./Logo";

// Pre-launch header: a sticky white bar with the links on the left and the
// wordmark in the middle. On small screens the links fold into a dropdown.
// (The full-site header, with the announcement bar and bag, lives on the
// abin/future-update branch.)
export function Header() {
  const [lined, setLined] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  // Links stay lit on their sub-pages (/blog → /blog/<slug>).
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  useEffect(() => {
    const onScroll = () => setLined(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the dropdown is open, Esc or a click outside closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const link = (n: { href: string; label: string }, onClick?: () => void) => (
    <Link key={n.href} href={n.href} className={isActive(n.href) ? "on" : undefined} aria-current={isActive(n.href) ? "page" : undefined} onClick={onClick}>
      {n.label}
    </Link>
  );

  return (
    <header className={`site${lined ? " lined" : ""}`} ref={headerRef}>
      <div className="wrap hbar slim">
        <nav aria-label="Primary">{prelaunchNav.map((n) => link(n))}</nav>
        <button className="menu-btn icon-btn" type="button" aria-expanded={open} aria-controls="slim-menu" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
        <Link className="logo" href="/">
          <Logo title="Easytive home" />
        </Link>
      </div>
      {open && (
        <nav className="slim-drop" id="slim-menu" aria-label="Menu">
          {prelaunchNav.map((n) => link(n, () => setOpen(false)))}
        </nav>
      )}
    </header>
  );
}
