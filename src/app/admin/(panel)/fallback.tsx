import { MoonLoader } from "react-spinners";

// What an admin page shows the moment its link is clicked, while it checks the
// session and loads its data: a spinner in the middle of the panel. Every page
// folder has a loading.tsx that renders this: the boundary has to belong to the
// page's own segment, because one in the shared panel layout isn't used when
// moving between admin pages.
export default function PageLoading() {
  return (
    <div className="a-loading" role="status" aria-live="polite">
      <MoonLoader color="#22211f" aria-hidden />
      <span className="a-sr">Loading…</span>
    </div>
  );
}
