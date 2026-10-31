import Image from "next/image";
import { articles } from "@/data/site";
import { Arrow } from "../icons";

export function Journal() {
  return (
    <section className="journal" id="journal">
      <div className="wrap">
        <div className="shead">
          <h2>
            Questions you <em>didn&rsquo;t want to ask</em>
          </h2>
          <a className="link" href="#journal">
            All articles <Arrow />
          </a>
        </div>
        <div className="posts">
          {articles.map((a) => (
            <a className="post" href="#journal" key={a.title}>
              <div className="ph">
                <Image src={a.image.src} alt={a.image.alt} fill placeholder="blur" sizes="(min-width: 860px) 33vw, 100vw" />
              </div>
              <span className="label">{a.tag}</span>
              <h3>{a.title}</h3>
              <span className="by">
                {a.author} · {a.date}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
