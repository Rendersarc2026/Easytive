import Link from "next/link";

// Not-found page inside the admin frame: an unknown /admin address, or a
// page that calls notFound().
export default function AdminNotFound() {
  return (
    <div className="a-nf">
      <h1>Page not found</h1>
      <p className="a-lede">There&rsquo;s nothing at this address in the admin. It may have been moved or removed.</p>
      <div className="a-actions">
        <Link className="a-btn" href="/admin" prefetch={false}>
          Go to dashboard
        </Link>
        <Link className="a-btn ghost" href="/admin/blog" prefetch={false}>
          Blog posts
        </Link>
      </div>
    </div>
  );
}
