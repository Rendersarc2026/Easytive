import Image from "next/image";
import Link from "next/link";
import type { PublishedPost } from "@/data/blog";

/** A post in the /blog grid. Used for the first page and for each page loaded on scroll. */
export function PostCard({ post: a }: { post: PublishedPost }) {
  return (
    <Link className="post" href={`/blog/${a.slug}`}>
      <div className="ph">{a.cover && <Image src={a.cover} alt={a.coverAlt} fill sizes="(min-width: 860px) 33vw, 100vw" />}</div>
      {a.tag && <span className="label">{a.tag}</span>}
      <h2>{a.title}</h2>
      <span className="by">{[a.author, a.date].filter(Boolean).join(" · ")}</span>
    </Link>
  );
}
