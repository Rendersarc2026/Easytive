import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

// Shown for any address the site doesn't have, and when a page calls
// notFound() (e.g. a blog post that was deleted). Just the 404 and a way home.
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="nf" aria-labelledby="nf-title">
        <h1 id="nf-title">404</h1>
        <p>This page doesn&rsquo;t exist.</p>
        <Link className="btn btn-dark" href="/">
          Back to home
        </Link>
      </main>
    </>
  );
}
