import { articles, learn } from "@/data/site";
import { Carousel } from "../Carousel";
import { ArticleArt } from "../Illustrations";
import { ArrowRight, buttonStyles, Container, Eyebrow, toneBg } from "../ui";

// Slide 1 (The Whole Truth): carousel of learning resources.
export function LearnHub() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Carousel
          label="Learning resources"
          heading={
            <>
              <Eyebrow>Learn</Eyebrow>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Know your body better
              </h2>
            </>
          }
        >
          {learn.map((card, i) => (
            <a
              key={card.title}
              href="#"
              className={`group flex w-[85%] shrink-0 snap-start flex-col rounded-2xl p-7 sm:w-[46%] lg:w-[calc((100%-48px)/3)] ${toneBg[card.tone]}`}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{card.kicker}</p>
              <ArticleArt tone={card.tone} seed={i} className="my-4 h-28 w-full sm:my-6 sm:h-40" />
              <h3 className="font-display text-2xl font-medium">{card.title}</h3>
              <p className="mt-2 flex-1 text-ink-soft">{card.body}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium group-hover:text-sage">
                {card.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}

// Slide 6 (Arrae): journal grid with author, date and tag.
export function Journal() {
  return (
    <section id="journal" className="scroll-mt-20 border-t border-line bg-paper py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Journal</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">From the Easytive journal</h2>
          </div>
          <a href="#" className={buttonStyles.outline}>
            All articles <ArrowRight />
          </a>
        </div>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          {articles.map((a, i) => (
            <li key={a.title}>
              <a href="#" className="group block">
                <div className={`aspect-[16/10] overflow-hidden rounded-2xl ${toneBg[a.tone]}`}>
                  <ArticleArt
                    tone={a.tone}
                    seed={i + 1}
                    className="size-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-5 inline-block rounded-full border border-line px-3 py-1 text-xs">{a.tag}</span>
                <h3 className="mt-3 font-display text-xl font-medium leading-snug group-hover:text-sage">{a.title}</h3>
                <p className="mt-3 text-sm text-muted">
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
