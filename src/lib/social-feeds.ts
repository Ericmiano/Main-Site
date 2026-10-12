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
export const X_POSTS: XPost[] = [
  {
    id: "2108812628491378995",
    date: "10 October 2026",
    text: "Happy Mazingira Day! The Architectural Association of Kenya is integrating professional design and environmental stewardship to create better learning environments in public schools across Kenya. Scan the QR code or visit schools.aak.or.ke to learn more.",
    images: [
      {
        src: "/img/x/2108812628491378995-1.webp",
        width: 800,
        height: 800,
        alt: "Mazingira Day poster, 10 October 2026: Our Environment, Our Responsibility, with pupils and AAK members planting trees",
      },
    ],
  },
  {
    id: "2108526724916883757",
    date: "9 October 2026",
    text: "#TeamAAK is exhibiting at the East Africa Institute of Architects (EAIA) Annual Congress, AGM and Rwanda Architecture Week, showcasing selected projects from the Nairobi Biennale 2026 and the AAK Duracoat Awards of Excellence.",
    images: [
      {
        src: "/img/x/2108526724916883757-1.webp",
        width: 800,
        height: 600,
        alt: "Delegates on stage at the Rwanda Architecture Week and EAIA Congress",
      },
      {
        src: "/img/x/2108526724916883757-2.webp",
        width: 800,
        height: 600,
        alt: "The AAK team at the EAIA Congress in Kigali",
      },
      {
        src: "/img/x/2108526724916883757-3.webp",
        width: 800,
        height: 1067,
        alt: "The AAK exhibition stand with project boards",
      },
      {
        src: "/img/x/2108526724916883757-4.webp",
        width: 800,
        height: 602,
        alt: "Visitors at the AAK Architects Chapter stand",
      },
    ],
  },
  {
    id: "2108473562247926222",
    date: "9 October 2026",
    text: "As we marked Members' Week, we visited some of our firm members, listening, learning and talking about how we can better support the professionals shaping Kenya's built environment. Thank you to Waweru & Associates, Miradi Consultants, Lexicon + ion, Precise Architects, Planning Systems Services and Morphosis.",
    images: [
      {
        src: "/img/x/2108473562247926222-1.webp",
        width: 800,
        height: 450,
        alt: "The AAK team with staff of Precise Architects outside their office",
      },
      {
        src: "/img/x/2108473562247926222-2.webp",
        width: 800,
        height: 450,
        alt: "The AAK team presenting a gift at Planning Systems Services",
      },
      {
        src: "/img/x/2108473562247926222-3.webp",
        width: 800,
        height: 450,
        alt: "The AAK team with a member firm in its office",
      },
      {
        src: "/img/x/2108473562247926222-4.webp",
        width: 800,
        height: 450,
        alt: "The AAK team and a member firm's staff in their studio",
      },
    ],
  },
  {
    id: "2108142867751322044",
    date: "8 October 2026",
    text: "AAK, NowNow, ICLEI Africa and Kisumu City invite you to a briefing and guided site visit at Jubilee Market, Kisumu, on Wednesday 21 October 2026, one of the two case-study sites for the Living Markets: Where the City Meets design competition.",
    images: [
      {
        src: "/img/x/2108142867751322044-1.webp",
        width: 800,
        height: 1020,
        alt: "Poster for the site visit to Jubilee Market, Kisumu, 21 October 2026",
      },
    ],
  },
];

export const xPostUrl = (id: string) => `https://x.com/Arch_KE/status/${id}`;
