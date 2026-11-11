"use client";

// List / grid switch for the blog admin. The choice is kept in a cookie
// (blog-view) so the server renders the same layout on the next visit, with
// no jump after the page loads.

import { createContext, use, useState, type ReactNode } from "react";

export type BlogView = "list" | "grid";

const ViewContext = createContext<{ view: BlogView; setView: (v: BlogView) => void }>({ view: "list", setView: () => {} });

export function BlogViewProvider({ initial, children }: { initial: BlogView; children: ReactNode }) {
  const [view, set] = useState<BlogView>(initial);
  const setView = (v: BlogView) => {
    set(v);
    document.cookie = `blog-view=${v}; path=/admin; max-age=31536000; samesite=strict`;
  };
  return <ViewContext value={{ view, setView }}>{children}</ViewContext>;
}

export function PostList({ children }: { children: ReactNode }) {
  const { view } = use(ViewContext);
  return (
    <div className="bp-list" data-view={view}>
      {children}
    </div>
  );
}

const icon = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export function ViewToggle() {
  const { view, setView } = use(ViewContext);
  return (
    <div className="bp-views" role="group" aria-label="Layout">
      <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} title="List">
        <svg {...icon}>
          <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
        <span className="a-sr">List</span>
      </button>
      <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")} title="Grid">
        <svg {...icon}>
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
        </svg>
        <span className="a-sr">Grid</span>
      </button>
    </div>
  );
}
