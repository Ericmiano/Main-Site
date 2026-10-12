import { createFileRoute } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight, IconGavel as Gavel } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { SectionHeading } from "@/components/site/SectionHeading";
import { fileUrl } from "@/lib/files";
import { jsonLd } from "@/lib/json-ld";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Arbitration | Architectural Association of Kenya";
const DESCRIPTION =
  "Arbitration of construction disputes in Kenya: why it is used, how AAK's President nominates arbitrators under the AAK Constitution, what an award means under the Arbitration Act, and how to request a nomination.";

const NOMINATION_EMAIL = "mailto:aak@aak.or.ke?subject=Request%20for%20arbitrator%20nomination";

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

/* Sources: the Arbitration Act (Cap. 49), ss. 12, 32A, 35 and 36; the
   Constitution of Kenya, Art. 159(2)(c); the AAK Constitution, s. 17. The
   online arbitration system (a separate app) will plug in here when it
   launches; the prototype steps and directory (arbitrationSteps,
   ArbitratorDirectory) are kept for it. */

const REASONS = [
  {
    title: "Decided by professionals",
    body: "The parties can have their dispute decided by someone who knows building and construction, rather than by a court.",
  },
  {
    title: "Private",
    body: "Proceedings take place between the parties and the arbitrator, not in open court.",
  },
  {
    title: "Final and binding",
    body: "Unless the parties agree otherwise, an award is final and binding on them (Arbitration Act, s. 32A).",
  },
  {
    title: "Enforceable",
    body: "The High Court recognises a domestic award as binding and enforces it on application (s. 36).",
  },
];

const STEPS = [
  {
    title: "Check your contract",
    body: "The arbitration clause sets out how the arbitrator is appointed. Many building contracts, including the Joint Building Council's standard forms, name the President of AAK to nominate one when the parties cannot agree.",
  },
  {
    title: "Request a nomination",
    body: "Write to the Secretariat with a copy of the contract, the arbitration clause, the names of the parties and a short description of the dispute.",
  },
  {
    title: "Nomination",
    body: "The President of AAK, or in their absence the Vice-President, nominates the arbitrator or panel on the Association's behalf, in consultation with the Governing Council (AAK Constitution, s. 17.2).",
  },
  {
    title: "Proceedings",
    body: "The arbitrator agrees the procedure with the parties: how statements and documents are exchanged, whether there is a hearing, and the timetable to the award.",
  },
  {
    title: "The award",
    body: "The award is final and binding and can be enforced through the High Court. It can only be challenged by an application to the High Court to set it aside, on limited grounds, within three months of receiving it (s. 35).",
  },
];

const DOCUMENTS = [
  { title: "Arbitration Act (Cap. 49)", href: fileUrl("/documents/Arbitration-Act-1995.pdf") },
  {
    title: "AAK Constitution and By-Laws (2022)",
    href: fileUrl("/documents/Constitution-2022-3.pdf"),
  },
];

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
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Arbitration through AAK
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Arbitration settles a dispute privately, before an independent arbitrator appointed
                under the parties&rsquo; contract, instead of in court. It is the usual route for
                disputes under building contracts in Kenya, and the Constitution of Kenya directs
                that it be promoted alongside other forms of alternative dispute resolution (Article
                159(2)(c)).
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                When a contract names AAK to nominate the arbitrator, the President of the
                Association makes the nomination, drawing on the built environment professions AAK
                represents.
              </p>
              <a href={NOMINATION_EMAIL} className="group btn-primary mt-8">
                Request a nomination
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="why-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Why arbitration"
              title={<span id="why-title">A binding decision, outside the courts</span>}
            />
            <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {REASONS.map((reason) => (
                <li key={reason.title} className="rounded-2xl border border-border p-6">
                  <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {reason.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="steps-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="How it works"
              title={<span id="steps-title">How AAK nominates an arbitrator</span>}
            />
            <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex flex-col rounded-2xl border border-border bg-background p-6"
                >
                  <span
                    className="font-display text-3xl font-semibold tabular-nums text-primary"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="association-title" className="py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
            <div>
              <SectionHeading
                eyebrow="Disputes involving AAK"
                title={<span id="association-title">When the Association is a party</span>}
              />
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                A dispute between the Association and one of its members, or any other person or
                organisation, goes to a panel of three arbitrators appointed by the Chairman of the
                Chartered Institute of Arbitrators (Kenya Branch): one an advocate, the other two
                Corporate Members of AAK (AAK Constitution, s. 17.1).
              </p>
            </div>
            <div>
              <h2 className="meta-label text-muted-foreground">The law and the rules</h2>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {DOCUMENTS.map((doc) => (
                  <li key={doc.href}>
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 py-4 text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {doc.title} (PDF)
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-16 text-center lg:py-20">
          <div className="mx-auto max-w-xl px-6 lg:px-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Need an arbitrator nominated?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Write to the Secretariat with a copy of the contract and a short description of the
              dispute.
            </p>
            <a href={NOMINATION_EMAIL} className="group btn-primary mt-7">
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
