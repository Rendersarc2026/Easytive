export function Arrow() {
  return (
    <svg viewBox="0 0 15 10" aria-hidden="true">
      <path d="M0 5h14M9.5 .5 14 5l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

/** Head-and-shoulders placeholder for advisor portraits. */
export function Silhouette() {
  return (
    <svg className="sil" viewBox="0 0 200 220" aria-hidden="true">
      <circle cx="100" cy="72" r="44" fill="currentColor" />
      <path d="M12 220c0-52 40-90 88-90s88 38 88 90z" fill="currentColor" />
    </svg>
  );
}
