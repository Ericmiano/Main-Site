import { fileUrl } from "@/lib/files";

export type EventStatus = "ongoing" | "upcoming";

export interface EventAgendaItem {
  time: string;
  label: string;
}

export interface EventFact {
  label: string;
  value: string;
}

export interface SiteEvent {
  /** URL slug — /events/{slug} */
  slug: string;
  title: string;
  kicker: string;
  /** Human-readable date line shown in cards */
  date: string;
  isoDate: string;
  endIsoDate?: string;
  location: string;
  /** Full address / venue line for the detail page and JSON-LD */
  venue: string;
  status: EventStatus;
  /** One-sentence summary, also used as the meta description */
  summary: string;
  /** Detail-page body copy, one paragraph per entry */
  body: string[];
  facts: EventFact[];
  agenda?: EventAgendaItem[];
  image: string;
  imageAlt: string;
  /** External registration / RSVP destination — omit when `registerTo` is set. */
  registerHref?: string;
  /** An internal page instead, when registration/"learn more" just points at content this site already hosts. */
  registerTo?:
    | { to: "/events" }
    | { to: "/status-of-the-built-environment" }
    | { to: "/initiatives/$slug"; params: { slug: string } };
  registerLabel: string;
  /** Short label used on the homepage rail */
  cta: string;
  /** When set, card "view details" links go straight to this external event site instead of the internal detail page */
  externalSiteHref?: string;
}

/**
 * Sourced from AAK's official "2026 AAK Calendar of Events" PDF
 * (aak.or.ke/wp-content/uploads/2026/02/2026-AAK-Calendar-of-Events.pdf).
 * Only association-wide fixtures are featured here — the full calendar also
 * lists dozens of single-chapter CPD sessions and branch meetings.
 */
export const events: SiteEvent[] = [
  {
    slug: "aak-annual-convention-2026",
    title: "AAK Annual Convention 2026",
    kicker: "Flagship gathering",
    date: "16 – 19 September 2026",
    isoDate: "2026-09-16",
    endIsoDate: "2026-09-19",
    location: "Diani, Kenya",
    venue: "Diamonds Leisure Beach & Golf Resort, Diani",
    status: "upcoming",
    summary:
      "AAK's flagship annual gathering: four days in Diani, with registration open now from KES 18,000.",
    body: [
      "The AAK Annual Convention brings the association together for technical sessions, chapter business and networking, running 09:00–16:00 daily at Diamonds Leisure Beach & Golf Resort in Diani.",
      "Registration is open on AAK's public events portal, with tickets starting at KES 18,000. Book ahead, as pricing and available packages are confirmed at checkout.",
    ],
    facts: [
      { label: "Dates", value: "16 – 19 September 2026, 09:00 – 16:00" },
      { label: "Venue", value: "Diamonds Leisure Beach & Golf Resort, Diani" },
      { label: "Starts at", value: "KES 18,000" },
    ],
    image: "/img/0q9a0926-1200x800.webp",
    imageAlt: "Delegates in session at a previous AAK annual convention",
    registerHref: "https://members.aak.or.ke/publicevents",
    registerLabel: "Register (from KES 18,000)",
    cta: "Register now",
    externalSiteHref: "https://convention.aak.or.ke/",
  },
  {
    slug: "nairobi-biennale-2026",
    title: "Nairobi Biennale of Architecture & Art 2026",
    kicker: "Shifting the Center",
    date: "7 – 12 September 2026",
    isoDate: "2026-09-07",
    endIsoDate: "2026-09-12",
    location: "Nairobi, Kenya",
    venue: "ASK Nairobi Showground, Jamhuri Park",
    status: "upcoming",
    summary:
      "AAK's first Nairobi Biennale of Architecture & Art, 'Shifting the Center: From Fragility to Resilience', exploring Africa's built environment through exhibitions, conversations and public programming.",
    body: [
      "The Nairobi Biennale of Architecture & Art 2026 brings together architecture, art, design, urbanism, heritage, industry and ideas to explore Africa's built environment and future, through curated exhibitions, conversations, urban experiences, heritage and public programming.",
      "This year's theme, Shifting the Center: From Fragility to Resilience, Reclaiming Africa's Architecture and Future, positions African architecture as its own centre rather than a periphery testing imported models.",
      "You can take part as a design exhibitor, delegate, commercial exhibitor or vendor. Each route has its own application form, linked from the Biennale site.",
    ],
    facts: [
      { label: "Dates", value: "7 – 12 September 2026" },
      { label: "Venue", value: "ASK Nairobi Showground, Jamhuri Park" },
      { label: "Theme", value: "Shifting the Center: From Fragility to Resilience" },
    ],
    image: "/img/biennale-carousel-1.webp",
    imageAlt: "Nairobi Biennale of Architecture & Art 2026 campaign imagery",
    registerHref: "https://www.biennale.aak.or.ke/",
    registerLabel: "Visit the Biennale site",
    cta: "Explore the Biennale",
    externalSiteHref: "https://www.biennale.aak.or.ke/",
  },
  {
    slug: "sports-wellness-day-2026",
    title: "AAK Sports & Wellness Day",
    kicker: "World Mental Health Awareness",
    date: "10 October 2026",
    isoDate: "2026-10-10",
    location: "Kenya · venue to be announced",
    venue: "Venue to be announced",
    status: "upcoming",
    summary:
      "A members' sports and wellness day marking World Mental Health Awareness, on AAK's official 2026 calendar of events.",
    body: [
      "Part of AAK's official 2026 calendar, this fixture pairs a members' sports day with World Mental Health Awareness activities. Details on venue and how to join are published on AAK's events calendar closer to the date.",
    ],
    facts: [
      { label: "Date", value: "10 October 2026" },
      { label: "Theme", value: "World Mental Health Awareness" },
    ],
    image: "/img/1h5a2307-1200x800.webp",
    imageAlt: "AAK members at a professional gathering",
    registerTo: { to: "/events" },
    registerLabel: "View the AAK events calendar",
    cta: "View details",
  },
  {
    slug: "urban-thinkers-campus-2026",
    title: "Urban Thinkers Campus: Town Planners Charrette",
    kicker: "Town Planners Chapter",
    date: "26 October 2026",
    isoDate: "2026-10-26",
    location: "Kenya · venue to be announced",
    venue: "Venue to be announced",
    status: "upcoming",
    summary:
      "A design charrette and student mentorship day run by the Town Planners Chapter under AAK's long-running Urban Thinkers Campus programme.",
    body: [
      "The Urban Thinkers Campus is AAK's ongoing platform (run with UN-Habitat) for open exchange between urban researchers, professionals and decision-makers on the future of Kenya's cities. The Town Planners Chapter leads this session as a charrette paired with student mentorship.",
    ],
    facts: [
      { label: "Date", value: "26 October 2026" },
      { label: "Run by", value: "Town Planners Chapter" },
    ],
    image: "/img/1h5a2307-1200x800.webp",
    imageAlt: "Members in discussion at an AAK Town Planners Chapter event",
    registerTo: { to: "/initiatives/$slug", params: { slug: "urban-thinkers-campus" } },
    registerLabel: "Learn about Urban Thinkers Campus",
    cta: "View details",
  },
  {
    slug: "status-of-built-environment-2026",
    title: "Status of the Built Environment Report: Release & President's Dinner",
    kicker: "Annual report",
    date: "9 December 2026",
    isoDate: "2026-12-09",
    location: "Nairobi, Kenya",
    venue: "Venue to be announced",
    status: "upcoming",
    summary:
      "AAK releases its annual Status of the Built Environment Report at the President's Dinner, closing out the 2026 calendar.",
    body: [
      "The Status of the Built Environment Report is AAK's annual analysis of trends, challenges and professional opportunities shaping Kenya's construction and urban development sector. The 2026 edition is released at the President's Dinner, on AAK's official calendar of events.",
    ],
    facts: [
      { label: "Date", value: "9 December 2026" },
      { label: "Includes", value: "Status of the Built Environment Report launch" },
    ],
    image: "/img/0q9a0926-1200x800.webp",
    imageAlt: "AAK members at a professional dinner event",
    registerTo: { to: "/status-of-the-built-environment" },
    registerLabel: "Read the Status of the Built Environment Report",
    cta: "View details",
  },
];

/** The event's real status right now — "upcoming"/"ongoing" in the data goes stale once the date passes. */
export function getEventDisplayStatus(
  event: SiteEvent,
  referenceDate: Date = new Date(),
): EventStatus | "past" {
  const now = referenceDate.getTime();
  const start = new Date(event.isoDate).getTime();
  const end = event.endIsoDate ? new Date(event.endIsoDate).getTime() : start;
  if (end < now) return "past";
  if (start <= now && now <= end) return "ongoing";
  return event.status === "ongoing" ? "upcoming" : event.status;
}

/** Ongoing first, then upcoming, then past — soonest date leading within each group. */
export function getSortedEvents(referenceDate: Date = new Date()): SiteEvent[] {
  const statusRank: Record<EventStatus | "past", number> = { ongoing: 0, upcoming: 1, past: 2 };
  const withComputedStatus = events.map((event) => ({
    event,
    computed: getEventDisplayStatus(event, referenceDate),
    start: new Date(event.isoDate).getTime(),
  }));
  return withComputedStatus
    .sort((a, b) => statusRank[a.computed] - statusRank[b.computed] || a.start - b.start)
    .map((entry) => entry.event);
}

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

export interface Initiative {
  id: string;
  /** URL slug — /initiatives/{slug} */
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  /** When set, links open this site in a new tab instead of /initiatives/{slug}. */
  externalUrl?: string;
  cta: string;
  image: string;
  tone: "primary" | "green";
}

export const initiatives: Initiative[] = [
  {
    id: "mulika-mjengo",
    slug: "mulika-mjengo",
    eyebrow: "Public safety advocacy",
    title: "Mulika Mjengo",
    description:
      "A public policing initiative empowering citizens to identify and report structural hazards and illegal construction, feeding multi-agency inspections with the NCA and county governments.",
    href: "https://aak.or.ke/mulika-mjengo/",
    cta: "Report a concern",
    image: "/img/kamulu-mm-10-hp-hp-hp-hp-hp.webp",
    tone: "primary",
  },
  {
    id: "je-una-mjengo",
    slug: "je-una-mjengo",
    eyebrow: "Public sensitisation",
    title: "Je, Una Mjengo?",
    description:
      "AAK's public-facing campaign encouraging Kenyans to engage registered professionals from the outset of any building project, rather than after problems appear.",
    href: "https://aak.or.ke/je-una-mjengo/",
    cta: "See the campaign",
    image: "/img/radio-citizen-pic.webp",
    tone: "primary",
  },
  {
    id: "grow-a-classroom",
    slug: "grow-a-classroom",
    eyebrow: "Professional CSR",
    title: "Grow A Classroom",
    description:
      "Master plans, landscaping and classrooms built from mature on-site timber for under-served schools, paired with tree planting to grow national tree cover and carbon credits.",
    href: "https://schools.aak.or.ke/",
    // The programme's own site; /initiatives/grow-a-classroom stays for direct links.
    externalUrl: "https://schools.aak.or.ke/",
    cta: "Explore the project",
    image: "/img/grow-a-classroom-2307.webp",
    tone: "primary",
  },
  {
    id: "safari-green",
    slug: "safari-green-building-index",
    eyebrow: "Sustainability rating",
    title: "Safari Green Building Index",
    description:
      "A national rating system for resource-efficient building across East Africa's climatic zones, scored on passive design, resource efficiency, energy, landscape and innovation.",
    href: "https://aak.or.ke/safari-green-building-index/",
    externalUrl: "https://safarigreenbuilding.org/",
    cta: "Visit the SGBI website",
    image: "/img/0q9a0926-1200x800.webp",
    tone: "green",
  },
  {
    id: "healthy-homes-guidelines",
    slug: "healthy-homes-guidelines",
    eyebrow: "Public health & housing",
    title: "Healthy Homes Guidelines",
    description:
      "Guidelines developed with Habitat for Humanity International addressing sick-building conditions in Nairobi's informal settlements, set out across fifteen pillars.",
    href: "https://aak.or.ke/healthy-homes-guidelines/",
    cta: "View the guidelines",
    image: "/img/launch-of-hhgc.webp",
    tone: "green",
  },
  {
    // Replaced Urban Thinkers Campus in the initiatives list (its detail page
    // and events stay). Wording from buildhub.aak.or.ke's own description.
    id: "buildhub",
    slug: "buildhub",
    eyebrow: "Permits & approvals",
    title: "AAK BuildHub",
    description:
      "A portal that makes it easier to obtain a building permit or planning approval in Kenya, with step-by-step procedures, approval timelines and fees, county by county.",
    href: "https://buildhub.aak.or.ke/",
    externalUrl: "https://buildhub.aak.or.ke/",
    cta: "Open BuildHub",
    image: "/img/aak-build-tour-66-1200x800-600x400-1.webp",
    tone: "primary",
  },
];

export interface Chapter {
  name: string;
  /** URL slug — /chapters/{slug} */
  slug: string;
  /** External aak.or.ke chapter page, kept for reference/backlink. */
  href: string;
  image: string;
  definition: string;
  /** Short italic strapline shown under the hero title. */
  tagline: string;
  /** Tagline strip near the bottom of the chapter detail page. */
  footerTagline: string;
}

export const chapters: Chapter[] = [
  {
    name: "Architects",
    slug: "architects",
    href: "https://aak.or.ke/architects-chapter/",
    image: "/img/arch.webp",
    definition:
      "An Architect is a professional trained in the design and construction of buildings and structures that primarily provide shelter: preparing designs, coordinating with contractors and consultants, and certifying construction compliance with approved standards.",
    tagline: "Architecture is the science and art of building.",
    footerTagline: "Commitment to Professional Integrity and Architectural Excellence",
  },
  {
    name: "Quantity Surveyors",
    slug: "quantity-surveyors",
    href: "https://aak.or.ke/quantity-surveyors-chapter/",
    image: "/img/qs.webp",
    definition:
      "A Quantity Surveyor is a professional who provides expert advice on construction costs, ensuring that proposed projects are affordable and offer value for money: preparing cost estimates, managing project costs, advising on contractual matters and supporting dispute resolution.",
    tagline: "The essential link between client commission and building completion.",
    footerTagline: "Commitment to Professional Integrity and Economic Stewardship",
  },
  {
    name: "Town Planners",
    slug: "town-planners",
    href: "https://aak.or.ke/town-planners-chapter/",
    image: "/img/tpc.webp",
    definition:
      "A Town Planner is a trained professional who develops plans and programmes for land use and urban development: assessing development feasibility, reviewing proposals, advising planning authorities and ensuring compliance with zoning regulations.",
    tagline: "Providing harmony and efficiency among diverse activities within the town or region.",
    footerTagline: "Commitment to Professional Integrity and Sustainable Urban Growth",
  },
  {
    name: "Engineers",
    slug: "engineers",
    href: "https://aak.or.ke/engineers-chapter/",
    image: "/img/eng.webp",
    definition:
      "An Engineer is a trained professional concerned with the design and physical integrity of buildings, ensuring their safety, stability and durability: preparing detailed structural designs and drawings, and conducting site investigations to ensure compliance with technical and safety standards across the built landscape.",
    tagline: "Ensuring structural safety, stability, and durability in the built environment.",
    footerTagline: "Commitment to Professional Integrity and Structural Excellence",
  },
  {
    name: "Landscape Architects",
    slug: "landscape-architects",
    href: "https://aak.or.ke/landscape-architects-chapter/",
    image: "/img/landscape.webp",
    definition:
      "A Landscape Architect is a trained professional who designs outdoor spaces such as parks, public areas and private gardens: organising land features and selecting materials to maintain the ecological and aesthetic health of the built and natural environment.",
    tagline: "Conserving and improving the natural environment through sound design and planning.",
    footerTagline: "Commitment to Professional Integrity and Natural Conservation",
  },
  {
    name: "Environmental Design Consultants",
    slug: "environmental-design-consultants",
    href: "https://aak.or.ke/environmental-design-consultants-chapter/",
    image: "/img/edc.webp",
    definition:
      "An Environmental Design Consultant is a professional concerned with environmental issues related to construction projects, including air, land, water, renewable energy and waste management: assessing the environmental suitability of developments and recommending mitigation measures to promote sustainable construction across the built and natural environment.",
    tagline: "Promoting sustainable construction through expert environmental advisory.",
    footerTagline: "Commitment to Professional Integrity and Environmental Stewardship",
  },
  {
    name: "Construction Project Managers",
    slug: "construction-project-managers",
    href: "https://aak.or.ke/construction-project-management-chapter/",
    image: "/img/cpm.webp",
    definition:
      "A Construction Project Manager is a professional who oversees the planning, coordination and execution of construction projects from inception to completion: managing timelines, quality standards and resources, and coordinating project teams to ensure the functional and financial success of every development.",
    tagline: "Planning, coordinating, and controlling projects from inception to completion.",
    footerTagline: "Commitment to Professional Integrity and Efficient Project Delivery",
  },
  {
    name: "Interior Designers",
    slug: "interior-designers",
    href: "https://aak.or.ke/interior-designers-chapter/",
    image: "/img/interior-design.webp",
    definition:
      "An Interior Designer is a trained professional who designs functional and aesthetically pleasing interior spaces, with a strong understanding of design principles, space planning and building codes: collaborating with clients and consultants, and coordinating the selection and installation of materials, finishes, furniture and fixtures to ensure spatial excellence.",
    tagline: "Enhancing the human experience through technical precision and aesthetic harmony.",
    footerTagline: "Commitment to Professional Integrity and Architectural Excellence",
  },
];

export function getChapter(slug: string) {
  return chapters.find((chapter) => chapter.slug === slug);
}

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  /** Longer caption shown in the lightbox */
  caption: string;
  image: string;
  /** Optional external document (PDF, article) */
  href?: string;
  hrefLabel?: string;
  span: "wide" | "tall" | "regular";
}

// Photos from the AAK visit to the Nairobi Waldorf School, 24 July 2026:
// the school's pavilion won Best Africa (Re)presentation at the 2024
// Awards of Excellence.
export const media: MediaItem[] = [
  {
    id: "waldorf-group",
    title: "Nairobi Waldorf School visit",
    category: "Site visit",
    caption:
      "Members and guests beneath the school's timber-pole pavilion on 24 July 2026. The pavilion won Best Africa (Re)presentation at the 2024 Awards of Excellence.",
    image: "/img/waldorf-visit-2026/group-under-pavilion.webp",
    href: fileUrl("/documents/NAIROBI-WALDORF-SCHOOL-PROJECT.pdf"),
    hrefLabel: "Read the project brief (PDF)",
    span: "wide",
  },
  {
    id: "waldorf-talks",
    title: "Talks in the school hall",
    category: "Site visit",
    caption: "The visit opened with talks in the school's timber-trussed hall.",
    image: "/img/waldorf-visit-2026/talks-in-the-hall.webp",
    span: "regular",
  },
  {
    id: "waldorf-pavilion",
    title: "The award-winning pavilion",
    category: "Site visit",
    caption:
      "The pavilion's roof rests on a forest of timber poles among the site's trees. Winner, Best Africa (Re)presentation, 2024 Awards of Excellence.",
    image: "/img/waldorf-visit-2026/pavilion-exterior.webp",
    href: fileUrl("/documents/NAIROBI-WALDORF-SCHOOL-PROJECT.pdf"),
    hrefLabel: "Read the project brief (PDF)",
    span: "regular",
  },
  {
    id: "waldorf-classrooms",
    title: "Touring the classrooms",
    category: "Site visit",
    caption: "Walking the campus between the school's timber classroom buildings.",
    image: "/img/waldorf-visit-2026/touring-the-classrooms.webp",
    span: "regular",
  },
  {
    id: "waldorf-classroom-interior",
    title: "Inside a classroom",
    category: "Site visit",
    caption:
      "A classroom interior: timber walls, a band of clerestory glazing and woven pendant lights.",
    image: "/img/waldorf-visit-2026/classroom-interior.webp",
    span: "regular",
  },
  {
    id: "waldorf-play",
    title: "Play among the trees",
    category: "Site visit",
    caption: "The school's timber play structures, set among the trees.",
    image: "/img/waldorf-visit-2026/play-area.webp",
    span: "regular",
  },
];

/** Partner organisations listed on aak.or.ke's homepage. */
export interface Partner {
  name: string;
  abbreviation: string;
}

export const partners: Partner[] = [
  { name: "Africa Union of Architects", abbreviation: "AUA" },
  { name: "East Africa Institute of Architects", abbreviation: "EAIA" },
  { name: "Engineers Board of Kenya", abbreviation: "EBK" },
  { name: "International Federation of Landscape Architects", abbreviation: "IFLA" },
  { name: "International Society of City and Regional Planners", abbreviation: "ISOCARP" },
  { name: "International Union of Architects", abbreviation: "UIA" },
];

export interface Publication {
  title: string;
  meta: string;
  href: string;
}

export const publications: Publication[] = [
  {
    title: "Memorandum on the Finance Bill 2025",
    meta: "Policy submission · PDF",
    href: fileUrl("/documents/AAK-Memorandum-on-Finance-Bill-2025.pdf"),
  },
  {
    title: "AAK AGM Report 2025",
    meta: "Governance · PDF",
    href: fileUrl("/documents/AAK-AGM-Report-2025_compressed.pdf"),
  },
  {
    title: "BuildPress Magazine 2025",
    meta: "Magazine · PDF",
    href: fileUrl("/documents/AAK_BuildPress2025_Kisumu.pdf"),
  },
];

/* Arbitration ------------------------------------------------------- */
/** Arbitrator profiles live in @/data/arbitrators — sourced from AAK's own roster document. */

export interface ArbitrationStep {
  step: string;
  title: string;
  body: string;
}

export const arbitrationSteps: ArbitrationStep[] = [
  {
    step: "01",
    title: "Check the contract clause",
    body: "The Joint Building Council (JBC), established by AAK with the Kenya Association of Building and Civil Engineering Contractors, publishes the Standard Agreement and Conditions of Contract for Building Works used across the industry. Confirm the dispute-resolution clause in your contract before applying, whether it is a JBC, FIDIC or NCA form or an independently negotiated agreement: it governs what an arbitrator can decide.",
  },
  {
    step: "02",
    title: "Contact the secretariat",
    body: "Send a copy of the contract and a short description of the dispute to the AAK secretariat, so they can advise on the appointment process for your chapter and discipline.",
  },
  {
    step: "03",
    title: "Appointment",
    body: "Where a contract calls for AAK to nominate an arbitrator, the appointment is matched to the discipline of the dispute from members with relevant arbitration credentials.",
  },
  {
    step: "04",
    title: "Proceedings",
    body: "The arbitrator sets directions at a preliminary meeting: pleadings, documents, whether the matter proceeds on documents only or with a hearing, and the timetable to the award.",
  },
  {
    step: "05",
    title: "The award",
    body: "Awards made under the Arbitration Act, 1995 are final and binding, and enforceable through the High Court. Appeal is limited to the narrow grounds the Act allows.",
  },
];

/* Navigation -------------------------------------------------------- */

export interface NavLink {
  label: string;
  /** Internal route or external URL */
  href: string;
  external?: boolean;
}

export interface NavMenuGroup {
  label: string;
  description?: string;
  links: NavLink[];
}

/** Top-level header entries: a plain link, a text group panel, or the
 * initiatives panel (rendered from `initiatives` directly, with imagery). */
export type NavMenuEntry =
  ({ type: "link" } & NavLink) | ({ type: "group" } & NavMenuGroup) | { type: "initiatives" };

const MEMBER_PORTAL = "https://members.aak.or.ke";

/** AAK's sister platforms, listed under Key Initiatives on aak.or.ke. */
export const aakPlatforms: NavLink[] = [
  { label: "AAK Sacco", href: "https://sacco.aak.or.ke/", external: true },
  { label: "BuildHub", href: "https://buildhub.aak.or.ke/", external: true },
  { label: "AAK Annual Convention", href: "https://convention.aak.or.ke/", external: true },
  { label: "Nairobi Biennale", href: "https://www.biennale.aak.or.ke/", external: true },
];

export const navMenu: NavMenuEntry[] = [
  { type: "link", label: "Home", href: "/" },
  {
    type: "group",
    label: "About",
    links: [
      { label: "About us", href: "/about" },
      { label: "Programmes", href: "/programs" },
      { label: "Corporate social responsibility", href: "/csr" },
      { label: "AAK Leadership", href: "/team" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  { type: "link", label: "Coming up", href: "/events" },
  { type: "initiatives" },
  {
    type: "group",
    label: "Resources",
    description: "Reports, guidelines and member services.",
    links: [
      { label: "Resource centre", href: "/resources" },
      // Arbitration: on hold while the page is being finished. Re-add once ready.
      // { label: "Arbitration", href: "/arbitration" },
      { label: "Awards & honours", href: "/awards" },
      { label: "Media & archive", href: "/media" },
    ],
  },
  {
    type: "group",
    label: "Membership",
    description: "Join, renew and use your membership. Portal services open on members.aak.or.ke.",
    links: [
      { label: "Membership, tiers & fees", href: "/membership" },
      {
        label: "New membership registration",
        href: `${MEMBER_PORTAL}/application/registerv3`,
        external: true,
      },
      {
        label: "Renew your membership",
        href: `${MEMBER_PORTAL}/public/pay?for=MEMBERSHIP`,
        external: true,
      },
      { label: "Members directory", href: `${MEMBER_PORTAL}/directory`, external: true },
      { label: "Validate a certificate", href: `${MEMBER_PORTAL}/validate`, external: true },
      { label: "Job portal", href: `${MEMBER_PORTAL}/jobs/`, external: true },
      { label: "AAK Sacco", href: "https://sacco.aak.or.ke/", external: true },
      { label: "Student affiliates", href: "/students" },
    ],
  },
  { type: "link", label: "Store", href: "/store" },
];

export const utilityLinks: NavLink[] = [
  { label: "Register", href: `${MEMBER_PORTAL}/application/registerv3`, external: true },
  { label: "Renew membership", href: `${MEMBER_PORTAL}/public/pay?for=MEMBERSHIP`, external: true },
  { label: "Job portal", href: `${MEMBER_PORTAL}/jobs/`, external: true },
  { label: "Validate a certificate", href: `${MEMBER_PORTAL}/validate`, external: true },
];

/** Sign-in page of the members portal, used by the header's log-in button. */
export const memberPortalUrl = `${MEMBER_PORTAL}/signin`;

/* Team & governance --------------------------------------------------
 * Sourced from aak.or.ke/about-us/.
 */

export interface ChapterLead {
  chapter: string;
  chair: string;
}

export const chapterChairs: ChapterLead[] = [
  { chapter: "Architects Chapter", chair: "Kairu Jacqueline" },
  { chapter: "Quantity Surveyors Chapter", chair: "Moses Karani" },
  { chapter: "Town Planners Chapter", chair: "Christine Muchiri" },
  { chapter: "Engineers Chapter", chair: "Muguru Wairimu" },
  { chapter: "Landscape Architects Chapter", chair: "Anthony Kimondo" },
  { chapter: "Environmental Design Consultants Chapter", chair: "Njoroge Gladys" },
  { chapter: "Construction Project Managers Chapter", chair: "Ndindiri Waweru" },
  { chapter: "Interior Designers Chapter", chair: "Daisy Nyeresa" },
];

export const regionalBranches: ChapterLead[] = [
  { chapter: "Coast Branch", chair: "Duncan Odhiambo" },
  { chapter: "Western Region Branch", chair: "Oscar Ogunde (Interim)" },
  { chapter: "South Rift Branch", chair: "Kaggai Thiongo (Interim)" },
];

/**
 * AAK Secretariat. Most entries are the salaried operational staff who run
 * the Association's day-to-day affairs; the six Executive Council members
 * (President through Honorary Registrar) are sourced from
 * aak.or.ke/about-us/ and included here at the site owner's request,
 * even though that page lists them separately from the Secretariat proper.
 *
 * Photos and titles for most members are sourced from AAK's own internal
 * Secretariat photo set; the Executive Council members' photos are pulled
 * from aak.or.ke/about-us/ and listed in rank order (President through
 * Honorary Registrar), matching that page.
 */
export interface SecretariatMember {
  name: string;
  title: string;
  /** Only set when a photo could be confidently matched to this specific person — see note above. */
  photo?: string;
}

export const secretariat: SecretariatMember[] = [
  {
    name: "Jacob Mwangi",
    title: "Chief Executive Officer",
    photo: "/secretariat-photos/jacob-mwangi.jpg",
  },
  {
    name: "Arch. George Arabbu Ndege",
    title: "President",
    photo: "/secretariat-photos/george-arabbu-ndege.jpg",
  },
  {
    name: "Arch. Brenda Nyawara",
    title: "Vice President",
    photo: "/secretariat-photos/brenda-nyawara.jpg",
  },
  {
    name: "L/Arch. Ruth Mwai",
    title: "Honorary Secretary",
    photo: "/secretariat-photos/ruth-mwai.jpg",
  },
  {
    name: "Arch. Bernard Segecha",
    title: "Assistant Secretary",
    photo: "/secretariat-photos/bernard-segecha.jpg",
  },
  {
    name: "QS. Diana Musyoka",
    title: "Honorary Treasurer",
    photo: "/secretariat-photos/diana-musyoka.jpg",
  },
  {
    name: "Eng. Nashon O. Tambo",
    title: "Honorary Registrar",
    photo: "/secretariat-photos/nashon-tambo.jpg",
  },
  {
    name: "Sheila Okongo",
    title: "Membership Officer",
    photo: "/secretariat-photos/sheila-okongo.jpg",
  },
  {
    name: "John Githui",
    title: "Finance Officer",
    photo: "/secretariat-photos/john-githui.jpg",
  },
  {
    name: "Michelle Ouma",
    title: "Research and Advocacy Manager",
    photo: "/secretariat-photos/michelle-ouma.jpg",
  },
  {
    name: "Mary Ngaruiya",
    title: "Advocacy Officer",
    photo: "/secretariat-photos/mary-ngaruiya.jpg",
  },
  {
    name: "Alex Otieno",
    title: "Research Officer",
    photo: "/secretariat-photos/alex-otieno.jpg",
  },
  {
    name: "Boyani Momanyi",
    title: "Communication Officer",
    photo: "/secretariat-photos/boyani-momanyi.jpg",
  },
  {
    name: "Erick Omollo",
    title: "Office Assistant",
    photo: "/secretariat-photos/erick-omollo.jpg",
  },
];

/** College of Fellows 2026 — the highest honour AAK bestows on members. */
export const collegeOfFellows: string[] = [
  "Kebathi Stanley",
  "Prof Alfred Omenya",
  "Prof. Maringa Paul",
  "Eshani Mehraz",
  "Oundo Steven",
  "Musyoki Norbert",
  "Gathecha Waweru",
  "Mutiso Reuben",
  "Njendu James",
  "Magutu Gerald",
  "Mulyungi Gideon",
  "Munyanya Mohammed",
  "Sika Philip",
  "Kungu Philip",
  "Ndong Jeremiah",
  "Karuri Lee",
  "Mwangi Benson",
  "Gitoho James",
  "Cavanagh Jon Anthony",
  "Simu Allan",
  "Kimathi James",
  "Oino Evans Juma",
  "Mugure Njendu",
  "Prof. Kibue Susan",
  "Emma Miloyo",
  "Masu Sylvester",
  "Ogoda James",
  "Gichunge Hezekiah",
  "F. Kairu Bachia",
  "Hajee Bashir",
  "Aluvaala Alfred",
  "Gichuiri Onesimus",
  "Kimoro Daniel",
  "Kimani Mathu",
  "Muchungu Anna",
  "Murage Stanley",
  "Njuguna David",
  "Chanzu Yusuf",
  "Oketch Tom",
  "Kagondu Grace",
  "Matalanga Nathaniel",
  "Mangat Harcharan",
  "Goro Evans",
  "Hirani Ratna",
  "Kitololo Austin",
  "Odinga Raila",
  "Otwani Justus",
  "Kimeu Musau",
  "Njau Gilbert",
  "Masinde Augustine",
  "Mehta Hitesh",
];

/** The nine judged categories of the AAK-Basco DuraCoat Awards of Excellence. */
export const awardCategories = [
  {
    name: "Best Africa (Re)presentation",
    description:
      "Entries in this category should demonstrate a meaningful and contemporary interpretation of African cultural identity. Submissions are expected to draw inspiration from local ways of life, tradition and culture, materials, artefacts, patterns, and environmental knowledge systems. Projects must articulate how these references have informed the design approach, resulting in architecture that resonates with regional relevance and expresses African heritage in a clear and intentional manner.",
  },
  {
    name: "Best Commercial Project",
    description:
      "This category recognizes commercial developments that excel in functionality, spatial organization, user experience and contextual integration. Submissions must clearly demonstrate how the design supports commercial operations, enhances productivity or customer engagement, and responds sensitively to its physical and socio-economic setting. Consideration is given to environmental performance, material strategy and the project's overall contribution to its urban and natural environment.",
  },
  {
    name: "Best Empowerment and Social Equity Through Design",
    description:
      "Submissions must illustrate how architectural design has directly enhanced dignity, accessibility, inclusion and livelihood opportunities for underserved or marginalized communities. Projects should highlight built-form solutions that improve participation, safety, equity and long-term community resilience. Emphasis is placed on tangible design interventions that uplift vulnerable populations and support social transformation.",
  },
  {
    name: "Best Hospitality Project",
    description:
      "This category recognizes hotels, lodges, resorts and other guest-focused environments that deliver exceptional spatial quality, comfort and place-specific experience. Submissions should highlight how the design integrates with its landscape or urban setting, enhances ambience, and supports intuitive movement and relaxation. Priority is given to thoughtful material choices, environmental responsiveness, and memorable, context-driven hospitality environments.",
  },
  {
    name: "Best Institutional Project",
    description:
      "This category recognizes institutional projects, including educational facilities, healthcare centers, government buildings, cultural institutions and community facilities, that excel in functionality, spatial organization, user experience and contextual integration. Consideration is given to environmental performance, material strategy, durability for public use, and the project's overall contribution to its urban and natural environment.",
  },
  {
    name: "Best Religious / Monumental Project",
    description:
      "Entries should exemplify architecture that carries symbolic, spiritual or cultural significance, including churches, mosques, temples, meditation centers and monumental civic structures. Submissions are expected to show how form, materiality, procession, light and spatial organization work together to evoke meaning, support ritual practices and serve the surrounding community with dignity and clarity.",
  },
  {
    name: "Best Interior Environment",
    description:
      "Submissions in this category must demonstrate refined and innovative interior design that enhances the function, atmosphere and comfort of indoor spaces, illustrating effective spatial planning, material selection, lighting strategies, furniture integration, ventilation considerations and overall aesthetic harmony.",
  },
  {
    name: "Best Residential Project",
    description:
      "This category recognizes exemplary residential design, from single family homes to multi-unit housing and residential developments, that successfully combines aesthetics, functionality, climatic responsiveness and contextual harmony, highlighting thoughtful spatial organization, material interplay and relationship to landscape.",
  },
  {
    name: "Best Student Project",
    description:
      "Submissions must be conceptual work produced by students enrolled in accredited architecture programs, demonstrating strong conceptual grounding, clear articulation of design principles, contextual awareness, sustainability considerations and high-quality presentation.",
  },
];

export interface AwardWinner {
  project: string;
  category: string;
  result: string;
  image: string;
  pdfHref: string;
}

/** 2024 cycle results, as published on the /awards page. */
export const awardWinners2024: AwardWinner[] = [
  {
    project: "The Agora",
    category: "Best Student Project",
    result: "Winner",
    image: "/img/screenshot-2026-06-08-164835.webp",
    pdfHref: fileUrl("/documents/THE-AGORA-PROJECT.pdf"),
  },
  {
    project: "Kigandani Industrial Hub",
    category: "Best Student Project",
    result: "1st Runner-up",
    image: "/img/screenshot-2026-06-08-164317.webp",
    pdfHref: fileUrl("/documents/KIGANDANI-INDUSTRIAL-HUB-PROJECT.pdf"),
  },
  {
    project: "Mombasa Ferry Terminal",
    category: "Best Student Project",
    result: "2nd Runner-up",
    image: "/img/screenshot-2026-06-08-163554.webp",
    pdfHref: fileUrl("/documents/MOMBASA-FERRY-TERMINAL-PROJECT.pdf"),
  },
  {
    project: "Mzizi ECD Centre",
    category: "Best Student Project",
    result: "Honorable Mention",
    image: "/img/screenshot-2026-05-07-091425.webp",
    pdfHref: fileUrl("/documents/MZIZI-ECD-CENTRE-PROJECT.pdf"),
  },
  {
    project: "Kenya Advanced Institute of Science and Technology",
    category: "Best Institutional Project",
    result: "Honorable Mention",
    image: "/img/screenshot-2026-05-06-170210.webp",
    pdfHref: fileUrl("/documents/KENYA-ADVANCED-INSTITUTE-OF-SCIENCE-OF-TECHNOLOGY-PROJECT.pdf"),
  },
  {
    project: "Lodwar Referral Hospital",
    category: "Best Institutional Project",
    result: "Honorable Mention",
    image: "/img/screenshot-2026-06-08-132017-e1780914111723.webp",
    pdfHref: fileUrl("/documents/LODWAR-REFERRAL-HOSPITAL-PROJECT.pdf"),
  },
  {
    project: "Wajir County Referral Hospital",
    category: "Best Institutional Project",
    result: "Honorable Mention",
    image: "/img/screenshot-2026-05-06-152302.webp",
    pdfHref: fileUrl("/documents/WAJIR-REFERRAL-HOSPITAL.pdf"),
  },
  {
    project: "Skanem",
    category: "Best Commercial Project",
    result: "Honorable Mention",
    image: "/img/screenshot-2026-06-08-161321.webp",
    pdfHref: fileUrl("/documents/SKANEM-PROJECT.pdf"),
  },
  {
    project: "Global Trade Center",
    category: "Best Commercial Project",
    result: "Honorable Mention",
    image: "/img/screenshot-2026-05-06-142005.webp",
    pdfHref: fileUrl("/documents/GLOBAL-TRADE-CENTRE-PROJECT.pdf"),
  },
  {
    project: "The Bidi Bidi Music and Arts Centre",
    category: "Best Empowerment and Social Equity Through Design",
    result: "Winner",
    image: "/img/screenshot-2026-05-06-131531.webp",
    pdfHref: fileUrl("/documents/THE-BIDI-BIDI-PERFORMING-ARTS-CENTRE-PROJECT.pdf"),
  },
  {
    project: "Ufi at Kahawa Soweto Settlement",
    category: "Best Empowerment and Social Equity Through Design",
    result: "Runner-up",
    image: "/img/screenshot-2026-06-08-153946.webp",
    pdfHref: fileUrl("/documents/URBAN-FABRIC-INITIATIVE-PROJECT.pdf"),
  },
  {
    project: "Standard Chartered Bank HQ",
    category: "Best Interior Environment",
    result: "Winner",
    image: "/img/screenshot-2026-06-08-152537.webp",
    pdfHref: fileUrl("/documents/STANDARD-CHATERED-BANK-HQ-PROJECT.pdf"),
  },
  {
    project: "Lady of Victoria Monastery",
    category: "Best Religious / Monumental",
    result: "Winner",
    image: "/img/screenshot-2026-06-08-150532.webp",
    pdfHref: fileUrl("/documents/OUR-LADY-VICTORIA-MONASTERY-PROJECT.pdf"),
  },
  {
    project: "Nairobi Waldorf School",
    category: "Best Africa (Re)presentation",
    result: "Winner",
    image: "/img/waldorf-visit-2026/award-pavilion.webp",
    pdfHref: fileUrl("/documents/NAIROBI-WALDORF-SCHOOL-PROJECT.pdf"),
  },
  {
    project: "Lodwar Referral Hospital",
    category: "Best Africa (Re)presentation",
    result: "Juror's Honourable Mention",
    image: "/img/screenshot-2026-06-08-132017-e1780914111723.webp",
    pdfHref: fileUrl("/documents/LODWAR-REFERRAL-HOSPITAL-PROJECT.pdf"),
  },
  {
    project: "The Bidi Bidi Music and Arts Centre",
    category: "Best Africa (Re)presentation",
    result: "Juror's Choice Honorable Mention",
    image: "/img/screenshot-2026-05-06-131531.webp",
    pdfHref: fileUrl("/documents/THE-BIDI-BIDI-PERFORMING-ARTS-CENTRE-PROJECT.pdf"),
  },
];

/** Membership categories and fees in KES, as listed on /membership. */
export const membershipFees: { category: string; entrance: string; annual: string }[] = [
  { category: "Corporate", entrance: "1,000.00", annual: "7,500.00" },
  { category: "Licentiate", entrance: "1,000.00", annual: "5,500.00" },
  { category: "Graduate", entrance: "600.00", annual: "3,750.00" },
  { category: "Student", entrance: "None", annual: "500.00" },
  { category: "Firm", entrance: "2,000.00", annual: "15,000.00" },
  { category: "Technician", entrance: "600.00", annual: "1,500.00" },
  { category: "Visiting", entrance: "None", annual: "75,000.00" },
  { category: "Institutional Members", entrance: "5,000.00", annual: "50,000.00" },
];

/** Member firm featured on the homepage, as showcased on aak.or.ke. Swap the
 * entry to feature a different firm. */
export interface FeaturedFirm {
  name: string;
  photo: { src: string; alt: string; caption: string };
  intro: string;
  projects: { name: string; image: string; facts: { label: string; value: string }[] }[];
}

export const featuredFirm: FeaturedFirm = {
  name: "DMJ Architects",
  photo: {
    src: "/img/featured-firm/dmj-recognition.webp",
    alt: "DMJ Architects receiving a plaque of recognition from AAK at the DMJ office",
    caption: "Receiving AAK’s plaque of recognition",
  },
  intro:
    "Founded by Robert Marshall in 1965, DMJ Architects is a Nairobi based firm renowned for exceptional design in sensitive environment landscapes such as the Serengeti National Park and the Kenyan Coast.",
  projects: [
    {
      name: "Galleria Gardens",
      image: "/img/featured-firm/galleria-gardens.webp",
      facts: [
        { label: "Scope", value: "Large Scale Residential" },
        { label: "Status", value: "Successfully Completed" },
      ],
    },
    {
      name: "Swiss Chancery Nairobi",
      image: "/img/featured-firm/swiss-chancery.webp",
      facts: [
        { label: "Chapter", value: "Architects Chapter" },
        { label: "Status", value: "Award of Excellence" },
      ],
    },
    {
      name: "Buffalo Mall",
      image: "/img/featured-firm/buffalo-mall.webp",
      facts: [
        { label: "Location", value: "Naivasha, Kenya" },
        { label: "Scope", value: "Commercial Development" },
      ],
    },
  ],
};
