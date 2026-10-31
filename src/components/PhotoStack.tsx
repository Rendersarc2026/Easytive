import Image from "next/image";
import type { BannerPhoto } from "@/data/site";

// Stacked banner photos; only the active one is visible and the rest fade out.
// Only the active photo is announced to screen readers.
export function PhotoStack({ photos, active, sizes, preloadFirst }: { photos: BannerPhoto[]; active: number; sizes: string; preloadFirst?: boolean }) {
  return photos.map((p, i) => (
    <div key={i} className={`bph${i === active ? " on" : ""}`} aria-hidden={i !== active}>
      <Image
        src={p.src}
        alt={p.alt}
        fill
        placeholder="blur"
        preload={preloadFirst && i === 0}
        sizes={sizes}
        style={{ objectPosition: p.pos ?? "50% 40%" }}
      />
    </div>
  ));
}
