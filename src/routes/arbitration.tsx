import { createFileRoute } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight, IconGavel as Gavel } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { jsonLd } from "@/lib/json-ld";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Arbitration | Architectural Association of Kenya";
const DESCRIPTION =
  "How AAK nominates arbitrators for construction disputes under the AAK Constitution, and how to request a nomination while AAK's online arbitration service is being set up.";

/** Set to the published Microsoft Forms link; until then the button emails the secretariat. */
const ARBITRATION_FORM_URL: string | null = null;

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
    ],
  };
}

/**
 * A small holding page while AAK's arbitration system is built (a separate
 * app, planned for its own subdomain). The fuller page's process steps and
 * arbitrator directory (arbitrationSteps, ArbitratorDirectory) are kept for
 * when that launches.
 */
function ArbitrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData()) }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Arbitration" }]} />

            <Reveal className="mt-8 max-w-3xl">
              <div className="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
                <Gavel className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Dispute resolution</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                  Coming soon
                </span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Arbitration through AAK
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Many building contracts, including the Joint Building Council&rsquo;s standard
                forms, name the President of the Architectural Association of Kenya to nominate an
                arbitrator or arbitration panel when a dispute arises. Under the AAK Constitution,
                the President, or in their absence the Vice-President, makes that nomination on the
                Association&rsquo;s behalf, in consultation with the Governing Council.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We are setting up an online arbitration service to handle requests and manage cases
                from start to finish. Details will be published here when it opens.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-16 text-center lg:py-20">
          <div className="mx-auto max-w-xl px-6 lg:px-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Need an arbitrator nominated now?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Until the service opens, write to the Secretariat with a copy of the contract and a
              short description of the dispute.
            </p>
            <a
              href={
                ARBITRATION_FORM_URL ??
                "mailto:aak@aak.or.ke?subject=Request%20for%20arbitrator%20nomination"
              }
              {...(ARBITRATION_FORM_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group btn-primary mt-7"
            >
              Email aak@aak.or.ke
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
