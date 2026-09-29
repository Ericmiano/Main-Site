import { gacSchools, gacW800 } from "@/data/grow-a-classroom";
import { fileUrl } from "@/lib/files";

/**
 * The media archive (/media): photographs from past AAK events, one album
 * per event. Grow A Classroom albums come straight from the programme's own
 * data, so the two pages never disagree.
 *
 * To add an event: put the photos in public/media/<slug>/ (a 1600px image
 * and a 640x480 thumbnail per photo) and add an album below. Only use names,
 * dates and places that are confirmed.
 */
export interface MediaPhoto {
  src: string;
  /** Smaller crop for the grid; falls back to `src`. */
  thumb?: string;
  alt: string;
}

export interface MediaAlbum {
  slug: string;
  title: string;
  category: string;
  /** Display date; omit when it isn't confirmed. */
  date?: string;
  /** For sorting (newest first); undated albums go last. */
  isoDate?: string;
  /** Venue or place; omit when it isn't confirmed. */
  location?: string;
  summary: string;
  cover: MediaPhoto;
  photos: MediaPhoto[];
  video?: { src: string; title: string };
  links?: { label: string; href: string }[];
}

/** An album's photos from public/media/<dir>/NN.webp (+ thumbs/), in order. */
const photosIn = (dir: string, alts: string[]): MediaPhoto[] =>
  alts.map((alt, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { src: `/media/${dir}/${n}.webp`, thumb: `/media/${dir}/thumbs/${n}.webp`, alt };
  });

const waldorfDir = "/media/waldorf-visit-2026";
const waldorfPhotos: MediaPhoto[] = [
  "Guests registering at the door",
  "The school hall set up for the talks, with AAK and Nairobi Biennale banners",
  "A speaker addresses the audience in the hall",
  "The audience in the school hall",
  "Speakers in front of the Nairobi Biennale banner",
  "A seated conversation at the front of the hall",
  "Guests listening during the talks",
  "Starting the campus tour under the trees",
  "A guide points out features of the campus",
  "Touring the school's timber classroom buildings",
  "A timber classroom set among the trees",
  "Inside a classroom: chairs arranged on a red carpet",
  "A classroom interior with timber walls and a band of clerestory glazing",
  "A curved classroom building among the trees",
  "An open outdoor court with timber benches",
  "A timber-screened washroom block with steel basins",
  "A classroom with a clerestory roof above a timber-pole base",
  "A covered outdoor room with timber tables",
  "A timber lookout tower in a play court",
  "Timber play structures among the trees",
  "A small round hut in the school garden",
  "Visitors outside a timber classroom block",
  "A round classroom clad in vertical timber slats",
  "A small timber cabin with a sloping roof",
  "The pavilion's gable end among acacia trees",
  "The pavilion's roof resting on a forest of timber poles",
  "Long tables under the pavilion",
  "Under the pavilion roof: timber poles and woven pendant lights",
  "Members and guests gathered beneath the pavilion",
  "A stone house on the school campus",
].map((alt, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `${waldorfDir}/${n}.webp`, thumb: `${waldorfDir}/thumbs/${n}.webp`, alt };
});

const waldorfVisit: MediaAlbum = {
  slug: "nairobi-waldorf-school-visit-2026",
  title: "Nairobi Waldorf School visit",
  category: "Site visit",
  date: "24 July 2026",
  isoDate: "2026-07-24",
  location: "Nairobi",
  summary:
    "Talks in the school hall and a tour of the campus's timber buildings, ending under the pavilion that won Best Africa (Re)presentation at the 2024 Awards of Excellence.",
  cover: waldorfPhotos[28]!,
  photos: waldorfPhotos,
  links: [
    {
      label: "Read the project brief (PDF)",
      href: fileUrl("/documents/NAIROBI-WALDORF-SCHOOL-PROJECT.pdf"),
    },
    { label: "Awards of Excellence", href: "/awards" },
  ],
};

// Workshops. Titles, dates and venues are taken from the event photos'
// folders, slides and signage.
const toolkitPhotos = photosIn("architects-toolkit-2026", [
  "A speaker opens the session at the podium, in front of the AAK banner",
  "A speaker at the podium",
  "A speaker addresses the room from the podium",
  "Participants listening at their tables",
  "Participants follow the discussion",
  "A participant listens during the talks",
  "A speaker takes the microphone beside the podium",
  "A speaker at the podium in front of the AAK banner",
  "A speaker presents from the podium",
  "A participant listens from her table",
  "A participant takes notes",
  "A question from the floor",
  "A participant speaks from his table",
  "A participant makes a point during the discussion",
  "A question from the floor",
  "A participant asks a question",
  "A participant responds from the floor",
  "Speakers and participants gather for a group photo",
  "A group photo in front of the event slide, “The Architect’s Toolkit”",
]);

const architectsToolkit: MediaAlbum = {
  slug: "architects-toolkit-2026",
  title: "The Architect’s Toolkit",
  category: "Workshop",
  date: "5 August 2026",
  isoDate: "2026-08-05",
  summary:
    "A hybrid event by the AAK Architects Chapter, “The Architect’s Toolkit: Navigating Economic Challenges & Regulatory Hurdles in Kenya”: talks from the podium, questions from the floor and a group photo to close.",
  cover: toolkitPhotos[toolkitPhotos.length - 1]!,
  photos: toolkitPhotos,
  links: [{ label: "The Architects Chapter", href: "/chapters/architects" }],
};

const kickoffPhotos = photosIn("finance-accelerator-kickoff-2026", [
  "Signing in at the registration desk",
  "The GBPN banner at the venue entrance, beside an AAK banner",
  "The room ahead of the opening, with the workshop title on screen",
  "A speaker opens the workshop in front of the Kenya Buildings Decarbonization Financing Accelerator banner",
  "Participants at round tables during the opening session",
  "A speaker presents in front of the Kenya Decarbonization Finance Accelerator slide",
  "A presentation to the full room",
  "Participants follow a presentation",
  "A presentation on green building standards and certification as a finance enabler",
  "A speaker presents from the podium",
  "Participants in discussion at their tables",
  "A presenter at the podium beside the GBPN slide",
  "A question from the floor",
  "The room during an afternoon session",
  "A speaker presents a slide on building a financing ecosystem",
  "A participant makes a point during the discussion",
  "A speaker presents from the podium",
  "A group working session at a round table",
  "Participants work through an exercise in small groups",
  "Group work, with a countdown timer on the screen",
  "The AAK banner at the refreshment area",
  "A speaker takes questions from the podium",
  "A speaker addresses the room",
  "A presentation of a gift at the close",
  "Workshop participants gather in the hotel garden for a group photo",
  "A seated group photo in the garden",
  "Participants gather for a group photo at the end of the day",
]);

const financeAcceleratorKickoff: MediaAlbum = {
  slug: "finance-accelerator-kickoff-2026",
  title: "Finance Accelerator coalition kick-off",
  category: "Workshop",
  date: "7 August 2026",
  isoDate: "2026-08-07",
  location: "Fairview Hotel, Nairobi",
  summary:
    "The coalition kick-off workshop of the Kenya Decarbonization Finance Accelerator, with the Global Buildings Performance Network (GBPN) and the State Department for Public Works: presentations, questions from the floor and group work, with AAK among the partners.",
  cover: kickoffPhotos[kickoffPhotos.length - 3]!,
  photos: kickoffPhotos,
};

const kgbsPhotos = photosIn("kgbs-finance-accelerator-2026", [
  "The event sign at the Novotel: Kenya Green Building Society (KGBS) x Global Buildings Performance Network (GBPN)",
  "A Kenya Green Building Society banner at the venue",
  "Participants at their tables",
  "Participants settle in at their tables",
  "A speaker opens the session beside the Kenya Green Building Society banner",
  "A presentation to the room",
  "A speaker presents from the podium",
  "A discussion at the front of the room",
  "A speaker makes a point during her presentation",
  "A speaker presents at the podium",
  "A speaker in front of the Kenya Buildings Decarbonization Financing Accelerator banner",
  "The room during a presentation",
  "A speaker addresses the room from the front",
  "Participants at round tables",
  "A participant takes notes",
  "A discussion at the tables",
  "A question from the floor",
  "A participant speaks during the discussion",
  "Participants work together at a laptop",
  "A participant makes a point",
  "A participant speaks from his table",
  "A speaker presents in front of the GBPN banner",
  "Workshop participants gather in the garden for a group photo",
  "A conversation in the garden during the break",
  "Participants talk in the garden",
  "A small group photo in the garden",
]);

const kgbsFinanceAccelerator: MediaAlbum = {
  slug: "kgbs-finance-accelerator-2026",
  title: "KGBS partner workshop on the Finance Accelerator",
  category: "Workshop",
  date: "21 August 2026",
  isoDate: "2026-08-21",
  location: "Novotel, Nairobi",
  summary:
    "The Kenya Green Building Society’s second partner workshop on the Finance Accelerator Programme, held with the Global Buildings Performance Network (GBPN): presentations, discussion and group work.",
  cover: kgbsPhotos[kgbsPhotos.length - 4]!,
  photos: kgbsPhotos,
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
/** "16 September 2026" -> "2026-09-16". */
const toIso = (date: string | undefined) => {
  const m = date?.match(/^(\d{1,2}) (\w+) (\d{4})$/);
  if (!m) return undefined;
  const month = MONTHS.indexOf(m[2]!) + 1;
  return month ? `${m[3]}-${String(month).padStart(2, "0")}-${m[1]!.padStart(2, "0")}` : undefined;
};

const gacAlbums: MediaAlbum[] = gacSchools.map((school) => {
  const photos = (school.allPhotos ?? school.highlights).map((p) => ({
    ...p,
    thumb: gacW800(p.src),
  }));
  const iso = toIso(school.date);
  return {
    slug: `grow-a-classroom-${school.id}`,
    title: `Grow A Classroom: ${school.name}`,
    category: "Grow A Classroom",
    ...(school.date ? { date: school.date } : {}),
    ...(iso ? { isoDate: iso } : {}),
    location: school.county,
    summary: `${school.kind} in ${school.county}, part of AAK's Grow A Classroom programme.`,
    cover: photos.find((p) => p.src === school.highlights[0]?.src) ?? photos[0]!,
    photos,
    ...(school.video ? { video: school.video } : {}),
    links: [
      { label: "About Grow A Classroom", href: "/initiatives/grow-a-classroom" },
      { label: "The Grow A Classroom website", href: "https://schools.aak.or.ke/" },
    ],
  };
});

/** Newest first; undated albums after dated ones, in source order. */
export const mediaAlbums: MediaAlbum[] = [
  waldorfVisit,
  architectsToolkit,
  financeAcceleratorKickoff,
  kgbsFinanceAccelerator,
  ...gacAlbums,
]
  .map((album, i) => ({ album, i }))
  .sort((a, b) => {
    const x = a.album.isoDate,
      y = b.album.isoDate;
    if (x && y) return y.localeCompare(x);
    if (x) return -1;
    if (y) return 1;
    return a.i - b.i;
  })
  .map(({ album }) => album);

export const getMediaAlbum = (slug: string) => mediaAlbums.find((a) => a.slug === slug);
