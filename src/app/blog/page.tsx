import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { getPublishedPosts } from "@/data/blog";
import { prelaunchNav } from "@/data/site";

// Pre-launch blog listing; each card opens its article at /blog/<slug>.
// Posts come from easytive.blog_posts (data/blog); covers from the bucket.
export const metadata: Metadata = {
  description: "Notes on everyday urinary health from the Easytive team and advisory board.",
};

export default async function BlogPage() {
  const articles = await getPublishedPosts();
  return (
    <>
      <Header slim items={prelaunchNav} />
      <main>
        <section className="journal bloglist" aria-labelledby="blog-title">
          <div className="wrap">
            <div className="shead">
              <h1 id="blog-title">
                The Easy <em>Journal</em>
              </h1>
              <div className="r">
                <p>
                  Notes on everyday urinary health — habits, ingredients and movement, guided by our advisory
                  board. First articles land as we get closer to launch.
                </p>
              </div>
            </div>
            <div className="posts">
              {articles.map((a) => (
                <Link className="post" href={`/blog/${a.slug}`} key={a.slug}>
                  <div className="ph">{a.cover && <Image src={a.cover} alt={a.coverAlt} fill sizes="(min-width: 860px) 33vw, 100vw" />}</div>
                  <span className="label">{a.tag}</span>
                  <h2>{a.title}</h2>
                  <span className="by">
                    {[a.author, a.date].filter(Boolean).join(" · ")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
