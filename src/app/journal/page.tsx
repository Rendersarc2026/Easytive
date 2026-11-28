import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { InfiniteMore } from "@/components/InfiniteMore";
import { getPublicPage, PAGE_SIZE } from "@/data/blog";
import { siteOpenGraph } from "@/lib/site";
import { loadMorePostsAction } from "./load-more";
import { PostCard } from "./post-card";

// Pre-launch blog listing; each card opens its article at /journal/<slug>.
// Posts come from easytive.blog_posts (data/blog); covers from the bucket.
// The first 9 render here; the rest load 9 at a time as the reader scrolls.
export const metadata: Metadata = {
  title: "The Easy Journal",
  alternates: { canonical: "/journal" },
  openGraph: { ...siteOpenGraph, url: "/journal" },
  description: "Notes on everyday urinary health from the Easytive team and advisory board.",
};

export default async function BlogPage() {
  const page = await getPublicPage(null);
  return (
    <>
      <Header />
      <main>
        <section className="journal bloglist" aria-labelledby="blog-title">
          <div className="wrap">
            <div className="shead">
              <h1 id="blog-title">
                The Easy <em>Journal</em>
              </h1>
              <div className="r">
                <p>
                  Everyday urinary health insights from the Easytive Advisory Board, exploring habits, ingredients and
                  movement.
                </p>
              </div>
            </div>
            <div className="posts">
              {page.posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
              <InfiniteMore next={page.next} loadAction={loadMorePostsAction} pageSize={PAGE_SIZE} label="articles" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
