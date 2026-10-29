import { press } from "@/data/site";

// Slide 4: press logos directly below the hero. Text wordmarks until real logos exist.
export function PressStrip() {
  const items = [...press, ...press];
  return (
    <section aria-label="As featured in" className="border-y border-line bg-paper py-6">
      <div className="flex items-center gap-8 overflow-hidden">
        <p className="hidden shrink-0 pl-10 text-xs uppercase tracking-[0.18em] text-muted md:block">As featured in</p>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="flex w-max animate-marquee gap-16 pr-16">
            {items.map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= press.length}
                className="whitespace-nowrap font-display text-xl font-semibold text-ink/45 sm:text-2xl"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
