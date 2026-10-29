import Image from "next/image";
import sunsetDance from "@/assets/brand/sunset-dance.jpg";
import { reels, testimonials } from "@/data/site";
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

        <div className="mt-20">
          <Carousel
            label="Instagram reels"
            heading={
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-sage">As seen on Instagram</p>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center gap-3 font-display text-3xl font-medium tracking-tight hover:text-sage sm:text-4xl"
                >
                  <InstagramIcon className="size-7 sm:size-8" />
                  @easytive
                </a>
              </div>
            }
          >
            {reels.map((r) => (
              <a
                key={r.caption}
                href="#"
                aria-label={`Watch reel by ${r.handle}: ${r.caption}`}
                className="group relative aspect-[9/16] w-[62%] shrink-0 snap-start overflow-hidden rounded-2xl bg-ink text-paper sm:w-[36%] lg:w-[calc((100%-96px)/5)]"
              >
                <Image
                  src={r.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 36vw, 62vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
                <ReelIcon className="absolute right-3 top-3 size-5" />
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/25 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-paper/40"
                >
                  <svg viewBox="0 0 24 24" className="ml-0.5 size-6 fill-current">
                    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
                  </svg>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-sm font-medium">{r.handle}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-paper/85">{r.caption}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-paper/75">
                    <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden="true">
                      <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
                    </svg>
                    {r.views}
                  </p>
                </div>
              </a>
            ))}
          </Carousel>
        </div>

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

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

// Clapperboard-style reel badge.
function ReelIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M3 8.5h18M8.5 3l2.5 5.5M14 3l2.5 5.5" />
      <path d="M10 12v5l4.5-2.5L10 12Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
