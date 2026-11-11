import Image from "next/image";
import { Suspense } from "react";
import { photoSrc } from "@/data/store";

// Shared pieces for the admin content pages.

/** Square preview of a photo reference (bank key or uploaded /media path). */
export function Thumb({ photo, size = 64 }: { photo: string | undefined; size?: number }) {
  const src = photoSrc(photo);
  if (!src) return <span className="a-thumb empty" style={{ width: size, height: size }} aria-hidden />;
  // Explicit size: the site-wide `img { height: auto }` would otherwise keep the photo's own shape.
  return <Image className="a-thumb" src={src} alt="" width={size} height={size} sizes={`${size * 2}px`} style={{ width: size, height: size }} />;
}

/** Current photo plus an upload box. Submits `upload`; with no file the photo stays as it is. */
export function PhotoField({ current, id, label = "Photo" }: { current: string; id: string; label?: string }) {
  return (
    <div className="a-photofield">
      <Thumb photo={current} size={88} />
      <div className="a-photocontrols">
        <div className="a-field">
          <label className="a-label" htmlFor={`${id}-upload`}>
            {label}
          </label>
          <input className="a-file" id={`${id}-upload`} name="upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
          <span className="a-cardhint">JPEG, PNG, WebP or AVIF, up to 4 MB. Replaces the current photo when you save.</span>
        </div>
      </div>
    </div>
  );
}

const problems: Record<string, string> = {
  "upload-empty": "That file was empty. Pick the image again.",
  "upload-size": "That image is over 4 MB. Export it smaller (around 2000px wide is plenty) and try again.",
  "upload-type": "Only JPEG, PNG, WebP or AVIF images can be uploaded.",
  "upload-store": "The image couldn't be stored. Try again in a moment.",
  "upload-rate": "Too many uploads in the last hour. Wait a while and try again.",
};

/**
 * Explains a ?error= code that an action redirected back with. Reading the
 * URL is request-time work, so it streams in behind its own Suspense boundary
 * and the rest of the page can still render straight away.
 */
export function Notice({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <Suspense fallback={null}>
      <NoticeText searchParams={searchParams} />
    </Suspense>
  );
}

async function NoticeText({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <p className="a-error" role="alert" style={{ marginBottom: 16 }}>
      {problems[error] ?? "That didn't work. Try again."}
    </p>
  );
}
