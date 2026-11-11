"use client";

// The admin frame: sidebar + page. On desktop the sidebar is always there.
// On phones it becomes a drawer: a slim top bar with a menu button slides it
// in from the left over a dimmed page. It closes on a tap outside, Esc, the
// close button, or moving to another page.

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

const icon = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", "aria-hidden": true } as const;

export function AdminShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  // Remember which page the menu was opened on: navigating anywhere else
  // closes it, with no effect needed.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    // Move focus into the drawer, and let Esc close it.
    drawer.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        menuButton.current?.focus();
      }
    };
    // Widening the window to desktop size closes the drawer.
    const desktop = window.matchMedia("(min-width: 761px)");
    const onWide = () => desktop.matches && setOpenOn(null);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <div className="a-shell" data-menu={open ? "open" : undefined}>
      <header className="a-topbar">
        <span className="a-topbrand">Easytive</span>
        <button
          ref={menuButton}
          type="button"
          className="a-menubtn"
          aria-expanded={open}
          aria-controls="a-side"
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          <svg {...icon}>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <span className="a-sr">Menu</span>
        </button>
      </header>

      <aside ref={drawer} id="a-side" className="a-side" aria-label="Admin menu">
        <button type="button" className="a-drawerclose" onClick={close}>
          <svg {...icon}>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          <span className="a-sr">Close menu</span>
        </button>
        {sidebar}
      </aside>

      {open && <div className="a-scrim" onClick={close} aria-hidden />}

      <main className="a-main" inert={open}>
        {children}
      </main>
    </div>
  );
}
