import type { Metadata } from "next";
import { ConfirmButton, SubmitButton } from "@/app/admin/buttons";
import { getOverrides, heroOf, heroPhotoDrafts } from "@/data/store";
import {
  addHeroPhoto,
  addHeroStat,
  deleteHeroPhoto,
  deleteHeroStat,
  moveHeroPhoto,
  saveHero,
  saveHeroPhoto,
  saveHeroStat,
} from "../actions";
import { Notice, PhotoField } from "../fields";

export const metadata: Metadata = { title: "Home banner · Easytive admin" };

// The rotating banner at the top of the home page: its photos, the two text
// slides, and the numbers on the second slide.
export default async function HomeBannerPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const o = await getOverrides();
  const hero = heroOf(o);
  const photos = heroPhotoDrafts(o);

  return (
    <>
      <div className="a-toplabel">Home banner</div>
      <h1>Home banner</h1>
      <p className="a-lede">
        The banner rotates through the photos below. Each photo shows one of the two text slides: the lifestyle line or the
        numbers. Changes appear on the home page as soon as you save.
      </p>
      <Notice searchParams={searchParams} />

      <div className="a-cards">
        <section className="a-card">
          <div className="a-cardhead">
            <div>
              <h2>Banner photos</h2>
              <p className="a-cardhint">Shown in this order. Use wide photos, at least 2000px across.</p>
            </div>
          </div>
          <div className="a-rows">
            {photos.map((p, i) => (
              <div className="a-row" key={`${i}-${p.photo}`}>
                <form action={saveHeroPhoto} className="a-rowmain a-form">
                  <input type="hidden" name="id" value={i} />
                  <PhotoField current={p.photo} id={`hp${i}`} />
                  <div className="a-grid2">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`hp${i}-alt`}>
                        Description (for screen readers)
                      </label>
                      <input className="a-input" id={`hp${i}-alt`} name="alt" defaultValue={p.alt} maxLength={300} />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`hp${i}-slide`}>
                        Text shown over it
                      </label>
                      <select className="a-input" id={`hp${i}-slide`} name="slide" defaultValue={p.slide}>
                        <option value="lifestyle">Slide 1: lifestyle line</option>
                        <option value="proof">Slide 2: the numbers</option>
                      </select>
                    </div>
                  </div>
                  <div className="a-actions">
                    <SubmitButton className="a-btn small" pendingLabel="Saving…">
                      Save photo
                    </SubmitButton>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={moveHeroPhoto}>
                    <input type="hidden" name="id" value={i} />
                    <input type="hidden" name="dir" value="up" />
                    <button className="a-btn small subtle" type="submit" disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`}>
                      ↑ Earlier
                    </button>
                  </form>
                  <form action={moveHeroPhoto}>
                    <input type="hidden" name="id" value={i} />
                    <input type="hidden" name="dir" value="down" />
                    <button className="a-btn small subtle" type="submit" disabled={i === photos.length - 1} aria-label={`Move photo ${i + 1} later`}>
                      ↓ Later
                    </button>
                  </form>
                  <form action={deleteHeroPhoto}>
                    <input type="hidden" name="id" value={i} />
                    <ConfirmButton title="Remove this banner photo?" message="It comes off the home page straight away." confirmLabel="Remove" danger>
                      Remove
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>

          <form action={addHeroPhoto} className="a-form a-addbox">
            <h3>Add a photo</h3>
            <PhotoField current="" id="new-hp" />
            <div className="a-grid2">
              <div className="a-field">
                <label className="a-label" htmlFor="new-hp-alt">
                  Description (for screen readers)
                </label>
                <input className="a-input" id="new-hp-alt" name="alt" maxLength={300} placeholder="What the photo shows" />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="new-hp-slide">
                  Text shown over it
                </label>
                <select className="a-input" id="new-hp-slide" name="slide" defaultValue="lifestyle">
                  <option value="lifestyle">Slide 1: lifestyle line</option>
                  <option value="proof">Slide 2: the numbers</option>
                </select>
              </div>
            </div>
            <div className="a-actions">
              <SubmitButton className="a-btn small" pendingLabel="Adding…">
                Add photo
              </SubmitButton>
            </div>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>Banner text</h2>
          </div>
          <form action={saveHero} className="a-form">
            <div className="a-grid2">
              <div className="a-field">
                <label className="a-label" htmlFor="lt">
                  Slide 1 small label
                </label>
                <input className="a-input" id="lt" name="lifestyleTag" defaultValue={hero.lifestyle.tag} />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="ll">
                  Slide 1 headline
                </label>
                <input className="a-input" id="ll" name="lifestyleLine" defaultValue={hero.lifestyle.line} />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="pt">
                  Slide 2 small label
                </label>
                <input className="a-input" id="pt" name="proofTag" defaultValue={hero.proof.tag} />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="pl">
                  Slide 2 headline
                </label>
                <input className="a-input" id="pl" name="proofLine" defaultValue={hero.proof.line} />
              </div>
            </div>
            <div className="a-actions">
              <SubmitButton className="a-btn small" pendingLabel="Saving…">
                Save text
              </SubmitButton>
            </div>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <div>
              <h2>Slide 2 numbers</h2>
              <p className="a-cardhint">A big figure and a short line under it.</p>
            </div>
            <form action={addHeroStat}>
              <SubmitButton className="a-btn small ghost" pendingLabel="Adding…">
                Add number
              </SubmitButton>
            </form>
          </div>
          <div className="a-rows">
            {hero.proof.stats.map((s, i) => (
              <div className="a-row" key={i}>
                <form action={saveHeroStat} className="a-rowmain a-statrow">
                  <input type="hidden" name="id" value={i} />
                  <input className="a-input" name="value" defaultValue={s.value} aria-label={`Number ${i + 1}`} placeholder="36 mg" />
                  <input className="a-input" name="label" defaultValue={s.label} aria-label={`Number ${i + 1} line`} placeholder="What it means" />
                  <SubmitButton className="a-btn small" pendingLabel="Saving…">
                    Save
                  </SubmitButton>
                </form>
                <div className="a-rowside">
                  <form action={deleteHeroStat}>
                    <input type="hidden" name="id" value={i} />
                    <ConfirmButton title="Remove this number?" message="It comes off the banner straight away." confirmLabel="Remove" danger>
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
