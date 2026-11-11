import type { Metadata } from "next";
import { ConfirmButton, SubmitButton } from "@/app/admin/buttons";
import { aboutOf, bodyToText, doctorDrafts, getOverrides } from "@/data/store";
import { addDoctor, addPrinciple, deleteDoctor, deletePrinciple, saveAboutText, saveDoctor, savePrinciple } from "../actions";
import { Notice, PhotoField } from "../fields";

export const metadata: Metadata = { title: "About us · Easytive admin" };

const emphasisHint = "Put *stars* around a word to show it in italics.";

// The /about page, section by section, in the order it appears on the site.
export default async function AboutAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const o = await getOverrides();
  const about = aboutOf(o);
  const doctors = doctorDrafts(o);

  return (
    <>
      <div className="a-toplabel">About us</div>
      <h1>About page</h1>
      <p className="a-lede">
        Every section of <a href="/about" target="_blank">/about</a>, top to bottom. Changes appear on the site as soon as you
        save.
      </p>
      <Notice searchParams={searchParams} />

      <div className="a-cards">
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Introduction</h2>
          </div>
          <form action={saveAboutText} className="a-form">
            <div className="a-field">
              <label className="a-label" htmlFor="eyebrow">
                Small label above the heading
              </label>
              <input className="a-input" id="eyebrow" name="eyebrow" defaultValue={about.eyebrow} />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="heading">
                Heading
              </label>
              <input className="a-input" id="heading" name="heading" defaultValue={about.heading} />
              <span className="a-cardhint">{emphasisHint}</span>
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="intro">
                Introduction
              </label>
              <textarea className="a-input area" id="intro" name="intro" defaultValue={about.intro} />
            </div>
            <div className="a-actions">
              <SubmitButton className="a-btn small" pendingLabel="Saving…">
                Save introduction
              </SubmitButton>
            </div>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>Our story</h2>
          </div>
          <form action={saveAboutText} className="a-form">
            <div className="a-field">
              <label className="a-label" htmlFor="statement">
                Statement (left column)
              </label>
              <textarea className="a-input area" id="statement" name="statement" defaultValue={about.statement} />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="story">
                Story (right column)
              </label>
              <textarea className="a-input area tall" id="story" name="story" defaultValue={bodyToText(about.story)} />
              <span className="a-cardhint">Leave a blank line between paragraphs.</span>
            </div>
            <div className="a-actions">
              <SubmitButton className="a-btn small" pendingLabel="Saving…">
                Save story
              </SubmitButton>
            </div>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <div>
              <h2>What guides us</h2>
              <p className="a-cardhint">The section heading, then one card per principle.</p>
            </div>
            <form action={addPrinciple}>
              <SubmitButton className="a-btn small ghost" pendingLabel="Adding…">
                Add principle
              </SubmitButton>
            </form>
          </div>
          <form action={saveAboutText} className="a-form a-inline">
            <div className="a-field" style={{ flex: 1 }}>
              <label className="a-label" htmlFor="valuesHeading">
                Section heading
              </label>
              <input className="a-input" id="valuesHeading" name="valuesHeading" defaultValue={about.valuesHeading} />
            </div>
            <SubmitButton className="a-btn small" pendingLabel="Saving…">
              Save heading
            </SubmitButton>
          </form>
          <div className="a-rows" style={{ marginTop: 14 }}>
            {about.principles.map((p, i) => (
              <div className="a-row" key={i}>
                <form action={savePrinciple} className="a-rowmain a-form">
                  <input type="hidden" name="id" value={i} />
                  <div className="a-grid2">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`pr${i}-label`}>
                        Label
                      </label>
                      <input className="a-input" id={`pr${i}-label`} name="label" defaultValue={p.label} placeholder="Research" />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`pr${i}-title`}>
                        Title
                      </label>
                      <input className="a-input" id={`pr${i}-title`} name="title" defaultValue={p.title} />
                    </div>
                  </div>
                  <div className="a-field">
                    <label className="a-label" htmlFor={`pr${i}-body`}>
                      Text
                    </label>
                    <textarea className="a-input area" id={`pr${i}-body`} name="body" defaultValue={p.body} />
                  </div>
                  <div className="a-actions">
                    <SubmitButton className="a-btn small" pendingLabel="Saving…">
                      Save principle
                    </SubmitButton>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={deletePrinciple}>
                    <input type="hidden" name="id" value={i} />
                    <ConfirmButton title={`Remove "${p.title || "this principle"}"?`} message="It comes off the About page straight away." confirmLabel="Remove" danger>
                      Remove
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <div>
              <h2>Scientists</h2>
              <p className="a-cardhint">The heading and line above the team, then one card per person.</p>
            </div>
            <form action={addDoctor}>
              <SubmitButton className="a-btn small ghost" pendingLabel="Adding…">
                Add person
              </SubmitButton>
            </form>
          </div>
          <form action={saveAboutText} className="a-form">
            <div className="a-grid2">
              <div className="a-field">
                <label className="a-label" htmlFor="teamHeading">
                  Heading
                </label>
                <input className="a-input" id="teamHeading" name="teamHeading" defaultValue={about.teamHeading} />
                <span className="a-cardhint">{emphasisHint}</span>
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="teamSub">
                  Line under the heading
                </label>
                <textarea className="a-input area" id="teamSub" name="teamSub" defaultValue={about.teamSub} />
              </div>
            </div>
            <div className="a-actions">
              <SubmitButton className="a-btn small" pendingLabel="Saving…">
                Save heading
              </SubmitButton>
            </div>
          </form>
          <div className="a-rows" style={{ marginTop: 14 }}>
            {doctors.map((d, i) => (
              <div className="a-row" key={i}>
                <form action={saveDoctor} className="a-rowmain a-form">
                  <input type="hidden" name="id" value={i} />
                  <PhotoField current={d.photo ?? ""} id={`dr${i}`} allowNone label="Portrait" />
                  <div className="a-grid2">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`dr${i}-name`}>
                        Name
                      </label>
                      <input className="a-input" id={`dr${i}-name`} name="name" defaultValue={d.name} placeholder="Dr. Ananya Rao" />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`dr${i}-role`}>
                        Speciality
                      </label>
                      <input className="a-input" id={`dr${i}-role`} name="role" defaultValue={d.role} placeholder="Urology" />
                    </div>
                  </div>
                  <div className="a-field">
                    <label className="a-label" htmlFor={`dr${i}-reviews`}>
                      What they review (shown on hover)
                    </label>
                    <input className="a-input" id={`dr${i}-reviews`} name="reviews" defaultValue={d.reviews} />
                  </div>
                  <div className="a-actions">
                    <SubmitButton className="a-btn small" pendingLabel="Saving…">
                      Save person
                    </SubmitButton>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={deleteDoctor}>
                    <input type="hidden" name="id" value={i} />
                    <ConfirmButton title={`Remove ${d.name || "this person"}?`} message="They come off the About page straight away." confirmLabel="Remove" danger>
                      Remove
                    </ConfirmButton>
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
