import Image from "next/image";
import { articles } from "@/data/site";
import { Container, Eyebrow, TextLink, Title } from "../ui";

// Three latest articles with tag, author and date.
export function Journal() {
  return (
    <section id="journal" className="scroll-mt-24 pb-4 pt-20 sm:pt-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Journal</Eyebrow>
            <Title className="mt-4">
              Questions you <em>didn&rsquo;t want to ask</em>
            </Title>
          </div>
          <TextLink href="#">All articles</TextLink>
        </div>
        <ul className="mt-12 grid gap-12 md:grid-cols-3 md:gap-6">
          {articles.map((a) => (
            <li key={a.title}>
              <a href="#" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                  <Image
                    src={a.image}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1600px) 500px, (min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted">{a.tag}</p>
                <h3 className="mt-2 max-w-[24ch] font-display text-2xl leading-snug decoration-1 underline-offset-4 group-hover:underline">
                  {a.title}
                </h3>
                <p className="mt-2 text-[13px] text-muted">
                  {a.author} · {a.date}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
