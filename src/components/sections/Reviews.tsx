import Image from "next/image";
import sunsetDance from "@/assets/brand/sunset-dance.jpg";
import { reels, type ReelOverlay } from "@/data/site";
import { Carousel } from "../Carousel";
import { ReelActions } from "../ReelActions";
import { ArrowRight, buttonStyles, Container, Eyebrow, Title } from "../ui";

// "Easy, in their words": creator reels with the product each one features.
export function Reels() {
  return (
    <section id="reviews" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <Carousel
          label="Creator reels"
          aside={
            <p className="hidden max-w-[26ch] text-right text-[13px] leading-relaxed text-muted md:block">
              Real routines from people who stopped planning around it. Tap any reel to watch.
            </p>
          }
          heading={
            <>
              <Eyebrow>Creators</Eyebrow>
              <Title className="mt-4">
                Easy, in <em>their</em> words
              </Title>
            </>
          }
        >
          {reels.map((r) => (
            <article key={r.caption} className="w-[62%] shrink-0 snap-start sm:w-[36%] lg:w-[calc((100%-64px)/4.3)] 2xl:w-[calc((100%-80px)/5.3)]">
              <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-ink text-paper">
                <a href="#" aria-label={`Watch reel: ${r.caption}`} className="group absolute inset-0">
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1536px) 280px, (min-width: 1024px) 22vw, (min-width: 640px) 36vw, 62vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
                  <span aria-hidden="true" className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-paper/25 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" className="ml-0.5 size-3.5 fill-current">
                      <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
                    </svg>
                  </span>
                  <Overlay overlay={r.overlay} />
                </a>
                <ReelActions caption={r.caption} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[10px] uppercase tracking-[0.22em] text-muted">{r.creator}</p>
                  <p className="mt-1 truncate text-[13px]">{r.product}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Add ${r.product} to cart`}
                  className="min-h-9 shrink-0 rounded-full border border-ink/40 px-4 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper"
                >
                  Add
                </button>
              </div>
            </article>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}

function Overlay({ overlay }: { overlay: ReelOverlay }) {
  switch (overlay.kind) {
    case "title":
      return (
        <p className="absolute bottom-14 left-4 right-4 text-lg leading-tight sm:text-xl">
          {overlay.lines[0]}
          <br />
          <em className="font-display">{overlay.lines[1]}</em>
        </p>
      );
    case "pill":
      return (
        <span className="absolute left-3 top-3 max-w-[calc(100%-4rem)] rounded-full border border-paper/80 px-3 py-1.5 text-[13px] leading-none">
          {overlay.text}
        </span>
      );
    case "inside":
      return (
        <p className="absolute left-4 right-12 top-4 leading-tight">
          <span className="block text-xs">{overlay.label}</span>
          <span className="block text-xl font-bold">{overlay.value}</span>
          <span className="mt-2 block text-sm font-bold">{overlay.detail}</span>
        </p>
      );
  }
}

// Full-width photo banner pointing to the wall of love.
export function WallOfLove() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-ink text-paper sm:rounded-3xl">
          <Image
            src={sunsetDance}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1600px) 1520px, 100vw"
            className="object-cover object-[50%_30%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/5" />
          <div className="relative flex min-h-[420px] flex-col items-center justify-end px-6 pb-12 text-center sm:min-h-[520px] sm:pb-16">
            <p className="max-w-lg text-balance text-3xl leading-tight tracking-tight sm:text-[40px]">
              Thousands of quiet wins, shared out loud.
            </p>
            <a href="#" className={`${buttonStyles.light} mt-7`}>
              Head to our wall of love <ArrowRight />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
