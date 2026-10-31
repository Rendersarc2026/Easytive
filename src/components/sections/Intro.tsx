import Image, { type StaticImageData } from "next/image";
import { press, statementImages } from "@/data/site";

export function PressBar() {
  return (
    <section className="pressbar" aria-label="As featured in">
      <div className="wrap">
        <span className="label">As featured in</span>
        <ul>
          {press.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Chip({ src }: { src: StaticImageData }) {
  return (
    <span className="chipimg" aria-hidden="true">
      <Image src={src} alt="" fill sizes="96px" />
    </span>
  );
}

// Centred statement line with small pill-shaped photos set into the text.
export function Statement() {
  return (
    <section className="statement">
      <div className="wrap">
        <span className="label">How it fits in</span>
        <h2>
          Two capsules <Chip src={statementImages.a} /> with breakfast. Then <Chip src={statementImages.b} /> you get on{" "}
          <Chip src={statementImages.c} /> with your day.
        </h2>
      </div>
    </section>
  );
}
