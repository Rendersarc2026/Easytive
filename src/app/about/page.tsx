import type { Metadata } from "next";
import { Emphasis } from "@/components/Emphasis";
import { Header } from "@/components/Header";
import { Board } from "@/components/sections/Board";
import { Footer } from "@/components/sections/Footer";
import { getSiteData } from "@/data/store";
import { prelaunchNav } from "@/data/site";

// About page. All copy is editable in the admin (About us); the defaults in
// data/site.ts follow the "About Easytive" brief word for word.
export const metadata: Metadata = {
  description:
    "Easytive is a science-led health brand committed to expanding the possibilities of everyday life, bringing together global health research and the expertise of doctors and scientists.",
};

export default async function AboutPage() {
  const { about, doctors } = await getSiteData();
  return (
    <>
      <Header slim items={prelaunchNav} />
      <main className="about">
        <section className="about-intro">
          <div className="wrap">
            <span className="label">{about.eyebrow}</span>
            <h1>
              <Emphasis text={about.heading} />
            </h1>
            <p>{about.intro}</p>
          </div>
        </section>

        <section className="note" aria-label="Our story">
          <div className="wrap">
            <p className="l">{about.statement}</p>
            <div className="r">
              {about.story.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {about.principles.length > 0 && (
          <section className="about-values">
            <div className="wrap">
              <div className="shead">
                <h2>
                  <Emphasis text={about.valuesHeading} />
                </h2>
              </div>
              <div className="posts">
                {about.principles.map((p, i) => (
                  <article className="post" key={i}>
                    <span className="label">{p.label}</span>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <Board
          doctors={doctors}
          title={<Emphasis text={about.teamHeading} />}
          sub={about.teamSub}
          link={{ label: "Read the Easy Journal", href: "/blog" }}
        />
      </main>
      <Footer />
    </>
  );
}
