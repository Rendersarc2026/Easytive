"use client";

// Infinite scroll for a list whose first page the server already rendered.
// Sits at the end of the list: when it comes near the screen it asks `load`
// (`loadAction`, a server function) for the next page, which returns the rendered items
// and the cursor after them. Pages are appended until there's no cursor left.
//
// It also shows a "Show more" button, for keyboards and as a fallback, and a
// retry if a page fails to load.
//
// `version` changes when the list's data changes (the admin saves or deletes
// a post). The pages already loaded are then fetched again in one go, so the
// list never shows stale or deleted posts.

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type MorePage = { items: ReactNode; next: string | null };

type Props = {
  /** Cursor after the server-rendered first page; null when there's nothing more. */
  next: string | null;
  /** Server function that renders the page after `cursor`. */
  loadAction: (cursor: string, limit?: number) => Promise<MorePage>;
  pageSize: number;
  version?: string;
  className?: string;
  label?: string;
};

export function InfiniteMore({ next: first, loadAction: load, pageSize, version, className = "more", label = "posts" }: Props) {
  const [pages, setPages] = useState<ReactNode[]>([]);
  const [next, setNext] = useState(first);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const busy = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const seenVersion = useRef(version);
  const loaded = useRef(0); // pages appended so far

  const loadNext = useCallback(async () => {
    if (!next || busy.current) return;
    busy.current = true;
    setState("loading");
    try {
      const page = await load(next);
      setPages((p) => [...p, page.items]);
      setNext(page.next);
      loaded.current += 1;
      setState("idle");
    } catch {
      setState("error");
    } finally {
      busy.current = false;
    }
  }, [load, next]);

  // Load as the end of the list gets close (well before it's on screen).
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !next || state !== "idle") return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && void loadNext(), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loadNext, next, state]);

  // The data changed (and the server re-rendered the first page): fetch the
  // pages that were already loaded again, in one request.
  useEffect(() => {
    if (version === seenVersion.current) return;
    seenVersion.current = version;
    const count = loaded.current;
    busy.current = true;
    const refill: Promise<MorePage | null> = first && count > 0 ? load(first, count * pageSize) : Promise.resolve(null);
    refill
      .then((page) => {
        setPages(page ? [page.items] : []);
        setNext(page ? page.next : first);
        loaded.current = page ? count : 0;
        setState("idle");
      })
      .catch(() => setState("error"))
      .finally(() => {
        busy.current = false;
      });
  }, [version, first, load, pageSize]);

  return (
    <>
      {pages.map((items, i) => (
        <Fragment key={i}>{items}</Fragment>
      ))}
      {next && (
        <div ref={sentinel} className={className}>
          {state === "error" ? (
            <>
              <span>Couldn&rsquo;t load more {label}.</span>
              <button type="button" onClick={() => void loadNext()}>
                Try again
              </button>
            </>
          ) : (
            <button type="button" onClick={() => void loadNext()} disabled={state === "loading"} aria-live="polite">
              {state === "loading" ? (
                <>
                  <span className="more-spin" aria-hidden />
                  Loading {label}…
                </>
              ) : (
                `Show more ${label}`
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
}
