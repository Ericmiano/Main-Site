import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight, IconFileText as FileText } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { publications } from "@/data/site";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Resource Centre | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK's reports, downloads and advocacy documents: the Status of the Built Environment Report, AGM reports, BuildPress Magazine, building regulations and policy submissions.";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/resources` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/resources` }],
  }),
  component: ResourcesPage,
});

// `to` values use `as const` so TanStack Router can type-check them as real
// routes (a plain `string` type would defeat that). `href` is for the one
// category — BuildHub — that lives on a different domain entirely.
const categories = [
  {
    title: "Bills",
    body: "Parliamentary bills tracked by AAK's advocacy team, with the association's submissions where made.",
    to: "/bills" as const,
  },
  {
    title: "General Downloads",
    body: "Forms, guides and other documents for members and the public.",
    to: "/general-downloads" as const,
  },
  {
    title: "Building Regulations",
    body: "Reference building regulations relevant to practice in Kenya.",
    to: "/building-regulations" as const,
  },
  {
    title: "Press Statements",
    body: "AAK's official statements to the press on matters affecting the built environment.",
    to: "/press-statements" as const,
  },
  {
    title: "Opinion Editorials",
    body: "Op-eds and commentary from AAK leadership and members on industry issues.",
    to: "/opinion-editorials" as const,
  },
  {
    title: "BuildPress Magazine",
    body: "AAK's magazine covering the profession, chapters and industry issues.",
    to: "/buildpress-magazine" as const,
  },
  {
    title: "BuildHub",
    body: "AAK's portal for obtaining a building permit or planning approval in Kenya, with step-by-step guidance, timelines and fees by county.",
    href: "https://buildhub.aak.or.ke/",
  },
  {
    title: "Status of the Built Environment Report",
    body: "AAK's annual analysis of trends, challenges and professional opportunities in Kenya's construction and urban development sector. Archive runs from 2018 to 2025.",
    to: "/status-of-the-built-environment" as const,
  },
  {
    title: "AGM Reports",
    body: "Annual General Meeting reports, published each year following the AAK AGM.",
    to: "/agm-reports" as const,
  },
  {
    title: "Salary Survey",
    body: "AAK's periodic survey of remuneration across the built and natural environment professions.",
    to: "/salary-survey" as const,
  },
  {
    title: "CPD Rapporteur Reports",
    body: "Summaries from AAK's Continuing Professional Development sessions.",
    to: "/cpd-rapporteur-reports" as const,
  },
  {
    title: "Liaison Committees Reports",
    body: "Reports from AAK's liaison committees with regulators and partner bodies.",
    to: "/liaison-committees-reports" as const,
  },
  {
    title: "Mulika Mjengo Report",
    body: "The core report behind AAK's public safety and hazard-reporting advocacy initiative.",
    to: "/mulika-mjengo-report" as const,
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
          {
            "@type": "ListItem",
            position: 2,
            name: "Resource Centre",
            item: `${SITE_URL}/resources`,
          },
        ],
      },
    ],
  };
}

function ResourcesPage() {
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
            <PageBreadcrumb trail={[{ label: "Resource Centre" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Resource Centre
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="categories-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2
              id="categories-title"
              className="font-display text-2xl font-semibold tracking-tight text-foreground"
            >
              Browse by category
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, i) => {
                const cardClassName =
                  "group flex h-full flex-col rounded-2xl bg-card p-6 transition-colors hover:bg-card/70";
                const cardBody = (
                  <>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {category.body}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-foreground">
                      {category.to ? "Browse documents" : "Open BuildHub"}
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                    </span>
                  </>
                );
                return (
                  <li key={category.title}>
                    <Reveal delay={(i % 3) * 60} className="h-full">
                      {category.to ? (
                        <Link to={category.to} className={cardClassName}>
                          {cardBody}
                        </Link>
                      ) : (
                        <a
                          href={category.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cardClassName}
                        >
                          {cardBody}
                        </a>
                      )}
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="latest-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2
              id="latest-title"
              className="font-display text-2xl font-semibold tracking-tight text-foreground"
            >
              Latest downloads
            </h2>
            <ul className="mt-8 border-t border-border">
              {publications.map((doc, i) => (
                <li key={doc.title}>
                  <Reveal delay={i * 60}>
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-2 border-b border-border py-6 transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        <h3 className="font-display text-base font-semibold text-foreground">
                          {doc.title}
                        </h3>
                      </div>
                      <span className="pl-9 text-xs uppercase tracking-[0.14em] text-muted-foreground sm:pl-0">
                        {doc.meta}
                      </span>
                    </a>
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
