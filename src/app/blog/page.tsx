import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { articles, prelaunchNav } from "@/data/site";

// Pre-launch blog: a listing for now; article pages arrive with the real posts.
export const metadata: Metadata = {
  title: "Blog | Easytive",
  description: "Notes on everyday urinary health from the Easytive team and advisory board.",
};

export default function BlogPage() {
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
                <article className="post" key={a.title}>
                  <div className="ph">
                    <Image src={a.image.src} alt={a.image.alt} fill placeholder="blur" sizes="(min-width: 860px) 33vw, 100vw" />
                  </div>
                  <span className="label">{a.tag}</span>
                  <h2>{a.title}</h2>
                  <span className="by">
                    {a.author} · {a.date}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
