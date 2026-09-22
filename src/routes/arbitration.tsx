import { createFileRoute } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight, IconGavel as Gavel } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { arbitrationSteps } from "@/data/site";
import { arbitrators } from "@/data/arbitrators";
import { ArbitratorDirectory } from "@/components/site/ArbitratorDirectory";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Arbitration | Architectural Association of Kenya";
const DESCRIPTION =
  "Construction-dispute arbitration in Kenya: the Joint Building Council contract framework, the Arbitration Act 1995, and how to reach AAK's secretariat.";

export const Route = createFileRoute("/arbitration")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/arbitration` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/arbitration` }],
  }),
  component: ArbitrationPage,
});

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
            name: "Arbitration",
            item: `${SITE_URL}/arbitration`,
          },
        ],
      },
      {
        "@type": "Service",
        name: "AAK Arbitration",
        description: DESCRIPTION,
        provider: {
          "@type": "Organization",
          name: "Architectural Association of Kenya",
          url: SITE_URL,
        },
        areaServed: "KE",
        serviceType: "Construction dispute arbitration",
      },
      {
        "@type": "ItemList",
        name: "AAK arbitrator panel",
        itemListElement: arbitrators.map((arbitrator, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Person",
            name: arbitrator.name,
            jobTitle: arbitrator.position,
            worksFor: { "@type": "Organization", name: arbitrator.organization },
            memberOf: { "@id": `${SITE_URL}/#organization` },
          },
        })),
      },
    ],
  };
}

function ArbitrationPage() {
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
            <PageBreadcrumb trail={[{ label: "Arbitration" }]} />

            <Reveal className="mt-8 max-w-3xl">
              <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <Gavel className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Dispute resolution</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Arbitration through AAK
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                AAK co-founded the Joint Building Council (JBC) with the Kenya Association of
                Building and Civil Engineering Contractors, which publishes the Standard Agreement
                and Conditions of Contract for Building Works used across the industry: the contract
                form under which many building disputes are referred to arbitration. Awards made
                under the Arbitration Act, 1995 are final and binding.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Parties working under an independently negotiated contract, not just a JBC, FIDIC or
                NCA standard form, can apply too. Any written arbitration agreement between the
                parties is enough to start the process.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="arbitration-steps-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="How it works"
              title={<span id="arbitration-steps-title">The application, in five steps</span>}
              description="From checking the contract clause to receiving a binding award: what happens, and roughly how long each stage takes."
            />

            <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {arbitrationSteps.map((step, i) => (
                <li key={step.step}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="flex h-full flex-col rounded-2xl border border-border p-6">
                      <span className="font-display text-3xl font-semibold tabular-nums text-primary">
                        {step.step}
                      </span>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={300} className="mt-10">
              <a
                href="https://members.aak.or.ke/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl bg-foreground px-7 py-4 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start an application
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </section>

        <section
          aria-labelledby="arbitrator-directory-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Panel"
              title={<span id="arbitrator-directory-title">Arbitrator directory</span>}
              description="Filter by chapter, then open a profile for full credentials, ADR experience and professional background."
            />

            <div className="mt-14">
              <ArbitratorDirectory />
            </div>
          </div>
        </section>

        <section className="border-t border-border py-16 text-center lg:py-20">
          <div className="mx-auto max-w-xl px-6 lg:px-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Have a construction dispute, under any contract?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              JBC, FIDIC, NCA or independently negotiated: check the dispute-resolution clause,
              apply below.
            </p>
            <a
              // TODO: replace with the live Microsoft Forms link once it's published.
              href="https://forms.office.com/r/REPLACE_WITH_ARBITRATION_FORM_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              Apply for arbitration
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
