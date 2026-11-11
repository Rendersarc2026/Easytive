// What an admin page shows the moment its link is clicked, while it checks the
// session and loads its data. Every page folder has a loading.tsx that renders
// this: the boundary has to belong to the page's own segment, because one in
// the shared panel layout isn't used when moving between admin pages.
export default function PageLoading() {
  return (
    <p className="a-cardhint" role="status">
      Loading…
    </p>
  );
}
