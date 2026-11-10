"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { drawerNav, nav, type NavItem } from "@/data/site";
import { BagButton } from "./Bag";
import { Logo } from "./Logo";

type Props = {
  /** Nav links; omit to use the full-site shop anchors. */
  items?: NavItem[];
  /** Slim pre-launch header: links + wordmark only (no announcement bar, bag or drawer). */
  slim?: boolean;
  /** Announcement bar lines; required when the non-slim header shows the strip. */
  announcement?: string[];
};

// Announcement bar, then a sticky white bar: links left, logo centre, stories + bag right.
// `slim` renders just the links and the logo, for the pre-launch teaser pages.
export function Header({ items = nav, slim = false, announcement = [] }: Props) {
  const [lined, setLined] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  // "#" links are homepage anchors, so they count as the current page only on "/".
  // Other links also stay lit on their sub-pages (/blog → /blog/<slug>).
  const isActive = (href: string) =>
    href.startsWith("#") ? pathname === "/" : pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  useEffect(() => {
    const onScroll = () => setLined(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Only the full-site drawer locks the page; the slim dropdown must not.
    if (!slim) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      if (!slim) document.body.style.overflow = "";
    };
  }, [open, slim]);

  // Slim header: a click outside the open dropdown closes it.
  useEffect(() => {
    if (!open || !slim) return;
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open, slim]);

  return (
    <>
      {!slim && <div className="ann">{announcement.join("  ·  ")}</div>}
      <header className={`site${lined ? " lined" : ""}`} ref={headerRef}>
        <div className={`wrap hbar${slim ? " slim" : ""}`}>
          <nav aria-label="Primary">
            {items.map((n) =>
              n.href.startsWith("#") ? (
                <a key={n.href} href={n.href} className={isActive(n.href) ? "on" : undefined} aria-current={isActive(n.href) ? "page" : undefined}>
                  {n.label}
                </a>
              ) : (
                <Link key={n.href} href={n.href} className={isActive(n.href) ? "on" : undefined} aria-current={isActive(n.href) ? "page" : undefined}>
                  {n.label}
                </Link>
              ),
            )}
          </nav>
          <button
            className={`menu-btn${slim ? " icon-btn" : ""}`}
            type="button"
            aria-expanded={open}
            aria-controls={slim ? "slim-menu" : "drawer"}
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            {slim ? (
              <>
                <span />
                <span />
                <span />
              </>
            ) : (
              "Menu"
            )}
          </button>
          {slim ? (
            <Link className="logo" href="/">
              <Logo title="Easytive home" />
            </Link>
          ) : (
            <a className="logo" href="#top">
              <Logo title="Easytive home" />
            </a>
          )}
          {!slim && (
            <div className="hright">
              <a href="#moments" className="hide-sm">
                Stories
              </a>
              <BagButton />
            </div>
          )}
        </div>
        {slim && open && (
          <nav className="slim-drop" id="slim-menu" aria-label="Menu">
            {items.map((n) => (
              <Link key={n.href} href={n.href} className={isActive(n.href) ? "on" : undefined} aria-current={isActive(n.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {!slim && open && (
        <div className="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
          {drawerNav.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
