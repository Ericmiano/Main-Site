/** Grow A Classroom programme content, sourced from aak.or.ke/grow-a-classroom. */

export interface GacPhoto {
  src: string;
  alt: string;
}

export interface GacSchool {
  /** Anchor id, matching aak.or.ke's own jump links. */
  id: string;
  name: string;
  county: string;
  kind: string;
  date?: string;
  outcomes: string[];
  video?: { src: string; title: string };
  /** Shown in the mosaic, first one largest. */
  highlights: GacPhoto[];
  /** Full set for the lightbox, when there are more than the highlights. */
  allPhotos?: GacPhoto[];
}

export const gacTagline = "Shaping the Urban Future through Sustainable Education";

export const gacOverview =
  "The Architectural Association of Kenya (AAK) initiated the Grow A Classroom project to address the deplorable conditions in public schools across Kenya. Many institutions face challenges such as dilapidated infrastructure, insufficient ventilation, and encroachment. By integrating professional design with environmental stewardship, AAK aims to transform learning environments for over 55,000 schools nationwide.";

export const gacStrategy = [
  {
    title: "Master plans",
    body: "Development of comprehensive master plans for schools to ensure logical layout and future expansion.",
  },
  {
    title: "Landscaping",
    body: "Appropriate landscaping to enhance outdoor learning experiences using wood, ornamental, and fruit trees.",
  },
  {
    title: "Timber from the site",
    body: "Creation of a sustainable material source by using mature wood from onsite trees for classrooms and furniture.",
  },
  {
    title: "Tree planting",
    body: "Fostering a culture of tree planting to increase national tree cover and sequester carbon.",
  },
  {
    title: "Carbon credits",
    body: "Monetization of carbon credits to create a sustainable revenue stream for educational institutions.",
  },
];

export const gacTargets: { value: number; suffix?: string; label: string }[] = [
  { value: 55000, label: "Schools involved" },
  { value: 300000, label: "Acres of land targeted" },
  { value: 10, label: "Year goal" },
  { value: 12, suffix: "%+", label: "National tree cover goal" },
];

export const gacDonation = { method: "M-Pesa Paybill", paybill: "988 567", account: "GAC" };

export const gacVideo = {
  src: "https://www.youtube.com/embed/oQSN4t1yPAM",
  title: "The Grow A Classroom Project by AAK",
};

const mabokoniAlt = "Grow A Classroom mentorship at Mabokoni Primary School, Kwale County";
const mabokoniFiles = [
  1839, 1896, 1911, 1912, 1952, 1981, 2005, 2038, 2052, 2103, 2135, 2151, 2164, 2171, 2188, 2191,
  2213, 2218, 2282, 2288, 2294, 2307, 2309, 2317, 2333, 2340, 2364, 2368, 2374, 2388, 2393, 2428,
  2444, 2446, 2449, 2489, 2511, 2547,
];
const mabokoni = (n: number): GacPhoto => ({
  src: `/gac/mabokoni/img-${n}.webp`,
  alt: mabokoniAlt,
});

const photo = (school: string, file: string, alt: string): GacPhoto => ({
  src: `/gac/${school}/${file}.webp`,
  alt,
});

export const gacSchools: GacSchool[] = [
  {
    id: "mabokoni-primary",
    name: "Mabokoni Primary School",
    county: "Kwale County",
    kind: "Mentorship session",
    date: "16 September 2026",
    outcomes: [],
    video: {
      src: "/grow-a-classroom-mabokoni/day-1-landscape.mp4",
      title: "Mabokoni Primary School site visit",
    },
    // The six photos aak.or.ke features for this visit, in its order.
    highlights: [2307, 2288, 2444, 2511, 2171, 1952].map(mabokoni),
    allPhotos: mabokoniFiles.map(mabokoni),
  },
  {
    id: "iiani-nzambani",
    name: "Iiani, Nzambani",
    county: "Makueni County",
    kind: "Past event",
    outcomes: [
      "Trees planted with the school community",
      "Masterplan model developed and delivered to the school",
      "Alumni association activated and since formally registered",
      "Fundraising ongoing for a proposed block of classrooms",
    ],
    highlights: [
      photo(
        "iiani-nzambani",
        "01-masterplan-model-handover",
        "AAK team and school leaders present the masterplan model to Iiani School, Nzambani, Makueni County",
      ),
      photo(
        "iiani-nzambani",
        "02-tree-planting-pupils",
        "Pupils plant trees with AAK volunteers at Iiani School, Nzambani",
      ),
      photo(
        "iiani-nzambani",
        "03-tree-planting-volunteers",
        "AAK volunteers and pupils planting seedlings at Iiani School, Nzambani",
      ),
      photo(
        "iiani-nzambani",
        "04-certificates",
        "Pupils and parents receive certificates during the Grow A Classroom visit to Iiani School",
      ),
      photo(
        "iiani-nzambani",
        "05-pupils-view-masterplan-model",
        "Pupils gather around the school masterplan model at Iiani School, Nzambani",
      ),
      photo(
        "iiani-nzambani",
        "06-masterplan-classroom-session",
        "AAK architect explains the school masterplan to pupils in a classroom at Iiani School",
      ),
    ],
  },
  {
    id: "butere-primary",
    name: "Butere Primary School",
    county: "Kakamega County",
    kind: "Past event",
    outcomes: [
      "Trees planted with the school community",
      "Masterplan model designed and delivered to the school",
    ],
    highlights: [
      photo(
        "butere-primary",
        "01-school-assembly",
        "Pupils gather for the Grow A Classroom assembly at Butere Primary School, Kakamega County",
      ),
      photo(
        "butere-primary",
        "02-address-to-pupils",
        "AAK team addresses pupils at Butere Primary School",
      ),
      photo(
        "butere-primary",
        "03-classroom-block",
        "Existing classroom block at Butere Primary School",
      ),
      photo(
        "butere-primary",
        "04-pupils-session-field",
        "Butere Primary School pupils seated on the field during the Grow A Classroom session",
      ),
      photo(
        "butere-primary",
        "05-masterplan-model-pupils",
        "Pupils behind the Butere Primary School masterplan model",
      ),
      photo(
        "butere-primary",
        "06-masterplan-model-head-teacher",
        "AAK architects and the head teacher with the Butere Primary School masterplan model",
      ),
    ],
  },
  {
    id: "shauri-moyo-primary",
    name: "Shauri Moyo Primary School",
    county: "Kisumu County",
    kind: "Past event",
    outcomes: [
      "1,000 tree seedlings planted",
      "Masterplan ideas competition held",
      "Kids’ art competition held",
    ],
    highlights: [
      photo(
        "shauri-moyo-primary",
        "01-group-photo-full",
        "AAK team, school leaders and pupils after the Grow A Classroom event at Shauri Moyo Primary School, Kisumu",
      ),
      photo(
        "shauri-moyo-primary",
        "02-pupils-aak-banner",
        "Shauri Moyo Primary School pupils at the Grow A Classroom session with an AAK banner",
      ),
      photo(
        "shauri-moyo-primary",
        "03-pupil-planting-seedling",
        "A Shauri Moyo Primary School pupil plants a seedling",
      ),
      photo(
        "shauri-moyo-primary",
        "04-certificate-award",
        "A student receives a certificate in the Grow A Classroom competitions at Shauri Moyo Primary School",
      ),
      photo(
        "shauri-moyo-primary",
        "05-masterplan-explained-to-pupils",
        "An architect explains the Shauri Moyo Primary School masterplan to pupils",
      ),
      photo(
        "shauri-moyo-primary",
        "06-welcome-chalkboard",
        "Welcome chalkboard drawing by Shauri Moyo pupils reading “Tulinde mazingira yetu”",
      ),
    ],
  },
];
