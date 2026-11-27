import type { SocialName } from "@/data/site";

export function Arrow() {
  return (
    <svg viewBox="0 0 15 10" aria-hidden="true">
      <path d="M0 5h14M9.5 .5 14 5l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

/** Brand marks for the footer's social links (24×24, currentColor). */
export function SocialIcon({ name }: { name: SocialName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "Instagram" ? (
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
          <circle cx="12" cy="12" r="4.3" />
          <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
        </g>
      ) : (
        <path fill="currentColor" d={socialPaths[name]} />
      )}
    </svg>
  );
}

const socialPaths: Record<Exclude<SocialName, "Instagram">, string> = {
  Facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  X: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

/** Head-and-shoulders placeholder for advisor portraits. */
export function Silhouette() {
  return (
    <svg className="sil" viewBox="0 0 200 220" aria-hidden="true">
      <circle cx="100" cy="72" r="44" fill="currentColor" />
      <path d="M12 220c0-52 40-90 88-90s88 38 88 90z" fill="currentColor" />
    </svg>
  );
}
