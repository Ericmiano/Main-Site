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
    image: "https://aak.or.ke/wp-content/uploads/2025/05/0Q9A0926-1200x800.jpg",
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
    image: "https://www.biennale.aak.or.ke/assets/images/carousel/carousel_1.webp",
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
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
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
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
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
    image: "https://aak.or.ke/wp-content/uploads/2025/05/0Q9A0926-1200x800.jpg",
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
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
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
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
    tone: "primary",
  },
  {
    id: "grow-a-classroom",
    slug: "grow-a-classroom",
    eyebrow: "Professional CSR",
    title: "Grow A Classroom",
    description:
      "Master plans, landscaping and classrooms built from mature on-site timber for under-served schools, paired with tree planting to grow national tree cover and carbon credits.",
    href: "https://aak.or.ke/grow-a-classroom/",
    cta: "Explore the project",
    image: "/grow-a-classroom-mabokoni/img-2307.jpg",
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
    cta: "View guidelines",
    image: "https://aak.or.ke/wp-content/uploads/2025/05/0Q9A0926-1200x800.jpg",
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
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
    tone: "green",
  },
  {
    id: "urban-thinkers-campus",
    slug: "urban-thinkers-campus",
    eyebrow: "Urban policy platform",
    title: "Urban Thinkers Campus",
    description:
      "An open platform for critical exchange between urban researchers, professionals and decision-makers, run with UN-Habitat since 2020.",
    href: "https://aak.or.ke/urban-thinkers-campus/",
    cta: "Explore the platform",
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
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
    image: "https://aak.or.ke/wp-content/uploads/2026/03/arch-scaled.webp",
    definition:
      "An Architect is a professional trained in the design and construction of buildings and structures that primarily provide shelter: preparing designs, coordinating with contractors and consultants, and certifying construction compliance with approved standards.",
    tagline: "Architecture is the science and art of building.",
    footerTagline: "Commitment to Professional Integrity and Architectural Excellence",
  },
  {
    name: "Quantity Surveyors",
    slug: "quantity-surveyors",
    href: "https://aak.or.ke/quantity-surveyors-chapter/",
    image: "https://aak.or.ke/wp-content/uploads/2026/03/QS.png",
    definition:
      "A Quantity Surveyor is a professional who provides expert advice on construction costs, ensuring that proposed projects are affordable and offer value for money: preparing cost estimates, managing project costs, advising on contractual matters and supporting dispute resolution.",
    tagline: "The essential link between client commission and building completion.",
    footerTagline: "Commitment to Professional Integrity and Economic Stewardship",
  },
  {
    name: "Town Planners",
    slug: "town-planners",
    href: "https://aak.or.ke/town-planners-chapter/",
    image: "https://aak.or.ke/wp-content/uploads/2026/03/TPC.jpg-scaled.jpeg",
    definition:
      "A Town Planner is a trained professional who develops plans and programmes for land use and urban development: assessing development feasibility, reviewing proposals, advising planning authorities and ensuring compliance with zoning regulations.",
    tagline: "Providing harmony and efficiency among diverse activities within the town or region.",
    footerTagline: "Commitment to Professional Integrity and Sustainable Urban Growth",
  },
  {
    name: "Engineers",
    slug: "engineers",
    href: "https://aak.or.ke/engineers-chapter/",
    image: "https://aak.or.ke/wp-content/uploads/2026/03/Eng.png",
    definition:
      "An Engineer is a trained professional concerned with the design and physical integrity of buildings, ensuring their safety, stability and durability: preparing detailed structural designs and drawings, and conducting site investigations to ensure compliance with technical and safety standards across the built landscape.",
    tagline: "Ensuring structural safety, stability, and durability in the built environment.",
    footerTagline: "Commitment to Professional Integrity and Structural Excellence",
  },
  {
    name: "Landscape Architects",
    slug: "landscape-architects",
    href: "https://aak.or.ke/landscape-architects-chapter/",
    image: "https://aak.or.ke/wp-content/uploads/2026/03/Landscape.jpeg",
    definition:
      "A Landscape Architect is a trained professional who designs outdoor spaces such as parks, public areas and private gardens: organising land features and selecting materials to maintain the ecological and aesthetic health of the built and natural environment.",
    tagline: "Conserving and improving the natural environment through sound design and planning.",
    footerTagline: "Commitment to Professional Integrity and Natural Conservation",
  },
  {
    name: "Environmental Design Consultants",
    slug: "environmental-design-consultants",
    href: "https://aak.or.ke/environmental-design-consultants-chapter/",
    image: "https://aak.or.ke/wp-content/uploads/2026/03/EDC.JPG-scaled.jpeg",
    definition:
      "An Environmental Design Consultant is a professional concerned with environmental issues related to construction projects, including air, land, water, renewable energy and waste management: assessing the environmental suitability of developments and recommending mitigation measures to promote sustainable construction across the built and natural environment.",
    tagline: "Promoting sustainable construction through expert environmental advisory.",
    footerTagline: "Commitment to Professional Integrity and Environmental Stewardship",
  },
  {
    name: "Construction Project Managers",
    slug: "construction-project-managers",
    href: "https://aak.or.ke/construction-project-management-chapter/",
    image: "https://aak.or.ke/wp-content/uploads/2026/03/CPM.jpeg",
    definition:
      "A Construction Project Manager is a professional who oversees the planning, coordination and execution of construction projects from inception to completion: managing timelines, quality standards and resources, and coordinating project teams to ensure the functional and financial success of every development.",
    tagline: "Planning, coordinating, and controlling projects from inception to completion.",
    footerTagline: "Commitment to Professional Integrity and Efficient Project Delivery",
  },
  {
    name: "Interior Designers",
    slug: "interior-designers",
    href: "https://aak.or.ke/interior-designers-chapter/",
    image: "https://aak.or.ke/wp-content/uploads/2026/03/Interior-design-scaled.webp",
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

export const media: MediaItem[] = [
  {
    id: "agora",
    title: "The Agora: Best Student Project",
    category: "Awards",
    caption:
      "A civic gathering space organised around a stepped public court. Awarded Best Student Project at the Awards of Excellence.",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-164835.png",
    href: "/documents/THE-AGORA-PROJECT.pdf",
    hrefLabel: "Read the project brief (PDF)",
    span: "wide",
  },
  {
    id: "kigandani",
    title: "Kigandani Industrial Hub",
    category: "Student project",
    caption:
      "A light-industrial cluster planned around shared loading yards and a stormwater spine, submitted to the student category.",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-164317.png",
    href: "/documents/KIGANDANI-INDUSTRIAL-HUB-PROJECT.pdf",
    hrefLabel: "Read the project brief (PDF)",
    span: "regular",
  },
  {
    id: "ferry",
    title: "Mombasa Ferry Terminal",
    category: "Student project",
    caption:
      "A terminal proposal handling pedestrian and vehicle ferry traffic on a single tidal frontage, with shaded queuing halls.",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-163554.png",
    href: "/documents/MOMBASA-FERRY-TERMINAL-PROJECT.pdf",
    hrefLabel: "Read the project brief (PDF)",
    span: "regular",
  },
  {
    id: "kenyatta-institute",
    title: "Kenya Advanced Institute of Science and Technology",
    category: "Institutional",
    caption:
      "Laboratory and teaching blocks arranged around a shaded research quadrangle, with servicing routed below the deck.",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-05-06-170210.png",
    href: "/documents/KENYA-ADVANCED-INSTITUTE-OF-SCIENCE-OF-TECHNOLOGY-PROJECT.pdf",
    hrefLabel: "Read the project brief (PDF)",
    span: "tall",
  },
  {
    id: "build-tour",
    title: "Build Tour, on site",
    category: "Events",
    caption:
      "Members on a live Nairobi site during the Build Tour, walking the structural frame with the resident engineer.",
    image: "https://aak.or.ke/wp-content/uploads/2021/08/AAK-BUILD-TOUR-66-1200x800-600x400-1.jpg",
    span: "regular",
  },
  {
    id: "mzizi",
    title: "Mzizi ECD Centre",
    category: "Grow A Classroom",
    caption:
      "An early-childhood centre built with local artisans under member supervision, part of the Grow A Classroom programme.",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-05-07-091425.png",
    href: "/documents/MZIZI-ECD-CENTRE-PROJECT.pdf",
    hrefLabel: "Read the project brief (PDF)",
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
    href: "/documents/AAK-Memorandum-on-Finance-Bill-2025.pdf",
  },
  {
    title: "AAK AGM Report 2025",
    meta: "Governance · PDF",
    href: "/documents/AAK-AGM-Report-2025_compressed.pdf",
  },
  {
    title: "BuildPress Magazine 2025",
    meta: "Magazine · PDF",
    href: "/documents/AAK_BuildPress2025_Kisumu.pdf",
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
  description: string;
  links: NavLink[];
}

/** Top-level header entries: a plain link, a text group panel, or the
 * initiatives panel (rendered from `initiatives` directly, with imagery). */
export type NavMenuEntry =
  ({ type: "link" } & NavLink) | ({ type: "group" } & NavMenuGroup) | { type: "initiatives" };

export const navMenu: NavMenuEntry[] = [
  { type: "link", label: "Home", href: "/" },
  {
    type: "group",
    label: "About",
    description: "Who we are and how to get involved.",
    links: [
      { label: "About us", href: "/about" },
      { label: "Membership", href: "/membership" },
      { label: "Programmes", href: "/programs" },
      { label: "Corporate social responsibility", href: "/csr" },
      { label: "The team", href: "/team" },
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
      // Arbitration: on hold while the system behind it is still being built. Re-add once ready.
      // { label: "Arbitration", href: "/arbitration" },
      { label: "Awards & honours", href: "/awards" },
      { label: "Student affiliates", href: "/students" },
      {
        label: "Members directory",
        href: "https://members.aak.or.ke/directory",
        external: true,
      },
      {
        label: "Validate a certificate",
        href: "https://members.aak.or.ke/validate",
        external: true,
      },
    ],
  },
  { type: "link", label: "Media", href: "/#media" },
  { type: "link", label: "Store", href: "/store" },
];

export const utilityLinks: NavLink[] = [
  { label: "Members directory", href: "https://members.aak.or.ke/directory", external: true },
  { label: "Validate a certificate", href: "https://members.aak.or.ke/validate", external: true },
  { label: "aak@aak.or.ke", href: "mailto:aak@aak.or.ke", external: true },
];

export const memberPortalUrl = "https://members.aak.or.ke/";

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
    title: "Assistant Sec.",
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
