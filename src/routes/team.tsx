import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IconAward as Award, IconChevronDown as ChevronDown } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { chapterChairs, collegeOfFellows, regionalBranches, secretariat } from "@/data/site";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Team | Architectural Association of Kenya";
const DESCRIPTION =
  "The chapter chairpersons, regional branch leadership, Secretariat and College of Fellows of the Architectural Association of Kenya, 2025/2027 term.";

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
          { "@type": "ListItem", position: 2, name: "Team", item: `${SITE_URL}/team` },
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
            <PageBreadcrumb trail={[{ label: "Team" }]} />

            <Reveal className="mt-8 max-w-3xl">
              <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <span>Governance</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                The people leading AAK
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                The chapter chairpersons and regional branch leadership for the 2025/2027 term, the
                Secretariat that runs AAK day to day, and the College of Fellows: the highest honour
                AAK bestows on its members.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="chapters-leadership-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Chapter chairpersons"
              title={<span id="chapters-leadership-title">One chair per discipline</span>}
              bold
            />
            <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {chapterChairs.map((lead, i) => (
                <li key={lead.chapter}>
                  <Reveal delay={i * 50} className="h-full">
                    <div className="h-full rounded-2xl bg-card p-6">
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                      >
                        {initials(lead.chair)}
                      </span>
                      <h3 className="mt-4 font-display text-base font-semibold leading-snug text-foreground">
                        {lead.chair}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                        {lead.chapter}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>

            <h3 className="mt-16 font-display text-lg font-bold text-foreground">
              Regional branches
            </h3>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {regionalBranches.map((branch, i) => (
                <li key={branch.chapter}>
                  <Reveal delay={i * 60} className="h-full">
                    <div className="h-full rounded-2xl bg-card p-6">
                      <h4 className="font-display text-base font-semibold leading-snug text-foreground">
                        {branch.chair}
                      </h4>
                      <p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                        {branch.chapter}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="secretariat-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Operations · Contact"
              title={<span id="secretariat-title">Meet the Secretariat</span>}
              description="The AAK Secretariat manages the day-to-day operations of the Association and serves as the primary point of contact for members and stakeholders, coordinating administrative, communication and logistical functions."
              bold
            />
            <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {secretariat.map((member, i) => (
                <li key={member.name}>
                  <Reveal delay={i * 60} className="h-full">
                    <div className="flex h-full flex-col items-start gap-4 rounded-2xl border border-border p-6">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt=""
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
