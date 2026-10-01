/**
 * Live social feeds. Only Facebook (its page plugin) and YouTube (the
 * channel's uploads playlist) offer always-current embeds without an API
 * account, plus Instagram's profile embed (below). X's timeline widget no
 * longer loads for logged-out visitors, so X, LinkedIn and TikTok are linked.
 */

/** Facebook page plugin: the page and its latest posts. It lays itself out at
 * the width in its address (180-500px), so pass the space actually available. */
export const facebookFeedUrl = (width: number, height: number) =>
  "https://www.facebook.com/plugins/page.php?href=" +
  encodeURIComponent("https://www.facebook.com/ArchKE/") +
  `&tabs=timeline&width=${Math.max(180, Math.min(500, Math.round(width)))}&height=${height}` +
  "&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false";

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
 * text is shown until X's embed loads, and instead of it if X is blocked. */
export interface XPost {
  id: string;
  date: string;
  text: string;
}
export const X_POSTS: XPost[] = [
  {
    id: "2105571147932987466",
    date: "1 October 2026",
    text: "As an official pilot project of the 30th UIA World Congress of Architects 2029 Beijing, this open international competition targets young architects worldwide: a 200 m² urban public pavilion on the Yongding River waterfront in Beijing.",
  },
  {
    id: "2105305352887513285",
    date: "30 September 2026",
    text: "Yesterday, AAK, led by Vice President Arch. Brenda Nyawara, participated in a stakeholder forum convened by the Nairobi City County Assembly's Lands, Housing and Planning Committee, highlighting key concerns affecting planning and development control.",
  },
  {
    id: "2104843015181209601",
    date: "29 September 2026",
    text: "The AAK Architects Chapter invites you to be part of its delegation to the East Africa Institute of Architects (EAIA) AGM & Architecture Congress in Kigali, Rwanda. Join our organised road trip for cross-border learning and networking.",
  },

];

export const xPostUrl = (id: string) => `https://x.com/Arch_KE/status/${id}`;
