import Image from "next/image";
import bedJump from "@/assets/brand/bed-jump.jpg";
import { quickReviews, reviewCount } from "@/data/site";

// Full-bleed photo with a centred two-line statement; the pill header floats on top.
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-[88svh] min-h-[560px] items-end justify-center overflow-hidden bg-ink text-paper sm:min-h-[640px]"
    >
      <Image
        src={bedJump}
        alt="A woman in a white robe leaping joyfully onto a hotel bed"
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[55%_50%]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/45 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

      <div className="relative px-4 pb-16 text-center sm:pb-20 lg:pb-24">
        <h1 className="font-display text-[44px] leading-[1.05] tracking-tight sm:text-6xl lg:text-[76px]">
          Stop counting
          <br />
          <em>washroom breaks.</em>
        </h1>
        <a
          href="#system"
          className="mt-7 inline-flex min-h-11 items-center gap-2.5 text-[11px] uppercase tracking-[0.28em] text-paper/90 transition-opacity hover:opacity-70"
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-paper" />
          See what&rsquo;s inside
        </a>
      </div>
    </section>
  );
}

// Thin strip under the hero: rating on the left, short quotes scrolling past.
export function ReviewTicker() {
  const items = [...quickReviews, ...quickReviews];
  return (
    <section aria-label="Customer reviews" className="border-b border-line bg-paper">
      <div className="flex items-center">
        <a
          href="#reviews"
          className="flex shrink-0 items-center gap-3 py-4 pl-4 pr-6 sm:pl-6 lg:pl-10"
        >
          <span aria-hidden="true" className="text-sm tracking-[0.1em]">
            ★★★★★
          </span>
          <span className="border-b border-ink pb-0.5 text-[10px] uppercase tracking-[0.2em] sm:text-[11px]">
            {reviewCount} reviews
          </span>
        </a>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
          <ul className="flex w-max animate-marquee gap-14 pr-14">
            {items.map((r, i) => (
              <li
                key={`${r.name}-${i}`}
                aria-hidden={i >= quickReviews.length}
                className="whitespace-nowrap py-4 text-[10px] uppercase tracking-[0.2em] sm:text-[11px]"
              >
                &ldquo;{r.quote}&rdquo;
                <span className="ml-3 text-muted">— {r.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
