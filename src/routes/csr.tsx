import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconArrowUpRight as ArrowUpRight,
  IconHeartHandshake as HeartHandshake,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { initiatives } from "@/data/site";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Corporate Social Responsibility | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK gives back to society through BuildRun, supporting the Association's bursary initiative and the refurbishment of Anwa Junior Academy in Kibra, Nairobi.";

export const Route = createFileRoute("/csr")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content:
          "https://aak.or.ke/wp-content/uploads/2026/02/AAK-CSR-133-of-151-1200x800-600x400-1.jpg",
      },
      { property: "og:url", content: `${SITE_URL}/csr` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/csr` }],
  }),
  component: CsrPage,
});

const programmes = [
  {
    title: "BuildRun",
    body: "AAK's annual charity run, and the mechanism through which the Association funds its bursary initiative and community projects.",
  },
  {
    title: "Bursary initiative",
    body: "Support for deserving students pursuing courses in the built and natural environment. Over 100 students have been supported through to graduation to date.",
  },
  {
    title: "Anwa Junior Academy",
    body: "Refurbishment of Anwa Junior Academy in Kibra, Nairobi, benefitting the over 350 pupils who study at the school.",
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
          { "@type": "ListItem", position: 2, name: "CSR", item: `${SITE_URL}/csr` },
        ],
      },
      {
        "@type": "AboutPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/csr`,
        mainEntity: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

function CsrPage() {
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
            <PageBreadcrumb trail={[{ label: "Corporate Social Responsibility" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <HeartHandshake className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Giving back</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Corporate Social Responsibility
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="csr-programmes-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="csr-programmes-title" className="sr-only">
              CSR programmes
            </h2>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {programmes.map((programme, i) => (
                <li key={programme.title}>
                  <Reveal delay={i * 80} className="h-full">
                    <div className="flex h-full flex-col rounded-2xl border border-border p-7">
                      <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
                        {programme.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {programme.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal
              delay={240}
              className="mt-10 rounded-2xl bg-secondary/60 p-7 sm:flex sm:items-center sm:justify-between sm:gap-6"
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Support the bursary fund
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Donations to the David Mutiso Bursary Fund are made through the AAK store.
                </p>
              </div>
              <Link
                to="/store"
                className="group mt-6 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground sm:mt-0"
              >
                Visit the store
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section
          aria-labelledby="csr-initiatives-title"
          className="border-t border-border bg-muted/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Alongside our public-interest work"
              title={<span id="csr-initiatives-title">Other programmes members put to work</span>}
              description="CSR sits alongside AAK's built-environment initiatives, run for the public good by members across all eight chapters."
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
