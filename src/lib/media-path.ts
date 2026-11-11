// Shape of an uploaded image's public path. Kept free of server imports so
// both the content store and the /media route can share it.

const MEDIA_PATH = /^\/media\/(uploads\/\d{4}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp|avif))$/;

/** True for a path this site serves from the storage bucket. */
export function isMediaPath(ref: string): boolean {
  return MEDIA_PATH.test(ref);
}

/** The bucket key behind a /media path, or null when it isn't one. */
export function mediaKey(path: string): string | null {
  return MEDIA_PATH.exec(path)?.[1] ?? null;
}
