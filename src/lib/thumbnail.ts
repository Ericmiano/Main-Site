/** The thumbnail on the page showing one of `srcs` (e.g. a photo's smaller
 * copy, then the photo itself), for a Lightbox `origin`. */
export function thumbnailFor(...srcs: (string | undefined)[]) {
  for (const src of srcs) {
    if (!src) continue;
    const match = document.querySelector(`main img[src="${CSS.escape(src)}"]`);
    if (match) return match;
  }
  return null;
}
