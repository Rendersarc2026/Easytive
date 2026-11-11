import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Board } from "@/components/sections/Board";
import { Footer } from "@/components/sections/Footer";
import { getSiteData } from "@/data/store";
import { prelaunchNav } from "@/data/site";

// About page. Copy follows the "About Easytive" brief (Google Doc), word for word.
export const metadata: Metadata = {
  description:
    "Easytive is a science-led health brand committed to expanding the possibilities of everyday life, bringing together global health research and the expertise of doctors and scientists.",
};

const principles = [
  {
    label: "Research",
    title: "Grounded in science. Informed by the world.",
    body: "We look beyond boundaries to follow the latest clinical research and scientific discoveries. We examine the evidence, understand its relevance and consider the needs of the people and communities we serve.",
  },
  {
    label: "Formulation",
    title: "Thoughtfully developed for real human needs.",
    body: "Human health is complex and individual. We consider the science behind age, genetics, lifestyle and other influencing factors to develop formulations with purpose, precision and individual differences in mind.",
  },
  {
    label: "Advice",
    title: "Expertise behind every decision.",
    body: "Medical knowledge is fundamental to what we do. Doctors and scientists guide our approach, bringing clinical understanding and scientific scrutiny to our formulations and the health information we share.",
  },
];

export default async function AboutPage() {
  const { doctors } = await getSiteData();
  return (
    <>
      <Header slim items={prelaunchNav} />
      <main className="about">
        <section className="about-intro">
          <div className="wrap">
            <span className="label">About Easytive</span>
            <h1>
              Make room for <em>more</em> of life.
            </h1>
            <p>
              Easytive is a science-led health brand committed to expanding the possibilities of everyday life. We bring
              together global health research and the expertise of doctors and scientists to develop thoughtful care that
              helps people live beyond the limitations of their health.
            </p>
          </div>
        </section>

        <section className="note" aria-label="Our story">
          <div className="wrap">
            <p className="l">No one should have to live a smaller life because of their body.</p>
            <div className="r">
              <p>
                Health shapes how we experience the world. Yet, many health concerns quietly influence the choices we make,
                the experiences we avoid and the possibilities we hold back from.
              </p>
              <p>We believe this should not be the way.</p>
              <p>
                Easytive was founded on a simple conviction: better science should lead to better ways of living. We follow
                advances in health research, work alongside doctors and scientists, and translate scientific understanding
                into thoughtful every day care that makes a meaningful difference in people&apos;s lives.
              </p>
              <p>
                We began with urinary health, an essential part of wellbeing that deserves greater understanding, better
                conversations and more considered care.
              </p>
              <p>
                Our ambition goes beyond any one area of health. As science advances, so will our work, continually exploring
                new ways to help people experience life with greater freedom and fewer limitations.
              </p>
            </div>
          </div>
        </section>

        <section className="about-values">
          <div className="wrap">
            <div className="shead">
              <h2>
                What guides <em>us</em>
              </h2>
            </div>
            <div className="posts">
              {principles.map((p) => (
                <article className="post" key={p.label}>
                  <span className="label">{p.label}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Board
          doctors={doctors}
          title={
            <>
              Meet the minds behind the <em>science</em>.
            </>
          }
          sub="Doctors and scientists guide our approach to health, shape our formulations and bring scientific knowledge into everyday care."
          link={{ label: "Read the Easy Journal", href: "/blog" }}
        />
      </main>
      <Footer />
    </>
  );
}
