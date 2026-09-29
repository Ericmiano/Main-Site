import { gacSchools } from "@/data/grow-a-classroom";

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
  location: string;
  summary: string;
  cover: MediaPhoto;
  photos: MediaPhoto[];
  video?: { src: string; title: string };
  links?: { label: string; href: string }[];
}

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
      href: "/documents/NAIROBI-WALDORF-SCHOOL-PROJECT.pdf",
    },
    { label: "Awards of Excellence", href: "/awards" },
  ],
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
  const photos = school.allPhotos ?? school.highlights;
  const iso = toIso(school.date);
  return {
    slug: `grow-a-classroom-${school.id}`,
    title: `Grow A Classroom: ${school.name}`,
    category: "Grow A Classroom",
    ...(school.date ? { date: school.date } : {}),
    ...(iso ? { isoDate: iso } : {}),
    location: school.county,
    summary: `${school.kind} in ${school.county}, part of AAK's Grow A Classroom programme.`,
    cover: school.highlights[0] ?? photos[0]!,
    photos,
    ...(school.video ? { video: school.video } : {}),
    links: [
      { label: "About Grow A Classroom", href: "/initiatives/grow-a-classroom" },
      { label: "The Grow A Classroom website", href: "https://schools.aak.or.ke/" },
    ],
  };
});

/** Newest first; undated albums after dated ones, in source order. */
export const mediaAlbums: MediaAlbum[] = [waldorfVisit, ...gacAlbums]
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
