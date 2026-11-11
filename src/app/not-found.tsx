import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Arrow } from "@/components/icons";
import { Footer } from "@/components/sections/Footer";
import { getPublicPage } from "@/data/blog";

export const metadata: Metadata = { title: "Page not found · Easytive" };

// Shown for any address the site doesn't have, and when a page calls
// notFound() (e.g. a blog post that was deleted). Points back home and
// offers the latest journal posts, so a broken link still leads somewhere.
export default async function NotFound() {
  const { posts } = await getPublicPage(null, 3);
  return (
    <>
      <Header />
      <main className="nf">
        <section className="wrap nf-top" aria-labelledby="nf-title">
          <p className="nf-code">Error 404</p>
          <h1 id="nf-title">We couldn&rsquo;t find that page.</h1>
          <p className="nf-lede">The link may be old, or the address may have a typo. Everything else is right where you left it.</p>
          <div className="nf-ctas">
            <Link className="btn btn-dark" href="/">
              Back to home
            </Link>
            <Link className="btn" href="/blog">
              Read the journal
            </Link>
          </div>
        </section>

        {posts.length > 0 && (
          <section className="journal nf-posts" aria-labelledby="nf-posts-title">
            <div className="wrap">
              <div className="shead">
                <h2 id="nf-posts-title">Latest from the journal</h2>
                <Link className="link" href="/blog">
                  All articles <Arrow />
                </Link>
              </div>
              <div className="posts">
                {posts.map((a) => (
                  <Link className="post" href={`/blog/${a.slug}`} key={a.slug}>
                    <div className="ph">{a.cover && <Image src={a.cover} alt={a.coverAlt} fill sizes="(min-width: 860px) 33vw, 100vw" />}</div>
                    {a.tag && <span className="label">{a.tag}</span>}
                    <h3>{a.title}</h3>
                    <span className="by">{[a.author, a.date].filter(Boolean).join(" · ")}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
