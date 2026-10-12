import xPosts from "@/data/x-posts.json";

/**
 * Live social feeds for the homepage's "Latest from AAK" section: YouTube
 * (the channel's uploads playlist) and Instagram's profile embed (below).
 * X's timeline widget no longer loads for logged-out visitors, so X posts are
 * chosen by hand (X_POSTS); Facebook, LinkedIn and TikTok are linked.
 */

/** AAK's YouTube uploads, newest first: channel UC7T3qQvpUIQ7E2CUhd2XYOw, whose
 * uploads playlist is "UU" + the same id. Privacy-enhanced mode. */
export const YOUTUBE_LATEST_EMBED =
  "https://www.youtube-nocookie.com/embed/videoseries?list=UU7T3qQvpUIQ7E2CUhd2XYOw";

/** Instagram's profile embed: the account header and its six latest posts.
 * Undocumented by Instagram (the per-post embed is the documented one), so
 * check it still renders if Instagram changes its embeds. */
export const INSTAGRAM_PROFILE_EMBED = "https://www.instagram.com/arch_ke/embed/";

// Rendered height of the profile embed at a given width (measured Oct 2026),
// with a little room to spare; it doesn't size itself to its frame.
const IG_HEIGHTS: [number, number][] = [
  [320, 409],
  [420, 476],
  [560, 596],
  [640, 649],
];
export function instagramEmbedHeight(width: number) {
  let [w0, h0] = IG_HEIGHTS[0]!;
  let [w1, h1] = IG_HEIGHTS[1]!;
  for (const [w, h] of IG_HEIGHTS.slice(2)) {
    if (width <= w1) break;
    [w0, h0, w1, h1] = [w1, h1, w, h];
  }
  return Math.round(h0 + ((width - w0) * (h1 - h0)) / (w1 - w0)) + 6;
}

/** X posts shown on the homepage, newest first. X's timeline widget no longer
 * loads for logged-out visitors but single-post embeds do, so these are picked
 * by hand: add a post's id (the number at the end of its x.com link) here. The
 * text and images (copies in public/img/x) are shown until X's embed loads,
 * and instead of it if the visitor's browser blocks X. */
export interface XPostImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}
export interface XPost {
  id: string;
  date: string;
  text: string;
  images: XPostImage[];
  /** A video post: X embeds these as a bare player with no text, so the
   * card below (with the video's still) is shown in its place. */
  video?: boolean;
}
/** AAK's chosen recent X posts, newest first. Written by the update tool:
 * npm run x-posts -- <links to the latest posts> (see scripts/x-posts.mjs). */
export const X_POSTS: XPost[] = xPosts;

export const xPostUrl = (id: string) => `https://x.com/Arch_KE/status/${id}`;
