import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { initiatives } from "@/data/site";

const SITE_URL = "https://aak.or.ke";
const TITLE = "AAK Programmes | Architectural Association of Kenya";
const DESCRIPTION =
  "The ongoing areas of public interest AAK participates in as a professional association: education, CPD, construction standards, cost control, planning and professional ethics.";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/programs` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/programs` }],
  }),
  component: ProgrammesPage,
});

const programmes = [
  {
    title: "Education",
    body: "AAK participates in drawing up training curricula at local universities and polytechnics. For architecture, the Association has solicited the support of the Commonwealth Association of Architects (CAA) to accredit our schools of architecture, giving degree courses international recognition.",
  },
  {
    title: "Continuous Professional Development",
    body: "To keep pace with changing technologies, the Association conducts seminars and workshops through which members continually develop their professional skills. Kenya is one of the few countries in Africa that runs continuous professional development exercises.",
  },
  {
    title: "Building Construction Standards",
    body: "AAK takes an interest and participates, as a public watchdog, in setting building construction standards through local authority by-laws, making periodic written submissions to local authorities for the adoption or amendment of construction standards.",
  },
  {
    title: "Construction Cost Control",
    body: "In collaboration with the Kenya Association of Building and Civil Engineering Contractors (KABCEC), AAK established the Joint Building Council to periodically review and publish recommended prices for building material and labour. The two associations also publish the Standard Agreement and Conditions of Contract for Building Works.",
  },
  {
    title: "Town and County",
    body: "AAK takes a particular interest in town and county matters, including the preparation of national, regional and local/town development plans.",
  },
  {
    title: "Professional Ethics",
    body: "Members of AAK sit on the respective Boards of Registration for the different building professions, upholding professional ethics across the industry.",
  },
];

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Programmes", item: `${SITE_URL}/programs` },
        ],
      },
      {
        "@type": "AboutPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/programs`,
        mainEntity: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

function ProgrammesPage() {
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
            <PageBreadcrumb trail={[{ label: "Programmes" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <span>Public interest</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                AAK programmes
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                AAK is purely a social professional association with no legal executive mandate.
                Based on its objectives, however, the Association takes interest and participates in
                several issues of public concern.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="programmes-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="programmes-title" className="sr-only">
              Areas of participation
            </h2>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programmes.map((programme, i) => (
                <li key={programme.title}>
                  <Reveal delay={i * 60} className="h-full rounded-2xl bg-card p-7">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {programme.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {programme.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="programmes-initiatives-title"
          className="border-t border-border bg-muted/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Featured"
              title={
                <span id="programmes-initiatives-title">
                  Key initiatives members are running now
                </span>
              }
              description="These operational programmes are complemented by AAK's headline public-good initiatives."
            />
            <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {initiatives.map((initiative, i) => (
                <li key={initiative.id}>
                  <Reveal delay={i * 80} className="h-full">
                    <Link
                      to="/initiatives/$slug"
                      params={{ slug: initiative.slug }}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        {initiative.eyebrow}
                      </span>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-foreground">
                        {initiative.title}
                      </h3>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        {initiative.cta}
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
