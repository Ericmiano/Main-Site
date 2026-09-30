import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  IconFileDownload as FileDownload,
  IconSearch as Search,
  IconUsersGroup as Users,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { nominationsByChapter, nominationsByCounty, type NominationBody } from "@/data/nominations";
import { fileUrl } from "@/lib/files";
import { jsonLd } from "@/lib/json-ld";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Nominations to Boards | Architectural Association of Kenya";
const DESCRIPTION =
  "Members nominated by AAK to boards, councils and committees at county, national, regional and international level.";

export const Route = createFileRoute("/nominations")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/nominations` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/nominations` }],
  }),
  component: NominationsPage,
});

const allBodies = [...nominationsByChapter.flatMap((g) => g.bodies), ...nominationsByCounty];
const TOTAL = allBodies.reduce((n, b) => n + b.roles.reduce((m, r) => m + r.names.length, 0), 0);

const normalise = (s: string) => s.toLowerCase().normalize("NFKD");

/** Keep only the roles matching the search (by person, position or body). */
function filterBodies(bodies: NominationBody[], query: string, context = ""): NominationBody[] {
  if (!query) return bodies;
  return bodies
    .map((body) => {
      const bodyMatches = normalise(`${context} ${body.name}`).includes(query);
      return {
        ...body,
        roles: bodyMatches
          ? body.roles
          : body.roles.filter((r) =>
              normalise(`${r.position} ${r.names.join(" ")} ${r.note ?? ""}`).includes(query),
            ),
      };
    })
    .filter((body) => body.roles.length > 0);
}

function BodyCard({ body, level = 4 }: { body: NominationBody; level?: 3 | 4 }) {
  const Heading = level === 3 ? "h3" : "h4";
  return (
    <li className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 sm:p-6">
      <Heading className="font-display text-base font-semibold leading-snug text-foreground">
        {body.name}
      </Heading>
      <ul className="mt-4 space-y-3 border-t border-border pt-4">
        {body.roles.map((role, i) => (
          <li key={`${role.position}-${i}`}>
            {role.position ? (
              <p className="meta-label leading-relaxed text-muted-foreground">{role.position}</p>
            ) : null}
            <p className="mt-0.5 text-sm font-medium text-foreground">{role.names.join(", ")}</p>
            {role.note ? (
              <p className="mt-1 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground/80">
                {role.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </li>
  );
}

function NominationsPage() {
  const [search, setSearch] = useState("");
  const query = normalise(search.trim());

  const chapters = useMemo(
    () =>
      nominationsByChapter
        .map((g) => ({ ...g, bodies: filterBodies(g.bodies, query, g.chapter) }))
        .filter((g) => g.bodies.length > 0),
    [query],
  );
  const counties = useMemo(() => filterBodies(nominationsByCounty, query), [query]);
  const shown =
    chapters.reduce((n, g) => n + g.bodies.reduce((m, b) => m + b.roles.length, 0), 0) +
    counties.reduce((n, b) => n + b.roles.length, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Nominations to Boards",
                item: `${SITE_URL}/nominations`,
              },
            ],
          }),
        }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb
              trail={[{ label: "About", href: "/about" }, { label: "Nominations" }]}
            />
            <Reveal className="mt-8 max-w-3xl">
              <div className="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
                <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>
                  {TOTAL} nominations &nbsp;/&nbsp; {allBodies.length} bodies
                </span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Nominations to boards
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href={fileUrl(
                    "/documents/AAK-Leadership-at-National-Regional-and-International-Positions.pdf",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group btn-primary"
                >
                  <FileDownload className="h-4 w-4" aria-hidden="true" />
                  Full list (PDF)
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <label className="relative block max-w-xl">
              <span className="sr-only">Search by name, body or position</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, body or position"
                className="w-full rounded-full border border-border bg-background py-3 pr-4 pl-12 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
              />
            </label>
            <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
              {query
                ? shown
                  ? `${shown} ${shown === 1 ? "role matches" : "roles match"} “${search.trim()}”`
                  : `Nothing matches “${search.trim()}”`
                : "Grouped by chapter, then by county government."}
            </p>

            {chapters.length ? (
              <section aria-labelledby="bodies-title" className="mt-12">
                <SectionHeading
                  eyebrow="By chapter"
                  title={<span id="bodies-title">National, regional and international bodies</span>}
                />
                {chapters.map((group) => (
                  <div key={group.chapter} className="mt-12">
                    <h3 className="meta-label border-t border-border pt-5 text-foreground">
                      {group.chapter} chapter
                    </h3>
                    <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.bodies.map((body) => (
                        <BodyCard key={body.name} body={body} />
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ) : null}

            {counties.length ? (
              <section aria-labelledby="counties-title" className="mt-20">
                <SectionHeading
                  eyebrow="Devolved government"
                  title={<span id="counties-title">County governments</span>}
                />
                <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {counties.map((county) => (
                    <BodyCard key={county.name} body={county} level={3} />
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
