import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IconAward as Award, IconChevronDown as ChevronDown } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { chapterBranches, chapterCouncils, type CouncilRole } from "@/data/chapter-councils";
import { chapterChairs, chapters, collegeOfFellows, secretariat } from "@/data/site";

const SITE_URL = "https://aak.or.ke";
const TITLE = "AAK Leadership | Architectural Association of Kenya";
const DESCRIPTION =
  "The Executive Committee, Secretariat, chapter councils, regional branch councils and College of Fellows of the Architectural Association of Kenya, 2025/2027 term.";

// Executive Committee titles, in rank order (aak.or.ke/about-us/). The
// `secretariat` list holds them alongside the operational staff.
const EXECUTIVE_TITLES = [
  "President",
  "Vice President",
  "Honorary Secretary",
  "Assistant Secretary",
  "Honorary Treasurer",
  "Honorary Registrar",
];
const executive = EXECUTIVE_TITLES.flatMap((title) =>
  secretariat.filter((member) => member.title === title),
);
const staff = secretariat.filter((member) => !EXECUTIVE_TITLES.includes(member.title));

// The three regional branches' councils (2026 AGM Report rosters).
const branches = chapterBranches["landscape-architects"] ?? [];

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/team` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/team` }],
  }),
  component: TeamPage,
});

function initials(name: string) {
  const cleaned = name.replace(/^(Arch\.|L\/Arch\.|QS\.|Eng\.|Prof\.?)\s*/i, "");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "AAK Leadership", item: `${SITE_URL}/team` },
        ],
      },
      {
        "@type": "ItemList",
        name: "AAK Chapter Chairpersons 2025/2027",
        itemListElement: chapterChairs.map((lead, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Person", name: lead.chair, jobTitle: `Chairperson, ${lead.chapter}` },
        })),
      },
    ],
  };
}

const FELLOWS_PAGE_SIZE = 15;

function PeopleGrid({ people }: { people: typeof secretariat }) {
  return (
    <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {people.map((member, i) => (
        <li key={member.name}>
          <Reveal delay={(i % 4) * 60} className="h-full">
            <div className="flex h-full flex-col items-start gap-4 rounded-2xl border border-border bg-background p-6">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt=""
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-lg font-semibold text-primary-foreground"
                >
                  {initials(member.name)}
                </span>
              )}
              <div>
                <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{member.title}</p>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/** A council's office holders, in the order the source lists them. */
function RosterCard({ title, members }: { title: ReactNode; members: CouncilRole[] }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-lg font-semibold leading-snug text-foreground">{title}</h3>
      <dl className="mt-4 divide-y divide-border text-sm">
        {members.map((m) => (
          <div
            key={m.name + m.role}
            className="flex flex-col-reverse py-2 sm:flex-row-reverse sm:justify-between sm:gap-4"
          >
            <dt className="text-muted-foreground sm:text-right">{m.role}</dt>
            <dd className="font-medium text-foreground">{m.name}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TeamPage() {
  const [fellowsExpanded, setFellowsExpanded] = useState(false);
  const sortedFellows = useMemo(() => [...collegeOfFellows].sort((a, b) => a.localeCompare(b)), []);
  const visibleFellows = fellowsExpanded
    ? sortedFellows
    : sortedFellows.slice(0, FELLOWS_PAGE_SIZE);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "AAK Leadership" }]} />

            <Reveal className="mt-8 max-w-3xl">
              <div className="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
                <span>Governance &middot; 2025/2027 term</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                AAK Leadership
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                The Executive Committee, the Secretariat that runs AAK day to day, the councils of
                the eight chapters and three regional branches, and the College of Fellows: the
                highest honour AAK bestows on its members.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="executive-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Office bearers"
              title={<span id="executive-title">Executive Committee</span>}
              description="The Association's elected office bearers for the 2025/2027 term."
              bold
            />
            <PeopleGrid people={executive} />
          </div>
        </section>

        <section
          aria-labelledby="secretariat-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Operations · Contact"
              title={<span id="secretariat-title">Secretariat</span>}
              description="The AAK Secretariat manages the day-to-day operations of the Association and serves as the primary point of contact for members and stakeholders, coordinating administrative, communication and logistical functions."
              bold
            />
            <PeopleGrid people={staff} />
          </div>
        </section>

        <section
          aria-labelledby="chapter-councils-title"
          className="border-t border-border py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Eight chapters"
              title={<span id="chapter-councils-title">Chapter Councils</span>}
              description="Each chapter is run by its own elected council."
              bold
            />
            <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {chapters.map((chapter, i) => (
                <li key={chapter.slug}>
                  <Reveal delay={(i % 3) * 60} className="h-full">
                    <RosterCard
                      title={
                        <Link
                          to="/chapters/$slug"
                          params={{ slug: chapter.slug }}
                          className="link-quiet"
                        >
                          {chapter.name}
                        </Link>
                      }
                      members={chapterCouncils[chapter.slug] ?? []}
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="branches-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Three branches"
              title={<span id="branches-title">Regional Branch Councils</span>}
              bold
            />
            <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch, i) => (
                <li key={branch.name}>
                  <Reveal delay={i * 60} className="h-full">
                    <RosterCard title={branch.name} members={branch.members} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="fellows-title" className="border-t border-border py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Honour · Service"
              title={<span id="fellows-title">College of Fellows, 2026</span>}
              description="Fellowship recognises distinguished members who have made significant contributions to the profession and to the association: the highest honour AAK bestows."
              bold
              action={
                <span className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                  <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                  {collegeOfFellows.length} Fellows
                </span>
              }
            />
            <Reveal delay={100}>
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-5">
                {visibleFellows.map((name) => (
                  <li key={name} className="border-b border-border py-1.5 text-foreground">
                    {name}
                  </li>
                ))}
              </ul>
            </Reveal>
            {sortedFellows.length > FELLOWS_PAGE_SIZE ? (
              <button
                type="button"
                onClick={() => setFellowsExpanded((v) => !v)}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                {fellowsExpanded ? "Show fewer" : `Show all ${sortedFellows.length} Fellows`}
                <ChevronDown
                  className={`h-4 w-4 text-primary transition-transform ${fellowsExpanded ? "rotate-180" : ""}`}
                />
              </button>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
