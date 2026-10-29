import Image from "next/image";
import sunsetDance from "@/assets/brand/sunset-dance.jpg";
import { testimonials } from "@/data/site";
import { Carousel } from "../Carousel";
import { Avatar } from "../Illustrations";
import { ArrowRight, buttonStyles, Container, toneBg } from "../ui";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

// Slides 2 + 3 (The Whole Truth): sideways testimonial cards, then "wall of love" CTA.
export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <Container>
        <Carousel
          label="Customer reviews"
          heading={
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">Real people. Real relief.</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1.5 text-sm font-medium text-sage-dark">
                <span aria-hidden="true">♥</span> 12K+ happy customers
              </span>
            </div>
          }
        >
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className={`flex w-[85%] shrink-0 snap-start flex-col justify-between rounded-2xl p-7 sm:w-[46%] lg:w-[calc((100%-48px)/3)] ${toneBg[t.tone]}`}
            >
              <blockquote className="text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-10 flex items-center gap-3">
                <Avatar tone={t.tone} initials={initials(t.name)} />
                <div>
                  <p className="font-display font-medium">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </Carousel>

        <div className="relative mt-20 overflow-hidden rounded-3xl bg-ink text-paper">
          <Image
            src={sunsetDance}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1320px) 1240px, 100vw"
            className="object-cover object-[50%_20%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />
          <div className="relative flex min-h-[420px] flex-col items-center justify-end px-6 pb-12 text-center sm:min-h-[520px]">
            <p className="max-w-md font-display text-2xl font-medium tracking-tight sm:text-4xl">
              Thousands of quiet wins, shared out loud.
            </p>
            <a href="#" className={`${buttonStyles.light} mt-8`}>
              Head to our wall of love <ArrowRight />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
