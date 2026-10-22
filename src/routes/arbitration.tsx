import { createFileRoute } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight, IconGavel as Gavel } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArbitratorDirectory } from "@/components/site/ArbitratorDirectory";
import { arbitrators } from "@/data/arbitrators";
import { ARBITRATION_CC, ARBITRATION_EMAIL, arbitrationRequestMailto } from "@/data/site";
import { fileUrl } from "@/lib/files";
import { jsonLd } from "@/lib/json-ld";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Arbitration | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK's panel of arbitrators, what to send when applying for arbitration, and how arbitration works under Kenya's Arbitration Act (Cap. 49).";

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

/* Every statement below is taken from, and cites, one of these sources:
   the Arbitration Act (Cap. 49), Revised Edition 2022 (Kenya Law); the
   Constitution of Kenya, Article 159(2)(c); the AAK Constitution and By-Laws
   (2022 amendments), clause 17; the panel in "ARBITRATOR PROFILES_2026.docx"
   (@/data/arbitrators); and, for what to send, the case-opening form of AAK's
   arbitration system (the separate Arbitration app: parties, basis, contract,
   value, category, description and its document types). Add nothing here
   that they don't say. The prototype steps (arbitrationSteps) are kept for
   when that system launches. */

/** What the arbitration system asks for when a case is opened. */
const REQUEST_DETAILS = [
  "The claimant and the respondent: names and contact details",
  "The basis for arbitration: the arbitration clause in your contract, or a separate written agreement to refer the dispute",
  "The contract and the project it relates to",
  "The value of the dispute",
  "The nature of the dispute, for example payment, delay or defects",
  "A short description of the dispute",
];

const REQUEST_DOCUMENTS = [
  "A copy of the contract, including its arbitration clause",
  "The separate agreement to arbitrate, where there is no clause in the contract",
  "Relevant correspondence between the parties",
  "Supporting evidence",
  "Proof of identity",
];

const ACT_PROVISIONS = [
  {
    title: "Appointing the arbitrator",
    body: "The parties are free to agree on a procedure for appointing the arbitrator or arbitrators.",
    cite: "s. 12(2)",
  },
  {
    title: "Procedure",
    body: "Subject to the Act, the parties are free to agree on the procedure the arbitral tribunal follows. Failing agreement, the tribunal may conduct the arbitration in the manner it considers appropriate.",
    cite: "s. 20",
  },
  {
    title: "Effect of the award",
    body: "Except as otherwise agreed by the parties, an arbitral award is final and binding upon the parties to it.",
    cite: "s. 32A",
  },
  {
    title: "Setting aside",
    body: "Recourse to the High Court against an award is only by an application to set it aside, on the grounds the Act lists, made within three months of receiving the award.",
    cite: "s. 35",
  },
  {
    title: "Enforcement",
    body: "A domestic arbitral award is recognised as binding and, upon application in writing to the High Court, is enforced.",
    cite: "s. 36(1)",
  },
];

const DOCUMENTS = [
  { title: "Arbitration Act (Cap. 49)", href: fileUrl("/documents/Arbitration-Act-1995.pdf") },
  {
    title: "AAK Constitution and By-Laws (2022 amendments)",
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
                Under the Constitution of Kenya, courts and tribunals are guided by the principle
                that alternative forms of dispute resolution, including arbitration, shall be
                promoted (Article 159(2)(c)). Arbitration in Kenya is governed by the Arbitration
                Act (Cap. 49).
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Where contract documents or other legal documents empower the President of the
                Association to nominate an arbitration panel, the President, or in their absence the
                Vice-President, does so on behalf of the Association, in consultation with the
                Governing Council (AAK Constitution, clause 17.2).
              </p>
            </Reveal>
          </div>
        </section>

        <section id="panel" aria-labelledby="panel-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Panel of arbitrators"
              title={<span id="panel-title">AAK&rsquo;s arbitrators</span>}
              description={`${arbitrators.length} members of the Association across its chapters, with their arbitration and dispute resolution credentials. Select a name for the full profile.`}
            />
            <div className="mt-12">
              <ArbitratorDirectory />
            </div>
          </div>
        </section>

        <section
          id="apply"
          aria-labelledby="apply-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Applying for arbitration"
              title={<span id="apply-title">What to send the Secretariat</span>}
              description="An arbitration agreement must be in writing. It may be a clause in your contract or a separate agreement (Arbitration Act, s. 4)."
            />
            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h3 className="meta-label text-muted-foreground">Details to include</h3>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {REQUEST_DETAILS.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 py-3.5 text-sm leading-relaxed text-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="meta-label text-muted-foreground">Documents to attach</h3>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {REQUEST_DOCUMENTS.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 py-3.5 text-sm leading-relaxed text-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Once the tribunal is in place, the claimant states the facts supporting the claim,
                  the points at issue and the relief sought, and the parties may submit all the
                  documents they consider relevant (Arbitration Act, s. 24).
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={arbitrationRequestMailto} className="group btn-primary">
                Email the Secretariat
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="text-sm text-muted-foreground">
                To {ARBITRATION_EMAIL}, copying {ARBITRATION_CC}. The email opens with this
                checklist filled in.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="act-title" className="border-t border-border py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="The Arbitration Act (Cap. 49)"
              title={<span id="act-title">What the law provides</span>}
            />
            <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {ACT_PROVISIONS.map((item) => (
                <li key={item.title} className="flex flex-col rounded-2xl border border-border p-6">
                  <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  <p className="meta-label mt-4 text-primary">{item.cite}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="association-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
            <div>
              <SectionHeading
                eyebrow="AAK Constitution, clause 17.1"
                title={<span id="association-title">When the Association is a party</span>}
              />
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                A dispute between the Association and any of its members, or any other persons or
                organisations, is referred to an arbitration panel of three persons appointed by the
                Chairman of the Chartered Institute of Arbitrators (Kenya Branch): one an advocate,
                the other two Corporate Members of the Association.
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
              Contact the Secretariat
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              To apply for arbitration, or for a nomination under clause 17.2, write to the
              Association&rsquo;s Secretariat at {ARBITRATION_EMAIL}, copying {ARBITRATION_CC}.
            </p>
            <a href={arbitrationRequestMailto} className="group btn-primary mt-7">
              Email {ARBITRATION_EMAIL}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
