// What an admin page shows the moment its link is clicked, while it checks the
// session and loads its data: a shimmering outline of a page (label, title,
// intro, one card). Every page folder has a loading.tsx that renders this: the
// boundary has to belong to the page's own segment, because one in the shared
// panel layout isn't used when moving between admin pages.
export default function PageLoading() {
  return (
    <div className="a-skeleton" role="status" aria-live="polite">
      <span className="a-sr">Loading…</span>
      <span className="a-sk a-sk-label" />
      <span className="a-sk a-sk-title" />
      <span className="a-sk a-sk-line" />
      <div className="a-sk-card">
        <span className="a-sk a-sk-heading" />
        <span className="a-sk a-sk-row" />
        <span className="a-sk a-sk-row" />
        <span className="a-sk a-sk-row short" />
      </div>
    </div>
  );
}
