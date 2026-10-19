import {
  awardWinners2024,
  chapterChairs,
  chapters,
  eventEndTime,
  events,
  initiatives,
  membershipFees,
  portalLinks,
  publications,
  regionalBranches,
  secretariat,
} from "@/data/site";
import { initiativeDetails } from "@/data/initiatives-detail";
import { reportArchivePages } from "@/data/report-archives";
import { mediaAlbums } from "@/data/media-archive";
import { fellowsOfficers, fellowsRegister } from "@/data/fellows";
import { faqGroups } from "@/components/info/faq-data";
import { nodeText, slugify } from "@/lib/node-text";
import type { Searchable } from "@/lib/search";

export interface SearchEntry extends Searchable {
  title: string;
  description: string;
  category:
    | "Quick link"
    | "Page"
    | "Chapter"
    | "Initiative"
    | "Event"
    | "Document"
    | "Person"
    | "FAQ"
    | "Membership"
    | "Award"
    | "Album";
  /** Internal route (passed to <Link to>) or a full external/asset URL. */
  href: string;
  /** Set when href is an external site or a same-origin asset (PDF, etc.) that should open in a new tab rather than route through the client-side router. */
  external?: boolean;
  /** A short line shown beside the result: a date, "PDF · 2024", etc. */
  meta?: string;
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
      "AAK's calendar of association-wide events: the Annual Convention, the Nairobi Biennale of Architecture & Art, the Urban Thinkers Campus and the release of the Status of the Built Environment Report at the President's Dinner.",
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
  {
    title: "College of Fellows",
    description:
      "AAK's senior membership category: the roles of the College, the Meet the Fellows video series and the Fellows of 2026.",
    category: "Page",
    href: "/college-of-fellows",
  },
  {
    title: "News & insights",
    description:
      "Blogs, articles and opinion from the Architectural Association of Kenya and its members on Kenya's built and natural environment.",
    category: "Page",
    href: "/news",
  },
  {
    title: "Nominations to Boards",
    description:
      "Members nominated by AAK to boards, councils and committees at county, national, regional and international level.",
    category: "Page",
    href: "/nominations",
  },
  {
    title: "Certificate verification",
    description:
      "Check that a certificate from an AAK event, such as the Annual Convention, is genuine, using its serial number and the holder's surname.",
    category: "Page",
    href: "/certificate-verification",
  },
  {
    title: "Arbitration",
    description:
      "Arbitration under Kenya's Arbitration Act (Cap. 49), and AAK's role under clause 17 of its Constitution: nominating arbitration panels and disputes involving the Association.",
    category: "Page",
    href: "/arbitration",
  },
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
      "AAK merchandise and industry documents: JBC contract books and certificates. Order via WhatsApp.",
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
  keywords: `${chapter.tagline} ${chapter.footerTagline} chapter`,
  category: "Chapter",
  href: `/chapters/${chapter.slug}`,
}));

// Initiatives: their own pages, searched through their full text.
const detailBySlug = new Map(initiativeDetails.map((d) => [d.slug, d]));
const initiativeEntries: SearchEntry[] = initiatives.map((initiative) => {
  const detail = detailBySlug.get(initiative.slug);
  return {
    title: initiative.title,
    description: initiative.description,
    category: "Initiative",
    keywords: [
      initiative.eyebrow,
      detail?.eyebrow,
      ...(detail?.stats ?? []).map((s) => `${s.label} ${s.value}`),
    ]
      .filter(Boolean)
      .join(" "),
    ...(detail ? { body: [detail.summary, ...detail.body].join(" ") } : {}),
    ...(initiative.externalUrl
      ? { href: initiative.externalUrl, external: true }
      : { href: `/initiatives/${initiative.slug}` }),
  };
});

const albumEntries: SearchEntry[] = mediaAlbums.map((album) => ({
  title: album.title,
  description: album.summary,
  meta: [album.date, album.location].filter(Boolean).join(" · ") || "Photo album",
  category: "Album",
  keywords: `photos album gallery ${album.category} ${album.photos.map((p) => p.alt).join(" ")}`,
  href: `/media/${album.slug}`,
}));

// Events: their own pages, upcoming ones first.
const now = Date.now();
const eventEntries: SearchEntry[] = events.map((event) => {
  const past = eventEndTime(event) < now;
  return {
    title: event.title,
    description: event.summary,
    meta: `${event.date} · ${event.location}${past ? " · Past" : ""}`,
    category: "Event",
    keywords: `${event.kicker} ${event.venue} ${event.date} ${event.facts.map((f) => `${f.label} ${f.value}`).join(" ")}`,
    body: event.body.join(" "),
    boost: past ? -2 : 1.5,
    href: `/events/${event.slug}`,
  };
});

const pdf = (year?: string) => (year ? `PDF · ${year}` : "PDF");

const publicationEntries: SearchEntry[] = publications.map((doc) => ({
  title: doc.title,
  description: doc.meta,
  meta: "PDF",
  category: "Document",
  href: doc.href,
  external: true,
}));

const initiativeDocumentEntries: SearchEntry[] = initiativeDetails.flatMap((initiative) =>
  (initiative.documents ?? []).map((doc) => ({
    title: doc.title,
    description: `From ${initiative.title}`,
    meta: "PDF",
    category: "Document" as const,
    keywords: `${initiative.title} report document download`,
    href: doc.href,
    external: true,
  })),
);

const reportArchiveEntries: SearchEntry[] = reportArchivePages.flatMap((page) =>
  page.documents.map((doc) => ({
    title: doc.title,
    description: page.category,
    meta: pdf(doc.year),
    category: "Document" as const,
    keywords: `${page.category} ${doc.year ?? ""} report document download`,
    // Newer reports edge out older ones of the same name.
    boost: doc.year ? Math.max(0, Number(doc.year) - 2015) * 0.15 : 0,
    href: doc.href,
    external: true,
  })),
);

// The College's officers, matched to their register entries by surname
// (the register lists surnames first).
const officerRole = (name: string) => {
  const surname = name.split(" ")[0]!.toLowerCase();
  const officer = fellowsOfficers.find((o) => o.name.toLowerCase().split(" ").at(-1) === surname);
  return officer ? `${officer.role}, College of Fellows` : undefined;
};

// People: the Executive and Secretariat, chapter and branch chairs, Fellows.
const peopleEntries: SearchEntry[] = [
  ...secretariat.map((person) => ({
    title: person.name,
    description: person.title,
    meta: "AAK Leadership",
    category: "Person" as const,
    keywords: "staff secretariat executive leadership team",
    href: "/team#secretariat-title",
  })),
  ...chapterChairs.map((lead) => ({
    title: lead.chair,
    description: `Chair, ${lead.chapter}`,
    meta: "Chapter Council",
    category: "Person" as const,
    keywords: "chair chairperson chapter council leadership",
    href: "/team#chapter-councils-title",
  })),
  ...regionalBranches.map((lead) => ({
    title: lead.chair,
    description: `Chair, ${lead.chapter}`,
    meta: "Regional branch",
    category: "Person" as const,
    keywords: "chair branch region leadership",
    href: "/team#branches-title",
  })),
  ...fellowsRegister.map((fellow) => ({
    title: fellow.name,
    description: `${officerRole(fellow.name) ?? "Fellow"} · ${fellow.chapters.join(", ")}`,
    meta: fellow.video ? "College of Fellows · Meet the Fellows film" : "College of Fellows",
    category: "Person" as const,
    keywords: "fellow fellows college faak",
    href: "/college-of-fellows#fellows-list-title",
  })),
];

// FAQs: the question, searched through its answer too.
const faqEntries: SearchEntry[] = faqGroups.flatMap((group) =>
  group.items.map((item) => ({
    title: item.q,
    description: `${group.title} FAQ`,
    category: "FAQ" as const,
    body: nodeText(item.a),
    href: `/faqs#${slugify(item.q)}`,
  })),
);

// Membership categories and their fees.
const kes = (v: string) => (/^[\d,.]+$/.test(v) ? `KES ${v.replace(/\.00$/, "")}` : v);
const feeEntries: SearchEntry[] = membershipFees.map((fee) => ({
  title: `${fee.category} membership`,
  description: `Entrance fee: ${kes(fee.entrance)} · Annual subscription: ${kes(fee.annual)}${fee.note ? ` · ${fee.note}` : ""}`,
  category: "Membership" as const,
  keywords: `fees fee cost subscription join apply ${fee.group}`,
  href: "/membership#fees-title",
}));

// Award winners: the Awards page.
const awardEntries: SearchEntry[] = awardWinners2024.map((winner) => ({
  title: winner.project,
  description: `${winner.result}, ${winner.category} · Awards of Excellence 2026`,
  category: "Award" as const,
  keywords: "awards excellence winner project duracoat",
  href: "/awards",
}));

// Quick actions most visitors come for.
const quickLinks: SearchEntry[] = [
  {
    title: "Join AAK",
    description: "Apply for membership on the members portal",
    keywords: "apply application register join membership become member signup",
    href: portalLinks.apply,
    external: true,
  },
  {
    title: "Pay or renew membership",
    description: "Pay your membership subscription online",
    keywords: "pay payment renew renewal subscription fees mpesa",
    href: portalLinks.pay,
    external: true,
  },
  {
    title: "Member log in",
    description: "Sign in to the AAK members portal",
    keywords: "login log in sign in portal account",
    href: portalLinks.signIn,
    external: true,
  },
  {
    title: "Validate a certificate",
    description: "Check an AAK membership certificate",
    keywords: "certificate validate verify verification check",
    href: "/certificate-verification",
  },
  {
    title: "Find a member",
    description: "Search the AAK member directory",
    keywords: "directory find member search register professional",
    href: portalLinks.directory,
    external: true,
  },
  {
    title: "Job portal",
    description: "Jobs in Kenya's built environment",
    keywords: "jobs job careers vacancies employment portal",
    href: portalLinks.jobs,
    external: true,
  },
  {
    title: "Contact the Secretariat",
    description: "Phone, WhatsApp and email for the AAK Secretariat",
    keywords: "contact phone call email whatsapp address office secretariat",
    href: "/contact",
  },
].map((entry) => ({ ...entry, category: "Quick link" as const, boost: 1.5 }));

// The same PDF can be listed by several sources (publications, initiative
// documents, report archives); keep the first occurrence of each.
export const searchIndex: SearchEntry[] = [
  ...quickLinks,
  ...pages,
  ...chapterEntries,
  ...initiativeEntries,
  ...eventEntries,
  ...feeEntries,
  ...faqEntries,
  ...peopleEntries,
  ...awardEntries,
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

/** Category names, in the order filters and groups are shown. */
export const searchCategories: SearchEntry["category"][] = [
  "Quick link",
  "Page",
  "Event",
  "Initiative",
  "Chapter",
  "Membership",
  "FAQ",
  "Person",
  "Award",
  "Album",
  "Document",
];

export const categoryLabel: Record<SearchEntry["category"], string> = {
  "Quick link": "Quick links",
  Page: "Pages",
  Event: "Events",
  Initiative: "Initiatives",
  Chapter: "Chapters",
  Membership: "Membership",
  FAQ: "FAQs",
  Person: "People",
  Award: "Awards",
  Album: "Photo albums",
  Document: "Documents",
};
