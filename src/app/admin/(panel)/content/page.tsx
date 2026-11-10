import type { Metadata } from "next";
import {
  addDoctor,
  addHeroStat,
  addMoment,
  addStep,
  deleteDoctor,
  deleteHeroStat,
  deleteMoment,
  deleteStep,
  saveAnnouncement,
  saveDoctor,
  saveHero,
  saveHeroStat,
  saveMoment,
  savePress,
  saveStep,
} from "../actions";
import { doctorDrafts, heroOf, momentDrafts, photoOptions, readOverrides, siteDataOf, stepDrafts } from "@/data/store";

export const metadata: Metadata = { title: "Site content · Easytive admin" };

// Everything on the site that isn't a product, article, review or FAQ lives
// here. Row lists (stats, doctors, moments, steps) use one form per row with a
// sibling Drop form; plain string lists are one-line-per-entry textareas.
export default async function ContentPage() {
  const o = await readOverrides();
  const data = siteDataOf(o); // merged values for textareas/counters
  const hero = heroOf(o);
  const stats = hero.proof.stats;
  const doctorList = doctorDrafts(o);
  const moments = momentDrafts(o);
  const steps = stepDrafts(o);

  return (
    <>
      <div className="a-toplabel">Site content</div>
      <h1>Homepage content</h1>
      <p className="a-lede">
        The pieces around the products: the announcement strip, hero copy, press mentions, the advisory board, story moments
        and the how-it-works rail. Photos come from the brand bank — pick by key.
      </p>

      {/* ---- Announcement strip & press ---------------------------------- */}
      <div className="a-cards" style={{ marginBottom: 16 }}>
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Announcement strip</h2>
          </div>
          <form action={saveAnnouncement} className="a-form">
            <div className="a-field">
              <label className="a-label" htmlFor="ann">
                One message per line (joined with · in the header)
              </label>
              <textarea className="a-input area" id="ann" name="lines" defaultValue={data.announcement.join("\n")} />
            </div>
            <div className="a-actions">
              <button className="a-btn small" type="submit">
                Save strip
              </button>
            </div>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>Press mentions</h2>
          </div>
          <form action={savePress} className="a-form">
            <div className="a-field">
              <label className="a-label" htmlFor="press">
                One publication per line — leave only real coverage (placeholders before launch)
              </label>
              <textarea className="a-input area" id="press" name="lines" defaultValue={data.press.join("\n")} />
            </div>
            <div className="a-actions">
              <button className="a-btn small" type="submit">
                Save press
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* ---- Hero ---------------------------------------------------------- */}
      <div className="a-cards" style={{ marginBottom: 16 }}>
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Hero copy</h2>
          </div>
          <form action={saveHero} className="a-form">
            <div className="a-grid2">
              <div className="a-field">
                <label className="a-label" htmlFor="lt">
                  Lifestyle tag
                </label>
                <input className="a-input" id="lt" name="lifestyleTag" defaultValue={hero.lifestyle.tag} />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="pt">
                  Proof tag
                </label>
                <input className="a-input" id="pt" name="proofTag" defaultValue={hero.proof.tag} />
              </div>
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="ll">
                Lifestyle headline
              </label>
              <input className="a-input" id="ll" name="lifestyleLine" defaultValue={hero.lifestyle.line} />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="pl">
                Proof headline
              </label>
              <input className="a-input" id="pl" name="proofLine" defaultValue={hero.proof.line} />
            </div>
            <div className="a-actions">
              <button className="a-btn small" type="submit">
                Save hero copy
              </button>
            </div>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>Proof numbers</h2>
            <form action={addHeroStat}>
              <button className="a-btn small ghost" type="submit">
                Add number
              </button>
            </form>
          </div>
          <div className="a-rows">
            {stats.map((s, i) => (
              <div className="a-row" key={i}>
                <form action={saveHeroStat} className="a-rowmain">
                  <input type="hidden" name="id" value={i} />
                  <div className="a-grid3">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`sv-${i}`}>
                        Value (36 mg)
                      </label>
                      <input className="a-input" id={`sv-${i}`} name="value" defaultValue={s.value} required />
                    </div>
                    <span className="a-field" />
                    <div className="a-field">
                      <label className="a-label" htmlFor={`sl-${i}`}>
                        Label
                      </label>
                      <input className="a-input" id={`sl-${i}`} name="label" defaultValue={s.label} required />
                    </div>
                  </div>
                  <div className="a-actions" style={{ marginTop: 12 }}>
                    <button className="a-btn small" type="submit">
                      Save
                    </button>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={deleteHeroStat}>
                    <input type="hidden" name="id" value={i} />
                    <button className="a-btn small subtle" type="submit">
                      Drop
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- Advisory board ---------------------------------------------------- */}
      <div className="a-cards" style={{ marginBottom: 16 }}>
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Advisory board</h2>
            <form action={addDoctor}>
              <button className="a-btn small ghost" type="submit">
                Add doctor
              </button>
            </form>
          </div>
          <div className="a-rows">
            {doctorList.map((d, i) => (
              <div className="a-row" key={i}>
                <form action={saveDoctor} className="a-rowmain">
                  <input type="hidden" name="id" value={i} />
                  <div className="a-grid2">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`dn-${i}`}>
                        Name
                      </label>
                      <input className="a-input" id={`dn-${i}`} name="name" defaultValue={d.name} required />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`dr-${i}`}>
                        Speciality
                      </label>
                      <input className="a-input" id={`dr-${i}`} name="role" defaultValue={d.role} required />
                    </div>
                  </div>
                  <div className="a-field" style={{ marginTop: 10 }}>
                    <label className="a-label" htmlFor={`dv-${i}`}>
                      What they review
                    </label>
                    <input className="a-input" id={`dv-${i}`} name="reviews" defaultValue={d.reviews} />
                  </div>
                  <div className="a-actions" style={{ marginTop: 12 }}>
                    <button className="a-btn small" type="submit">
                      Save
                    </button>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={deleteDoctor}>
                    <input type="hidden" name="id" value={i} />
                    <button className="a-btn small subtle" type="submit">
                      Drop
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="a-card">
          <p className="a-cardhint">
            Board member headshots aren&apos;t wired yet — the public board still renders silhouettes. Names and specialities go
            live immediately.
          </p>
        </section>
      </div>

      {/* ---- Moments ---------------------------------------------------------------- */}
      <div className="a-cards" style={{ marginBottom: 16 }}>
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Story moments</h2>
            <form action={addMoment}>
              <button className="a-btn small ghost" type="submit">
                Add moment
              </button>
            </form>
          </div>
          <div className="a-rows">
            {moments.map((m, i) => (
              <div className="a-row" key={i}>
                <form action={saveMoment} className="a-rowmain">
                  <input type="hidden" name="id" value={i} />
                  <div className="a-grid3">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`mp-${i}`}>
                        Photo
                      </label>
                      <select className="a-input" id={`mp-${i}`} name="photo" defaultValue={m.photo}>
                        {photoOptions.map((p) => (
                          <option key={p.key} value={p.key}>
                            {p.key}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`ml-${i}`}>
                        Label (The road trip)
                      </label>
                      <input className="a-input" id={`ml-${i}`} name="label" defaultValue={m.label} required />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`mm-${i}`}>
                        Line (No pit-stop maths.)
                      </label>
                      <input className="a-input" id={`mm-${i}`} name="line" defaultValue={m.line} required />
                    </div>
                  </div>
                  <div className="a-actions" style={{ marginTop: 12 }}>
                    <button className="a-btn small" type="submit">
                      Save
                    </button>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={deleteMoment}>
                    <input type="hidden" name="id" value={i} />
                    <button className="a-btn small subtle" type="submit">
                      Drop
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- How it works ------------------------------------------------------------ */}
        <section className="a-card">
          <div className="a-cardhead">
            <h2>How-it-works rail</h2>
            <form action={addStep}>
              <button className="a-btn small ghost" type="submit">
                Add step
              </button>
            </form>
          </div>
          <div className="a-rows">
            {steps.map((s, i) => (
              <div className="a-row" key={i}>
                <form action={saveStep} className="a-rowmain">
                  <input type="hidden" name="id" value={i} />
                  <div className="a-grid3">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`sp-${i}`}>
                        Photo
                      </label>
                      <select className="a-input" id={`sp-${i}`} name="photo" defaultValue={s.photo}>
                        {photoOptions.map((p) => (
                          <option key={p.key} value={p.key}>
                            {p.key}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`spp-${i}`}>
                        Pill (Morning · Daily)
                      </label>
                      <input className="a-input" id={`spp-${i}`} name="pill" defaultValue={s.pill} required />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`st-${i}`}>
                        Title
                      </label>
                      <input className="a-input" id={`st-${i}`} name="title" defaultValue={s.title} required />
                    </div>
                  </div>
                  <div className="a-field" style={{ marginTop: 10 }}>
                    <label className="a-label" htmlFor={`sb-${i}`}>
                      Body
                    </label>
                    <textarea className="a-input" id={`sb-${i}`} style={{ minHeight: 64 }} name="body" defaultValue={s.body} />
                  </div>
                  <div className="a-actions" style={{ marginTop: 12 }}>
                    <button className="a-btn small" type="submit">
                      Save
                    </button>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={deleteStep}>
                    <input type="hidden" name="id" value={i} />
                    <button className="a-btn small subtle" type="submit">
                      Drop
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
