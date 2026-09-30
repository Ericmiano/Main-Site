import { chapters, events, initiatives, publications } from "@/data/site";
import { initiativeDetails } from "@/data/initiatives-detail";
import { reportArchivePages } from "@/data/report-archives";
import { mediaAlbums } from "@/data/media-archive";

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
    title: "Media archive",
    description:
      "Photographs from past AAK events: site visits, workshops, Grow A Classroom schools and more, one album per event.",
    category: "Page",
    href: "/media",
  },
  {
    title: "Membership",
    description:
      "How to join AAK, membership tiers and fees, and the benefits of belonging to Kenya's professional association for the built and natural environment.",
    category: "Page",
    href: "/membership",
  },
  {
    title: "AAK Leadership",
    description:
      "The Executive Committee, Secretariat, chapter and regional branch councils, and College of Fellows of the Architectural Association of Kenya.",
    category: "Page",
    href: "/team",
  },
  // Arbitration: on hold while the page is being finished. Re-add once ready.
  // {
  //   title: "Arbitration",
  //   description:
  //     "Construction-dispute arbitration in Kenya: the Joint Building Council contract framework, the Arbitration Act 1995, and how to reach AAK's secretariat.",
  //   category: "Page",
  //   href: "/arbitration",
  // },
  {
    title: "Frequently asked questions",
    description:
      "Membership and renewals, certificate validation, the members directory, events, awards, Grow A Classroom donations and store orders.",
    category: "Page",
    href: "/faqs",
  },
  {
    title: "Accessibility",
    description:
      "How the website supports accessible use, its known limitations, and how to report a problem.",
    category: "Page",
    href: "/accessibility",
  },
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
      "AAK's corporate social responsibility programmes: BuildRun, the David Mutiso Bursary Fund and the Grow A Classroom Initiative.",
    category: "Page",
    href: "/csr",
  },
  {
    title: "Students & Affiliates",
    description:
      "AAK's seven student affiliates, including ASA, CRESA and PLASA: built-environment student associations at the Technical University of Kenya, JKUAT, the University of Nairobi and Kenyatta University.",
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
  ...(initiative.externalUrl
    ? { href: initiative.externalUrl, external: true }
    : { href: `/initiatives/${initiative.slug}` }),
}));

const albumEntries: SearchEntry[] = mediaAlbums.map((album) => ({
  title: `${album.title} (photos)`,
  description: [album.category, album.date, album.location].filter(Boolean).join(" · "),
  category: "Page",
  href: `/media/${album.slug}`,
}));

// Events with their own website open it, as their cards on /events do.
const eventEntries: SearchEntry[] = events.map((event) => ({
  title: event.title,
  description: event.summary,
  category: "Event",
  ...(event.externalSiteHref
    ? { href: event.externalSiteHref, external: true }
    : { href: `/events/${event.slug}` }),
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

// The same PDF can be listed by several sources (publications, initiative
// documents, report archives); keep the first occurrence of each.
export const searchIndex: SearchEntry[] = [
  ...pages,
  ...chapterEntries,
  ...initiativeEntries,
  ...eventEntries,
  ...albumEntries,
  ...publicationEntries,
  ...initiativeDocumentEntries,
  ...reportArchiveEntries,
].filter(
  (entry, i, all) =>
    all.findIndex(
      (other) =>
        other.category === entry.category &&
        other.title === entry.title &&
        other.href === entry.href,
    ) === i,
);
