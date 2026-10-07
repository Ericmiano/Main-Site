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
export const X_POSTS: XPost[] = [
  {
    id: "2107363980444606531",
    date: "6 October 2026",
    text: "Join us this Friday for a FREE AAK Members Forum 2026 on transitioning into entrepreneurship or scaling your young practice in the built environment, moderated by Arch. Rosemary Litunya. Blue Violets Plaza, Suite 704, Kamburu Drive; Friday 9 October, 2 to 5 PM. Free for members in good standing, KES 1,500 for non-members.",
    images: [
      {
        src: "/img/x/2107363980444606531-1.webp",
        width: 800,
        height: 640,
        alt: "Poster for the AAK Members Forum 2026, Winning Your First Clients, with speakers Abigael Osidiana, Humphrey Mumita, Arch. Sharon Njiru and Eng. Nashon Tambo, Friday 9 October 2026",
      },
    ],
  },
  {
    id: "2107072202181095583",
    date: "5 October 2026",
    text: "Happy World Habitat Day! Houses are more than buildings; they are where life happens. On World Habitat Day, we re-commit to planning and designing inclusive, resilient and sustainable habitats for all Kenyans.",
    images: [
      {
        src: "/img/x/2107072202181095583-1.webp",
        width: 800,
        height: 800,
        alt: "World Habitat Day 2026 poster: Adequate Housing for All, with a green city skyline cut from paper",
      },
    ],
  },
  {
    id: "2107056417836617755",
    date: "5 October 2026",
    text: "Happy World Architecture Day! What does a dignified home mean to you? Today we join architects worldwide in affirming that decent, affordable shelter must be for everyone, not a privilege for a few. Let's design for people, for equity, and for a better tomorrow.",
    images: [
      {
        src: "/img/x/2107056417836617755-1.webp",
        width: 800,
        height: 800,
        alt: "World Architecture Day 2026 poster: Housing is a Human Right. Build It., over an aerial photo of a Kenyan housing estate",
      },
    ],
  },
  {
    id: "2107021173922173405",
    date: "5 October 2026",
    text: "Happy Customer Service Week from AAK! We appreciate our members, partners, clients, and staff. Thank you for your continued trust and collaboration. We remain committed to serving you with professionalism, integrity and excellence. Jacob Mwangi, Chief Executive Officer, AAK.",
    images: [
      {
        src: "/img/x/2107021173922173405-1.webp",
        width: 800,
        height: 800,
        alt: "Still from a video message by AAK Chief Executive Officer Jacob Mwangi",
      },
    ],
    video: true,
  },
];

export const xPostUrl = (id: string) => `https://x.com/Arch_KE/status/${id}`;
