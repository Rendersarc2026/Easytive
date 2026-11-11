"use client";

// Cover photo picker for the blog form. Shows the current photo, or the file
// just picked (before it's uploaded), and opens either one full size when the
// preview is clicked. The file itself is sent with the form as `upload`; with
// no file the photo stays as it is.
//
// The same limits as the server (src/lib/media.ts) are checked as soon as a
// file is picked, so a wrong file is flagged red before saving.

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type Picked = { url: string; name: string; size: number };

const sizeText = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export function PhotoField({ current, id, label = "Photo", required = false }: { current: string; id: string; label?: string; required?: boolean }) {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [problem, setProblem] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const viewer = useRef<HTMLDialogElement>(null);
  const viewerTitle = useId();

  // Free the preview's memory when it's replaced or the form goes away.
  useEffect(() => () => void (picked && URL.revokeObjectURL(picked.url)), [picked]);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const file = el.files?.[0];
    let message = "";
    if (file && !TYPES.includes(file.type)) message = "Only JPEG, PNG, WebP or AVIF images can be uploaded.";
    else if (file && file.size > MAX_BYTES) message = `That image is ${sizeText(file.size)}. Use one under 4 MB.`;
    el.setCustomValidity(message);
    setProblem(message);
    setPicked(file && !message ? { url: URL.createObjectURL(file), name: file.name, size: file.size } : null);
  }

  function undo() {
    if (!input.current) return;
    input.current.value = "";
    input.current.setCustomValidity("");
    setProblem("");
    setPicked(null);
  }

  const shown = picked?.url ?? current;

  return (
    <div className="a-photofield">
      <button type="button" className="a-photoprev" onClick={() => viewer.current?.showModal()} disabled={!shown} title={shown ? "View full size" : undefined}>
        {shown ? (
          // A plain <img>: a picked file is a blob: URL, which next/image can't optimise.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" />
        ) : (
          <span className="a-photoprev-empty">No photo</span>
        )}
        {picked && <span className="a-photonew">New</span>}
        {shown && <span className="a-sr">View {picked ? "the picked photo" : "the current photo"} full size</span>}
      </button>

      <div className="a-photocontrols">
        <div className="a-field">
          <label className="a-label" htmlFor={`${id}-upload`}>
            {label}
            {required && (
              <span className="a-req" aria-hidden>
                {" "}
                *
              </span>
            )}
          </label>
          <input
            ref={input}
            className="a-file"
            id={`${id}-upload`}
            name="upload"
            type="file"
            accept={TYPES.join(",")}
            required={required}
            onChange={onPick}
          />
          {picked ? (
            <span className="a-photopicked">
              <span>
                {picked.name}, {sizeText(picked.size)}. Uploads when you save.
              </span>
              <button type="button" className="a-linkbtn" onClick={undo}>
                Undo
              </button>
            </span>
          ) : (
            <span className="a-cardhint">JPEG, PNG, WebP or AVIF, up to 4 MB.{current ? " Pick a file to replace the current photo." : ""}</span>
          )}
          <span className="a-fielderr">{problem || "Choose a cover photo."}</span>
        </div>
      </div>

      <dialog ref={viewer} className="a-viewer" aria-labelledby={viewerTitle} closedby="any">
        <div className="a-viewer-bar">
          <span id={viewerTitle}>{picked ? `${picked.name} (not saved yet)` : "Current photo"}</span>
          <button type="button" className="a-viewer-close" onClick={() => viewer.current?.close()} autoFocus>
            Close
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {shown && <img src={shown} alt="" />}
      </dialog>
    </div>
  );
}
