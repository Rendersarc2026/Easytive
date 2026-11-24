import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Arrow } from "@/components/icons";
import { Footer } from "@/components/sections/Footer";
import { getPostBySlug, getPublishedSlugs, type PublishedPost } from "@/data/blog";
import { absoluteUrl, excerpt, jsonLd, SITE_NAME, SITE_URL } from "@/lib/site";

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

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const a = await findArticle((await params).slug);
  if (!a) return {};
  const description = a.body[0] ? excerpt(a.body[0]) : undefined;
  const images = a.cover ? [{ url: a.cover, alt: a.coverAlt || a.title }] : undefined;
  return {
    title: a.title,
    description,
    alternates: { canonical: `/journal/${a.slug}` },
    authors: a.author ? [{ name: a.author }] : undefined,
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: a.title,
      description,
      url: `/journal/${a.slug}`,
      publishedTime: a.publishedOn || undefined,
      modifiedTime: a.updatedAt,
      authors: a.author ? [a.author] : undefined,
      section: a.tag || undefined,
      ...(images && { images }),
    },
    twitter: { title: a.title, description, ...(images && { images }) },
  };
}

// A closing "Medically reviewed by …" paragraph typed into the post goes
// below the separator line, like the Review note field.
function splitReview(a: PublishedPost): { body: string[]; reviewNote: string } {
  const last = a.body[a.body.length - 1];
  if (!a.reviewNote && last && /^medically reviewed\b/i.test(last)) return { body: a.body.slice(0, -1), reviewNote: last };
  return { body: a.body, reviewNote: a.reviewNote };
}

// BlogPosting structured data: lets search engines show the headline, date,
// author and photo in results. The breadcrumb (Home › Journal › article)
// replaces the bare URL under the result.
function articleJsonLd(a: PublishedPost) {
  const url = absoluteUrl(`/journal/${a.slug}`);
  // The author's credentials (E-E-A-T for health content): degrees as the
  // name suffix, registration as the description.
  const author = a.author
    ? {
        "@type": "Person",
        name: a.author,
        honorificSuffix: a.authorQualifications.replace(/[,\s]+$/, "") || undefined,
        description: a.authorRegistration || undefined,
      }
    : undefined;
  const reviewed = Boolean(splitReview(a).reviewNote);
  const posting = {
    "@type": "BlogPosting",
    headline: a.title,
    description: a.body[0] ? excerpt(a.body[0]) : undefined,
    url,
    mainEntityOfPage: url,
    image: a.cover ? absoluteUrl(a.cover) : undefined,
    datePublished: a.publishedOn || undefined,
    dateModified: a.updatedAt,
    author,
    articleSection: a.tag || undefined,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: absoluteUrl("/easytive-logo.png") },
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "The Easy Journal", item: absoluteUrl("/journal") },
      { "@type": "ListItem", position: 3, name: a.title },
    ],
  };
  // "Medically reviewed by …": the page was reviewed by the author.
  const page = reviewed && author ? { "@type": "MedicalWebPage", "@id": url, url, name: a.title, reviewedBy: author, lastReviewed: a.publishedOn || undefined } : null;
  return { "@context": "https://schema.org", "@graph": page ? [posting, page, breadcrumb] : [posting, breadcrumb] };
}

export default function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
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

// *word* in the post body renders bold (the admin types it in plain text);
// a paragraph that is all *...* becomes a heading.
function withBold(text: string) {
  return text.split(/\*([^*\n]+)\*/).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

async function Article({ params }: { params: PageProps<"/journal/[slug]">["params"] }) {
  const a = await findArticle((await params).slug);
  if (!a) notFound();

  const { body, reviewNote } = splitReview(a);

  // Last word in italics, like the site's other headings ("you *today*?").
  const cut = a.title.lastIndexOf(" ");
  const lead = cut > 0 ? a.title.slice(0, cut + 1) : "";
  const last = cut > 0 ? a.title.slice(cut + 1) : a.title;

  return (
    <article className="article">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd(a))} />
      <div className="art-l">
        <header className="art-head">
          {a.tag && <span className="label">{a.tag}</span>}
          <h1>
            {keepHyphens(lead)}
            <em>{keepHyphens(last)}</em>
          </h1>
          {(a.subtitle || a.subtitleNote) && (
            <p className="art-sub">
              {a.subtitle && <span>{a.subtitle}</span>}
              {a.subtitleNote && <span className="note">{a.subtitleNote}</span>}
            </p>
          )}
        </header>
        <div className="art-ph">{a.cover && <Image src={a.cover} alt={a.coverAlt} fill preload sizes="(min-width: 900px) 52vw, 100vw" />}</div>
      </div>

      <div className="art-r">
        <div className="art-by">
          <svg className="av" viewBox="0 0 100 100" aria-hidden="true">
            <clipPath id="av-clip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath="url(#av-clip)">
              <circle cx="50" cy="40" r="38" />
              <path d="M0 100V84C0 74 22 68 50 68s50 6 50 16v16z" />
            </g>
          </svg>
          <div>
            <b>{a.author}</b>
            {a.authorQualifications && <span>{a.authorQualifications}</span>}
            {a.authorRegistration && <span>{a.authorRegistration}</span>}
          </div>
        </div>
        <div className="art-body">
          {body.map((p, i) => {
            // A paragraph that is only *text* is a section heading.
            const heading = /^\*([^*\n]+)\*$/.exec(p);
            return heading ? <h2 key={i}>{heading[1]}</h2> : <p key={i}>{withBold(p)}</p>;
          })}
        </div>
        <hr className="art-rule" />
        {reviewNote && <p className="art-review">{reviewNote}</p>}
        <Link className="link art-back" href="/journal">
          All articles <Arrow />
        </Link>
      </div>
    </article>
  );
}
