import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Arrow, Silhouette } from "@/components/icons";
import { Footer } from "@/components/sections/Footer";
import { getPostBySlug, getPublishedSlugs } from "@/data/blog";

// Article page: grey title block over the photo on the left (pinned on desktop),
// author + body on the right. Stacks title → photo → text on phones.
// The slug is URL data, so the article streams inside <Suspense>; the header,
// footer and an empty grey/photo frame show instantly on navigation.

const findArticle = getPostBySlug;

// Cache Components needs at least one param at build time, even if the admin
// has removed every article (that page then 404s).
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "article" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const a = await findArticle((await params).slug);
  if (!a) return {};
  return { title: `${a.title} · Easytive`, description: a.body[0]?.slice(0, 160) };
}

export default function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<ArticleFrame />}>
          <Article params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

// Same grid as the article, minus the content: holds the layout while it loads.
function ArticleFrame() {
  return (
    <div className="article" aria-busy="true">
      <div className="art-l">
        <div className="art-head" />
        <div className="art-ph" />
      </div>
      <div className="art-r" />
    </div>
  );
}

// Keeps hyphenated words ("D-Mannose") on one line in the big title.
function keepHyphens(text: string) {
  return text.split(/(\S*\w-\w\S*)/).map((part, i) => (i % 2 ? <span className="nowrap" key={i}>{part}</span> : part));
}

async function Article({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const a = await findArticle((await params).slug);
  if (!a) notFound();

  // Last word in italics, like the site's other headings ("you *today*?").
  const cut = a.title.lastIndexOf(" ");
  const lead = cut > 0 ? a.title.slice(0, cut + 1) : "";
  const last = cut > 0 ? a.title.slice(cut + 1) : a.title;

  return (
    <article className="article">
      <div className="art-l">
        <header className="art-head">
          {a.tag && <span className="label">{a.tag}</span>}
          <h1>
            {keepHyphens(lead)}
            <em>{keepHyphens(last)}</em>
          </h1>
        </header>
        <div className="art-ph">{a.cover && <Image src={a.cover} alt={a.coverAlt} fill preload sizes="(min-width: 900px) 52vw, 100vw" />}</div>
      </div>

      <div className="art-r">
        <div className="art-by">
          <span className="av" aria-hidden="true">
            <Silhouette />
          </span>
          <div>
            <b>{a.author}</b>
            <span>{a.date}</span>
          </div>
        </div>
        <div className="art-body">
          {a.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Link className="link art-back" href="/blog">
          All articles <Arrow />
        </Link>
      </div>
    </article>
  );
}
