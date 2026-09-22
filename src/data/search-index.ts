import { chapters, events, initiatives, publications } from "@/data/site";
import { initiativeDetails } from "@/data/initiatives-detail";
import { reportArchivePages } from "@/data/report-archives";

export interface SearchEntry {
  title: string;
  description: string;
  category: "Page" | "Chapter" | "Initiative" | "Event" | "Document";
  /** Internal route (passed to <Link to>) or a full external/asset URL. */
  href: string;
  /** Set when href is an external site or a same-origin asset (PDF, etc.) that should open in a new tab rather than route through the client-side router. */
  external?: boolean;
}

const pages: SearchEntry[] = [
  {
    title: "Home",
    description: "AAK's homepage: events, chapters, initiatives and news.",
    category: "Page",
    href: "/",
  },
  {
    title: "About",
    description:
      "Established in 1967, AAK is Kenya's leading association for professionals in the built and natural environment: eight chapters, three regional branches, registered under the Societies Act.",
    category: "Page",
    href: "/about",
  },
  {
    title: "Events",
    description:
      "AAK's calendar of association-wide events: the Annual Convention, the Nairobi Biennale of Architecture & Art, the Sports & Wellness Day and the Urban Thinkers Campus.",
    category: "Page",
    href: "/events",
  },
  {
    title: "Membership",
    description:
      "How to join AAK, membership tiers and fees, and the benefits of belonging to Kenya's professional association for the built and natural environment.",
    category: "Page",
    href: "/membership",
  },
  {
    title: "Team",
    description:
      "The chapter chairpersons, regional branch leadership, Secretariat and College of Fellows of the Architectural Association of Kenya.",
    category: "Page",
    href: "/team",
  },
  // Arbitration: on hold while the system behind it is still being built. Re-add once ready.
  // {
  //   title: "Arbitration",
  //   description:
  //     "Construction-dispute arbitration in Kenya: the Joint Building Council contract framework, the Arbitration Act 1995, and how to reach AAK's secretariat.",
  //   category: "Page",
  //   href: "/arbitration",
  // },
  {
    title: "Resource Centre",
    description:
      "AAK's reports, downloads and advocacy documents: the Status of the Built Environment Report, AGM reports, BuildPress Magazine, building regulations and policy submissions.",
    category: "Page",
    href: "/resources",
  },
  {
    title: "Awards",
    description:
      "The AAK – Basco DuraCoat Awards of Excellence in Architecture: categories, jury, evaluation criteria, and past winning projects.",
    category: "Page",
    href: "/awards",
  },
  {
    title: "Programs",
    description:
      "The ongoing areas of public interest AAK participates in as a professional association: education, CPD, construction standards, cost control, planning and professional ethics.",
    category: "Page",
    href: "/programs",
  },
  {
    title: "CSR",
    description:
      "AAK gives back to society through BuildRun, supporting the Association's bursary initiative and the refurbishment of Anwa Junior Academy in Kibra, Nairobi.",
    category: "Page",
    href: "/csr",
  },
  {
    title: "Students & Affiliates",
    description:
      "AAK supports student organisations across the architectural industry: the Architecture Students Association, CRESA and PLASA.",
    category: "Page",
    href: "/students",
  },
  {
    title: "Store",
    description:
      "AAK merchandise and industry documents: JBC contract books, certificates and the David Mutiso Bursary Fund. Order via WhatsApp.",
    category: "Page",
    href: "/store",
  },
  {
    title: "Contact",
    description:
      "Reach the AAK secretariat at Blue Violets Plaza, Nairobi: phone, WhatsApp and email for members, the press and the public.",
    category: "Page",
    href: "/contact",
  },
];

const chapterEntries: SearchEntry[] = chapters.map((chapter) => ({
  title: `${chapter.name} Chapter`,
  description: chapter.definition,
  category: "Chapter",
  href: `/chapters/${chapter.slug}`,
}));

const initiativeEntries: SearchEntry[] = initiatives.map((initiative) => ({
  title: initiative.title,
  description: initiative.description,
  category: "Initiative",
  href: `/initiatives/${initiative.slug}`,
}));

const eventEntries: SearchEntry[] = events.map((event) => ({
  title: event.title,
  description: event.summary,
  category: "Event",
  href: `/events/${event.slug}`,
}));

const publicationEntries: SearchEntry[] = publications.map((doc) => ({
  title: doc.title,
  description: doc.meta,
  category: "Document",
  href: doc.href,
  external: true,
}));

const initiativeDocumentEntries: SearchEntry[] = initiativeDetails.flatMap((initiative) =>
  (initiative.documents ?? []).map((doc) => ({
    title: doc.title,
    description: `${initiative.title} · Document`,
    category: "Document" as const,
    href: doc.href,
    external: true,
  })),
);

const reportArchiveEntries: SearchEntry[] = reportArchivePages.flatMap((page) =>
  page.documents.map((doc) => ({
    title: doc.title,
    description: `${page.category}${doc.year ? ` · ${doc.year}` : ""}`,
    category: "Document" as const,
    href: doc.href,
    external: true,
  })),
);

export const searchIndex: SearchEntry[] = [
  ...pages,
  ...chapterEntries,
  ...initiativeEntries,
  ...eventEntries,
  ...publicationEntries,
  ...initiativeDocumentEntries,
  ...reportArchiveEntries,
];
