"use client";

import { useState } from "react";

// Like + share icons on a reel card. Likes are local only until there is a backend.
export function ReelActions({ caption }: { caption: string }) {
  const [liked, setLiked] = useState(false);

  const share = async () => {
    const url = window.location.href.split("#")[0] + "#reviews";
    try {
      if (navigator.share) await navigator.share({ title: caption, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do.
    }
  };

  return (
    <div className="absolute bottom-2 right-2 z-10 flex text-paper">
      <button
        type="button"
        aria-label={`Like "${caption}"`}
        aria-pressed={liked}
        onClick={() => setLiked((l) => !l)}
        className="grid size-10 place-items-center transition-transform active:scale-90"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label={`Share "${caption}"`}
        onClick={share}
        className="grid size-10 place-items-center transition-transform active:scale-90"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
