import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Board } from "@/components/sections/Board";
import { Footer } from "@/components/sections/Footer";
import { prelaunchNav } from "@/data/site";

// Pre-launch About page. Story copy is placeholder; replace before launch.
export const metadata: Metadata = {
  description: "Why Easytive exists: doctor-guided daily urinary care, tested doses and discreet packaging, made in India.",
};

export default function AboutPage() {
  return (
    <>
      <Header slim items={prelaunchNav} />
      <main className="about">
        <section className="about-intro">
          <div className="wrap">
            <span className="label">About Easytive</span>
            <h1>
              Urinary health, made <em>easy</em> to talk about.
            </h1>
            <p>
              Easytive is a doctor-guided line of daily supplements for bladder and urinary comfort — measured
              doses, plain-language labels, plain boxes in the mail, and a reading to go with them.
            </p>
          </div>
        </section>

        <section className="note">
          <div className="wrap">
            <p className="l">There is a shelf for every part of the body — except the one nobody mentions at dinner.</p>
            <div className="r">
              <p>
                Easytive started with a familiar frustration: millions of people quietly plan their days around the
                nearest washroom. The choices they have are sugary juices, vague herbal blends, or silence.
              </p>
              <p>
                So we set the bar differently. Formulas reviewed by our medical advisory board, doses that match the
                published research, every batch checked by an independent lab, and packaging that treats your health
                as yours — not a conversation starter.
              </p>
              <p>We are getting ready to launch in India. Until then, join the Easy Letter and read along.</p>
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
              <article className="post">
                <span className="label">Formulation</span>
                <h3>Doses that match the research</h3>
                <p>
                  When a study showed an effect at 36 mg, the label says 36 mg. No proprietary blends, no sprinkles,
                  every ingredient and amount in plain sight.
                </p>
              </article>
              <article className="post">
                <span className="label">Every batch</span>
                <h3>Tested before it ships</h3>
                <p>
                  An independent lab checks identity, potency, heavy metals and microbes — and you can look up your
                  batch number and read the report yourself.
                </p>
              </article>
              <article className="post">
                <span className="label">Advice</span>
                <h3>Doctors steer, not marketers</h3>
                <p>
                  A board of urologists, gynaecologists and formulation scientists reviews every formula, dose and
                  sentence we publish.
                </p>
              </article>
            </div>
          </div>
        </section>

        <Board link={{ label: "Read the Easy Journal", href: "/blog" }} />
      </main>
      <Footer />
    </>
  );
}
