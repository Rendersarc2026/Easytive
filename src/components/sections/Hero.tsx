import Image from "next/image";
import bedJump from "@/assets/brand/bed-jump.jpg";
import { ArrowRight, buttonStyles } from "../ui";

// Gunam-style full-bleed banner: photo fills the first screen, header sits on top in white.
export function Hero() {
  return (
    <section
      id="top"
      className="relative -mt-16 flex h-[calc(100svh-2.25rem)] min-h-[560px] items-end overflow-hidden bg-ink text-paper sm:-mt-20 sm:min-h-[640px]"
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
      {/* Darken the top (header legibility) and bottom-left (copy legibility). */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1320px] px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        <p className="text-[11px] uppercase tracking-[0.5em] text-paper/80 sm:text-xs">Easy does it</p>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-[44px] font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-[84px]">
          Feel easy, every day.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/85">
          Gentle, science-backed supplements for bladder and urinary tract comfort.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#shop" className={buttonStyles.light}>
            Shop now <ArrowRight />
          </a>
          <a
            href="#science"
            className="inline-flex items-center justify-center rounded-full border border-paper/70 px-6 py-3 text-sm font-medium transition-colors hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            See the science
          </a>
        </div>
      </div>
    </section>
  );
}
