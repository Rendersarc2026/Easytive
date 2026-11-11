import { Suspense } from "react";

// Shared pieces for the admin pages.

const problems: Record<string, string> = {
  "upload-empty": "That file was empty. Pick the image again.",
  "upload-size": "That image is over 4 MB. Export it smaller (around 2000px wide is plenty) and try again.",
  "upload-type": "Only JPEG, PNG, WebP or AVIF images can be uploaded.",
  "upload-store": "The image couldn't be stored. Try again in a moment.",
  "upload-rate": "Too many uploads in the last hour. Wait a while and try again.",
  "post-missing": "Fill in the title, author, date, cover photo and post text, then save again.",
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
