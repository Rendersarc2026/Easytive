"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { announcement, drawerNav, nav, type NavItem } from "@/data/site";
import { BagButton } from "./Bag";
import { Logo } from "./Logo";

type Props = {
  /** Nav links; omit to use the full-site shop anchors. */
  items?: NavItem[];
  /** Slim pre-launch header: links + wordmark only (no announcement bar, bag or drawer). */
  slim?: boolean;
};

// Announcement bar, then a sticky white bar: links left, logo centre, stories + bag right.
// `slim` renders just the links and the logo, for the pre-launch teaser pages.
export function Header({ items = nav, slim = false }: Props) {
  const [lined, setLined] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // "#" links are homepage anchors, so they count as the current page only on "/".
  const isActive = (href: string) => (href.startsWith("#") ? pathname === "/" : pathname === href);

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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {!slim && <div className="ann">{announcement.join("  ·  ")}</div>}
      <header className={`site${lined ? " lined" : ""}`}>
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
          {!slim && (
            <button className="menu-btn" type="button" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
              Menu
            </button>
          )}
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
