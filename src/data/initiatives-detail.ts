/** Detailed initiative content for /initiatives/$slug — sourced from aak.or.ke. */

export interface InitiativeStat {
  label: string;
  value: string;
}

export interface InitiativeGalleryImage {
  src: string;
  alt: string;
}

export interface InitiativeDocument {
  title: string;
  href: string;
}

export type InitiativeVideo =
  | {
      kind: "youtube";
      /** YouTube embed src, e.g. https://www.youtube.com/embed/VIDEO_ID or .../embed/videoseries?list=PLAYLIST_ID */
      src: string;
      title: string;
    }
  | {
      kind: "file";
      /** Self-hosted video, served from /public — keep well under Cloudflare's 25MiB per-file limit. */
      src: string;
      title: string;
    };

/** A single dated site visit / event under an initiative — its own titled
 * section with an optional video and photos. Add one entry per future event. */
export interface InitiativeEvent {
  title: string;
  /** Human-readable date, e.g. "16 September 2026" */
  date?: string;
  video?: InitiativeVideo;
  gallery: InitiativeGalleryImage[];
}

export interface InitiativeAudioClip {
  label: string;
  src: string;
}

export interface InitiativeContact {
  label: string;
  value: string;
  href: string;
}

export interface InitiativeDetail {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  body: string[];
  stats: InitiativeStat[];
  image: string;
  imageAlt: string;
  /** Untitled photo gallery — for initiatives without a specific dated event to name. */
  gallery?: InitiativeGalleryImage[];
  /** One titled section per dated site visit / event (e.g. a school trip), each with its own optional video and photos. */
  events?: InitiativeEvent[];
  documents?: InitiativeDocument[];
  /** First entry is used as the hero's featured video; any others show in a "More video" list. */
  videos?: InitiativeVideo[];
  audio?: InitiativeAudioClip[];
  contacts?: InitiativeContact[];
  tone: "primary" | "green";
}

export const initiativeDetails: InitiativeDetail[] = [
  {
    slug: "mulika-mjengo",
    eyebrow: "Public safety advocacy",
    title: "Mulika Mjengo",
    summary:
      "A public policing initiative by AAK, designed to empower citizens to identify and report structural hazards and illegal construction.",
    body: [
      "Mulika Mjengo empowers the public to identify potential structural failures before they occur, and to check that construction sites display the mandatory site boards and professional registration required by law.",
      "The initiative promotes the use of qualified professionals across AAK's eight chapters, and facilitates multi-agency inspections in partnership with the National Construction Authority (NCA) and county governments, turning a public report into a technical inspection, and a technical inspection into enforcement action.",
      "It was launched as the practical, reporting arm of the wider Je Una Mjengo? sensitisation campaign during the 2023 campaign cycle, giving the public a direct policing platform for illegal and poorly constructed buildings in Nairobi County.",
    ],
    stats: [
      { label: "Objective", value: "Report unsafe buildings" },
      { label: "Objective", value: "Ensure site compliance" },
      { label: "Partners", value: "NCA & County Governments" },
      { label: "Coverage", value: "Nairobi County (initial rollout)" },
    ],
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
    imageAlt: "AAK members inspecting a construction site",
    documents: [
      {
        title: "Mulika Mjengo Initiative",
        href: "/documents/MULIKA-MJENGO-INITIATIVE.pdf",
      },
    ],
    contacts: [
      { label: "Email", value: "aak@aak.or.ke", href: "mailto:aak@aak.or.ke" },
      { label: "Phone / WhatsApp", value: "0721 691 337", href: "tel:+254721691337" },
      { label: "Instagram", value: "@arch_ke", href: "https://www.instagram.com/arch_ke" },
      { label: "X (Twitter)", value: "@arch_ke", href: "https://x.com/Arch_KE" },
    ],
    tone: "primary",
  },
  {
    slug: "je-una-mjengo",
    eyebrow: "Public sensitisation",
    title: "Je, Una Mjengo?",
    summary:
      "A sensitisation drive run by AAK aimed at raising public awareness of safe buildings and construction practices by engaging the right professionals.",
    body: [
      "Je, Una Mjengo? (Swahili for \"do you have a building project?\") is AAK's public-facing campaign encouraging Kenyans to engage registered professionals from the outset of any building project, rather than after problems appear. It is one of AAK's key objectives in action: creating public awareness within the built and natural environment.",
      "During the 2023 campaign, AAK launched the Mulika Mjengo reporting platform, giving the public a direct route to flag illegal or poorly constructed buildings in Nairobi County for inspection.",
      "The campaign has run alongside a published report, campaign videos and radio coverage across multiple Kenyan stations, including Bahari FM, Kameme FM, Radio Citizen, Musyi FM, Mulembe FM and Egesa FM, extending its reach well beyond Nairobi's built-up areas.",
    ],
    stats: [{ label: "Format", value: "Print, radio and on-site campaigns" }],
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
    imageAlt: "AAK public awareness campaign materials",
    gallery: [
      {
        src: "https://aak.or.ke/wp-content/uploads/2026/02/Uthiru-collapse.jpeg",
        alt: "Aftermath of a building collapse in Uthiru, cited as a Mulika Mjengo case",
      },
      {
        src: "https://aak.or.ke/wp-content/uploads/2026/02/Radio-Citizen-pic-scaled.jpeg",
        alt: "Radio Citizen coverage of the Je Una Mjengo campaign",
      },
      {
        src: "https://aak.or.ke/wp-content/uploads/2026/02/Kamulu-MM-10-HP-HP-HP-HP-HP.jpg",
        alt: "Mulika Mjengo site inspection in Kamulu",
      },
    ],
    documents: [
      {
        title: "Je Una Mjengo Campaign Report",
        href: "/documents/Je-Una-Mjengo-Campaign.pdf",
      },
    ],
    videos: [
      {
        kind: "youtube",
        src: "https://www.youtube.com/embed/videoseries?list=PL2WvnH1y-v8NaAe9xYULHnlZpw3focI8J",
        title: "Je Una Mjengo? Campaign Videos",
      },
    ],
    audio: [
      { label: "Bahari FM", src: "/documents/Bahari-FM.mp3" },
      { label: "Kameme FM — 11th April", src: "/documents/AAK-Kameme-FM-11th-April.mp3" },
      {
        label: "Radio Citizen — Collapsing Buildings",
        src: "/documents/Radio-Citizen-on-Collapsing-Buildings.mp3",
      },
      { label: "Musyi FM", src: "/documents/Musyi-FM-AAK.mp3" },
      { label: "Mulembe FM — News Story", src: "/documents/Mulembe-FM-News-story.mp3" },
      { label: "Egesa FM", src: "/documents/Egesa-FM.mp3" },
    ],
    tone: "primary",
  },
  {
    slug: "grow-a-classroom",
    eyebrow: "Professional CSR",
    title: "Grow A Classroom",
    summary:
      "A ten-year programme tackling dilapidated infrastructure in Kenya's public schools through master planning, on-site timber construction and tree planting.",
    body: [
      "Grow A Classroom responds to poor conditions across Kenya's public schools (dilapidated infrastructure, insufficient ventilation and site encroachment) with comprehensive master plans that give each school a logical layout and room for future expansion.",
      "Classrooms and furniture are built using mature wood from trees planted on site, closing the loop between landscaping and construction: schools plant wood, ornamental and fruit trees for shade and outdoor learning, then that same timber becomes building material as it matures.",
      "The programme layers in a sustainability incentive: monetising carbon credits from the tree cover to create a recurring revenue stream for the schools involved, rather than a one-off donation.",
      "AAK is actively seeking partners to roll the programme out across all 47 counties in Kenya.",
      "The programme's site visit to Mabokoni Primary School brought AAK members together with pupils and staff to hand over certificates and mark progress on the ground.",
    ],
    stats: [
      { label: "Target", value: "55,000 schools over 10 years" },
      { label: "Land targeted", value: "300,000 acres" },
      { label: "Goal", value: "Push tree cover beyond 12%" },
    ],
    image: "/grow-a-classroom-mabokoni/img-2307.jpg",
    imageAlt:
      "AAK members and pupils at Mabokoni Primary School celebrating the Grow A Classroom programme",
    videos: [
      {
        kind: "youtube",
        src: "https://www.youtube.com/embed/oQSN4t1yPAM",
        title: "The Grow A Classroom Project by AAK",
      },
    ],
    events: [
      {
        title: "Mabokoni Primary School",
        date: "16 September 2026",
        video: {
          kind: "file",
          src: "/grow-a-classroom-mabokoni/day-1-landscape.mp4",
          title: "Mabokoni Primary School site visit",
        },
        gallery: [
          {
            src: "/grow-a-classroom-mabokoni/img-1839.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-1896.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-1911.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-1912.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-1952.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-1981.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2005.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2038.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2052.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2103.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2135.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2151.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2164.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2171.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2188.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2191.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2213.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2218.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2282.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2288.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2294.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2309.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2317.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2333.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2340.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2364.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2368.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2374.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2388.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2393.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2428.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2444.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2446.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2449.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2489.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2511.jpg",
            alt: "Mabokoni Primary School site visit",
          },
          {
            src: "/grow-a-classroom-mabokoni/img-2547.jpg",
            alt: "Mabokoni Primary School site visit",
          },
        ],
      },
    ],
    tone: "primary",
  },
  {
    slug: "safari-green-building-index",
    eyebrow: "Sustainability rating",
    title: "Safari Green Building Index",
    summary:
      "A national rating system developed by AAK to assess and promote resource-efficient building practices across all climatic zones in East Africa.",
    body: [
      "Rather than adapting a temperate-climate rating tool, the Safari Green Building Index was built for East African conditions: scoring buildings across six performance categories and awarding a class from D (baseline) to A (platinum performance).",
      "Passive design strategies (orientation, light and ventilation) carry the heaviest weighting at 45%, followed by resource efficiency (water, local materials and waste) at 30%, energy efficiency (equipment and renewables) at 10%, and building landscape, noise control & acoustics, and innovation at 5% each.",
      "A project scoring 80–100 points earns Class A, described as platinum performance in sustainable development; 70–79 is Class B, a gold standard in resource efficiency and design; 60–69 is Class C, silver recognition for significant green initiatives; and 50–59 is Class D, the certified baseline for environmentally conscious building.",
    ],
    stats: [
      { label: "Passive design", value: "45% weighting" },
      { label: "Resource efficiency", value: "30% weighting" },
      { label: "Energy efficiency", value: "10% weighting" },
      { label: "Building landscape", value: "5% weighting" },
      { label: "Noise control & acoustics", value: "5% weighting" },
      { label: "Innovation", value: "5% weighting" },
    ],
    image: "https://aak.or.ke/wp-content/uploads/2025/05/0Q9A0926-1200x800.jpg",
    imageAlt: "A sustainably designed building facade",
    documents: [
      {
        title: "Safari Green Building Index — Official Rating Guide",
        href: "/documents/Safari-Green-Building-Index-Rating_2019.pdf",
      },
    ],
    tone: "green",
  },
  {
    slug: "healthy-homes-guidelines",
    eyebrow: "Public health & housing",
    title: "Healthy Homes Guidelines",
    summary:
      "Guidelines developed with Habitat for Humanity International addressing sick-building conditions in Nairobi's informal settlements, in fifteen pillars.",
    body: [
      "An assessment of the impact of COVID-19, conducted by AAK and Habitat for Humanity International (HFHI) in informal settlements within the Nairobi Metropolitan Region, found it was very challenging for residents to comply with prevention protocols such as regular hand washing, due to inadequate water supply, and social distancing, in single-room dwellings.",
      "Most buildings surveyed were found to suffer from sick building syndrome, a cause of numerous illnesses experienced by residents who are often completely unaware of the underlying, building-related cause.",
      "In response, AAK and HFHI developed the Healthy Homes Guidelines and Checklist framework, identifying fifteen pillars for achieving healthy housing. It is published alongside a Pecha Kucha report, giving practitioners and community organisers a working tool rather than a purely academic framework.",
    ],
    stats: [
      { label: "Framework", value: "15 pillars" },
      { label: "Partner", value: "Habitat for Humanity International" },
    ],
    image: "https://aak.or.ke/wp-content/uploads/2026/02/Launch-of-HHGC-scaled.webp",
    imageAlt: "Launch of the Healthy Homes Guidelines and Checklist",
    gallery: [
      {
        src: "https://aak.or.ke/wp-content/uploads/2026/02/WHD18.webp",
        alt: "World Habitat Day activities tied to the Healthy Homes Guidelines",
      },
      {
        src: "https://aak.or.ke/wp-content/uploads/2026/02/Building-a-healthy-home-in-Homabay.webp",
        alt: "Building a healthy home in Homa Bay under the guidelines",
      },
      {
        src: "https://aak.or.ke/wp-content/uploads/2026/02/Artisans-and-contractors-training.jpeg",
        alt: "Artisans and contractors training on the Healthy Homes Guidelines",
      },
    ],
    documents: [
      {
        title: "Healthy Homes Guidelines and Checklist (2024)",
        href: "/documents/Healthy-Homes-Guidelines-and-Checklist-2024.pdf",
      },
    ],
    tone: "green",
  },
  {
    slug: "urban-thinkers-campus",
    eyebrow: "Urban policy platform",
    title: "Urban Thinkers Campus",
    summary:
      "An open, inclusive platform for critical exchange among urban researchers, built environment professionals, policymakers and decision-makers who view urbanisation as an opportunity for transformative change.",
    body: [
      "Since 2020, AAK has hosted a series of Urban Thinkers Campuses under the World Urban Campaign, convening diverse speakers and participants — from academia, the public and private sectors, civil society, NGOs, built environment professionals, urban researchers, and policymakers and decision-makers — to share practical experience and approaches to emerging urban challenges in Kenya and beyond.",
      "The platform is built on four pillars: critical urban exchange, inclusive collaboration, consensus building and sustainable urban futures, run in partnership with UN-Habitat, building consensus among partners to shape sustainable urban futures across Kenya and the globe.",
      "The Town Planners Chapter leads individual sessions, often paired with a design charrette and student mentorship, most recently on the future of Kenya's cities.",
    ],
    stats: [
      { label: "Running since", value: "2020" },
      { label: "Partner", value: "UN-Habitat, World Urban Campaign" },
      { label: "Led by", value: "Town Planners Chapter" },
    ],
    image: "https://aak.or.ke/wp-content/uploads/2025/06/1H5A2307-1200x800.jpg",
    imageAlt: "Members in discussion at an AAK Urban Thinkers Campus session",
    documents: [
      {
        title: "AAK × UN-Habitat Urban Thinkers Campus",
        href: "/documents/AAK-UN-Habitat-Urban-Thinkers-Campus.pdf",
      },
    ],
    tone: "primary",
  },
];

export function getInitiativeDetail(slug: string) {
  return initiativeDetails.find((initiative) => initiative.slug === slug);
}
