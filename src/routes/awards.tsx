import { createFileRoute } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight, IconTrophy as Trophy } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Awards & Honours | Architectural Association of Kenya";
const DESCRIPTION =
  "The AAK-Basco DuraCoat Awards of Excellence in Architecture: categories, jury, evaluation criteria, and the 2024 cycle's winning projects.";

export const Route = createFileRoute("/awards")({
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
          "https://aak.or.ke/wp-content/uploads/2026/01/AAK-DURACOAT-AWARDS-OF-EXCELLENCE-2026-1-scaled.webp",
      },
      { property: "og:url", content: `${SITE_URL}/awards` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/awards` }],
  }),
  component: AwardsPage,
});

const categories = [
  {
    name: "Best Africa (Re)presentation",
    description:
      "Entries in this category should demonstrate a meaningful and contemporary interpretation of African cultural identity. Submissions are expected to draw inspiration from local ways of life, tradition and culture, materials, artefacts, patterns, and environmental knowledge systems. Projects must articulate how these references have informed the design approach, resulting in architecture that resonates with regional relevance and expresses African heritage in a clear and intentional manner.",
  },
  {
    name: "Best Commercial Project",
    description:
      "This category recognizes commercial developments that excel in functionality, spatial organization, user experience and contextual integration. Submissions must clearly demonstrate how the design supports commercial operations, enhances productivity or customer engagement, and responds sensitively to its physical and socio-economic setting. Consideration is given to environmental performance, material strategy and the project's overall contribution to its urban and natural environment.",
  },
  {
    name: "Best Empowerment and Social Equity Through Design",
    description:
      "Submissions must illustrate how architectural design has directly enhanced dignity, accessibility, inclusion and livelihood opportunities for underserved or marginalized communities. Projects should highlight built-form solutions that improve participation, safety, equity and long-term community resilience. Emphasis is placed on tangible design interventions that uplift vulnerable populations and support social transformation.",
  },
  {
    name: "Best Hospitality Project",
    description:
      "This category recognizes hotels, lodges, resorts and other guest-focused environments that deliver exceptional spatial quality, comfort and place-specific experience. Submissions should highlight how the design integrates with its landscape or urban setting, enhances ambience, and supports intuitive movement and relaxation. Priority is given to thoughtful material choices, environmental responsiveness, and memorable, context-driven hospitality environments.",
  },
  {
    name: "Best Institutional Project",
    description:
      "This category recognizes institutional projects, including educational facilities, healthcare centers, government buildings, cultural institutions and community facilities, that excel in functionality, spatial organization, user experience and contextual integration. Consideration is given to environmental performance, material strategy, durability for public use, and the project's overall contribution to its urban and natural environment.",
  },
  {
    name: "Best Religious / Monumental Project",
    description:
      "Entries should exemplify architecture that carries symbolic, spiritual or cultural significance, including churches, mosques, temples, meditation centers and monumental civic structures. Submissions are expected to show how form, materiality, procession, light and spatial organization work together to evoke meaning, support ritual practices and serve the surrounding community with dignity and clarity.",
  },
  {
    name: "Best Interior Environment",
    description:
      "Submissions in this category must demonstrate refined and innovative interior design that enhances the function, atmosphere and comfort of indoor spaces, illustrating effective spatial planning, material selection, lighting strategies, furniture integration, ventilation considerations and overall aesthetic harmony.",
  },
  {
    name: "Best Residential Project",
    description:
      "This category recognizes exemplary residential design, from single family homes to multi-unit housing and residential developments, that successfully combines aesthetics, functionality, climatic responsiveness and contextual harmony, highlighting thoughtful spatial organization, material interplay and relationship to landscape.",
  },
  {
    name: "Best Student Project",
    description:
      "Submissions must be conceptual work produced by students enrolled in accredited architecture programs, demonstrating strong conceptual grounding, clear articulation of design principles, contextual awareness, sustainability considerations and high-quality presentation.",
  },
];

const evaluationCriteria = [
  { weight: "45%", text: "Design, Innovation, Technologies, Originality and Creativity" },
  { weight: "20%", text: "Contextual Appropriateness: Cultural, Environmental, Physical, Social" },
  { weight: "15%", text: "Sustainability: Design, Process, Lifetime Use and Durability" },
  { weight: "10%", text: "Socio-Economic Impact" },
  { weight: "10%", text: "Creative Use of Materials" },
];

const eligibleAssociations = [
  "The Architectural Association of Kenya (AAK)",
  "Rwanda Institute of Architects (RIA)",
  "Uganda Society of Architects (USA)",
  "Architectural Association of Tanzania (AAT)",
];

const whyEnter = [
  {
    title: "Technical rigor",
    body: "Every project is evaluated by a jury of esteemed international and local peers.",
  },
  {
    title: "Sustainable design",
    body: "A dedicated category for climate resilience and resource-efficient practice.",
  },
  {
    title: "Market distinction",
    body: "Winners gain national recognition and set the benchmark for professional excellence.",
  },
];

const jury = [
  { name: "Arch. Mphethi Morojele", org: "South Africa Institute of Architects (SAIA)" },
  { name: "Arch. Flora Runumi", org: "Uganda Society of Architects (USA)" },
  { name: "Prof. Paul Maringa", org: "Architectural Association of Kenya (AAK)" },
  { name: "Arch. Nikos Fintikakis", org: "International Union of Architects (UIA)" },
];

interface Winner {
  project: string;
  category: string;
  result: string;
  image: string;
  pdfHref: string;
}

const winners2024: Winner[] = [
  {
    project: "The Agora",
    category: "Best Student Project",
    result: "Winner",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-164835.png",
    pdfHref: "/documents/THE-AGORA-PROJECT.pdf",
  },
  {
    project: "Kigandani Industrial Hub",
    category: "Best Student Project",
    result: "1st Runner-up",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-164317.png",
    pdfHref: "/documents/KIGANDANI-INDUSTRIAL-HUB-PROJECT.pdf",
  },
  {
    project: "Mombasa Ferry Terminal",
    category: "Best Student Project",
    result: "2nd Runner-up",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-163554.png",
    pdfHref: "/documents/MOMBASA-FERRY-TERMINAL-PROJECT.pdf",
  },
  {
    project: "Mzizi ECD Centre",
    category: "Best Student Project",
    result: "Honorable Mention",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-05-07-091425.png",
    pdfHref: "/documents/MZIZI-ECD-CENTRE-PROJECT.pdf",
  },
  {
    project: "Kenya Advanced Institute of Science and Technology",
    category: "Best Institutional Project",
    result: "Honorable Mention",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-05-06-170210.png",
    pdfHref: "/documents/KENYA-ADVANCED-INSTITUTE-OF-SCIENCE-OF-TECHNOLOGY-PROJECT.pdf",
  },
  {
    project: "Lodwar Referral Hospital",
    category: "Best Institutional Project",
    result: "Honorable Mention",
    image:
      "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-132017-e1780914111723.png",
    pdfHref: "/documents/LODWAR-REFERRAL-HOSPITAL-PROJECT.pdf",
  },
  {
    project: "Wajir County Referral Hospital",
    category: "Best Institutional Project",
    result: "Honorable Mention",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-05-06-152302.png",
    pdfHref: "/documents/WAJIR-REFERRAL-HOSPITAL.pdf",
  },
  {
    project: "Skanem",
    category: "Best Commercial Project",
    result: "Honorable Mention",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-161321.png",
    pdfHref: "/documents/SKANEM-PROJECT.pdf",
  },
  {
    project: "Global Trade Center",
    category: "Best Commercial Project",
    result: "Honorable Mention",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-05-06-142005.png",
    pdfHref: "/documents/GLOBAL-TRADE-CENTRE-PROJECT.pdf",
  },
  {
    project: "The Bidi Bidi Music and Arts Centre",
    category: "Best Empowerment and Social Equity Through Design",
    result: "Winner",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-05-06-131531.png",
    pdfHref: "/documents/THE-BIDI-BIDI-PERFORMING-ARTS-CENTRE-PROJECT.pdf",
  },
  {
    project: "Ufi at Kahawa Soweto Settlement",
    category: "Best Empowerment and Social Equity Through Design",
    result: "Runner-up",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-153946.png",
    pdfHref: "/documents/URBAN-FABRIC-INITIATIVE-PROJECT.pdf",
  },
  {
    project: "Standard Chartered Bank HQ",
    category: "Best Interior Environment",
    result: "Winner",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-152537.png",
    pdfHref: "/documents/STANDARD-CHATERED-BANK-HQ-PROJECT.pdf",
  },
  {
    project: "Lady of Victoria Monastery",
    category: "Best Religious / Monumental",
    result: "Winner",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-150532.png",
    pdfHref: "/documents/OUR-LADY-VICTORIA-MONASTERY-PROJECT.pdf",
  },
  {
    project: "Nairobi Waldorf School",
    category: "Best Africa (Re)presentation",
    result: "Winner",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-133208.png",
    pdfHref: "/documents/NAIROBI-WALDORF-SCHOOL-PROJECT.pdf",
  },
  {
    project: "Lodwar Referral Hospital",
    category: "Best Africa (Re)presentation",
    result: "Juror's Honourable Mention",
    image:
      "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-06-08-132017-e1780914111723.png",
    pdfHref: "/documents/LODWAR-REFERRAL-HOSPITAL-PROJECT.pdf",
  },
  {
    project: "The Bidi Bidi Music and Arts Centre",
    category: "Best Africa (Re)presentation",
    result: "Juror's Choice Honorable Mention",
    image: "https://aak.or.ke/wp-content/uploads/2026/06/Screenshot-2026-05-06-131531.png",
    pdfHref: "/documents/THE-BIDI-BIDI-PERFORMING-ARTS-CENTRE-PROJECT.pdf",
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
            name: "Awards & Honours",
            item: `${SITE_URL}/awards`,
          },
        ],
      },
      {
        "@type": "Event",
        name: "AAK-Basco DuraCoat Awards of Excellence in Architecture",
        description: DESCRIPTION,
        organizer: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

function AwardsPage() {
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
            <PageBreadcrumb trail={[{ label: "Awards & Honours" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <Trophy className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Recognising professional mastery</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                AAK-Basco DuraCoat Awards of Excellence in Architecture
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Hosted by the Architects Chapter, the Awards celebrate outstanding architectural
                achievement across Kenya and East Africa, recognising architects and project teams
                for innovation, creativity and excellence. Submitted projects must have been built
                and completed within the last five years (2020-2025), in any part of the world, by
                members of a participating association.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="why-enter-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Regional recognition"
              title={
                <span id="why-enter-title">Showcase your contribution to the urban future</span>
              }
              description="The AAK Awards of Excellence is the region's most prestigious honours programme, recognising outstanding achievement by professionals across all eight chapters of the association."
            />
            <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {whyEnter.map((item, i) => (
                <li key={item.title}>
                  <Reveal delay={i * 80} className="h-full">
                    <div className="h-full rounded-2xl border border-border p-6">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="categories-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Nine categories"
              title={<span id="categories-title">What's judged</span>}
              description="Open to members of the AAK, the Rwanda Institute of Architects, the Uganda Society of Architects and the Architectural Association of Tanzania."
            />
            <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, i) => (
                <li key={category.name}>
                  <Reveal delay={(i % 3) * 60} className="h-full">
                    <div className="h-full rounded-xl border border-border bg-card p-5">
                      <span className="font-display text-sm font-semibold text-foreground">
                        {category.name}
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="evaluation-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="How entries are judged"
              title={<span id="evaluation-title">Evaluation criteria</span>}
            />
            <ul className="mt-14 space-y-3">
              {evaluationCriteria.map((item, i) => (
                <li key={item.text}>
                  <Reveal delay={i * 60}>
                    <div className="flex items-center gap-5 rounded-xl border border-border p-5">
                      <span className="font-display text-2xl font-semibold tabular-nums text-primary">
                        {item.weight}
                      </span>
                      <p className="text-sm leading-relaxed text-foreground">{item.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="jury-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading eyebrow="Panel" title={<span id="jury-title">Jury members</span>} />
            <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {jury.map((member, i) => (
                <li key={member.name}>
                  <Reveal delay={i * 70}>
                    <div className="rounded-xl bg-card p-5">
                      <p className="font-display text-sm font-semibold text-foreground">
                        {member.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{member.org}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="winners-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="2024 cycle"
              title={<span id="winners-title">Winning submissions</span>}
            />
            <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {winners2024.map((winner, i) => (
                <li key={`${winner.project}-${winner.category}-${winner.result}`}>
                  <Reveal delay={(i % 3) * 60} className="h-full">
                    <a
                      href={winner.pdfHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
                    >
                      <div className="overflow-hidden bg-secondary">
                        <img
                          src={winner.image}
                          alt={winner.project}
                          loading="lazy"
                          className="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                            {winner.category}
                          </span>
                          <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foreground">
                            {winner.project}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">{winner.result}</span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" />
                        </div>
                      </div>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="cycle-2026-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="2026 cycle"
              title={<span id="cycle-2026-title">Eligibility and submission format</span>}
              description="This cycle's submission window has closed. The details below are kept as reference for the next call for entries."
            />
            <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
              <Reveal>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Eligible associations
                </h3>
                <ul className="mt-4 space-y-2">
                  {eligibleAssociations.map((org) => (
                    <li key={org} className="text-sm text-foreground">
                      {org}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Key dates and fees
                </h3>
                <dl className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Submission deadline</dt>
                    <dd className="mt-1 font-display text-sm font-semibold text-foreground">
                      18 March 2026
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Fee per project</dt>
                    <dd className="mt-1 font-display text-sm font-semibold text-foreground">
                      KES 5,500 · Paybill 988567
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Awards ceremony</dt>
                    <dd className="mt-1 font-display text-sm font-semibold text-foreground">
                      26 March 2026
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={80}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Submission format
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                  <li>
                    Maximum 8 A2 sheets in high resolution, PDF or JPEG. Clarity, quality and
                    completeness are assessed at shortlisting.
                  </li>
                  <li>1 A2 portrait sheet explaining the overall design concept.</li>
                  <li>
                    Up to 2 A2 sheets: ground floor plan (1:100) with topographical data, access,
                    roadways, landscaping and walkways, plus an upper or typical level plan (1:100).
                  </li>
                  <li>
                    Up to 4 A2 sheets: cross and longitudinal sections (1:100) with levels and
                    materials, plus 2 detailed elevations (1:100).
                  </li>
                  <li>
                    1 A2 sheet of 3D visualisations (perspectives, isometric, axonometric or
                    sectional).
                  </li>
                  <li>All drawings annotated with key design elements and principles.</li>
                  <li>
                    Compiled into a single hi-resolution PDF, uploaded via the submission portal.
                  </li>
                  <li>
                    Participating organisations receive one dinner ticket to the Awards Ceremony.
                  </li>
                </ul>
              </Reveal>
            </div>

            <Reveal delay={120} className="mt-10 rounded-2xl border border-border bg-card p-7">
              <h3 className="font-display text-lg font-semibold text-foreground">Terms</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Consent:</span> by submitting
                materials, entrants give AAK permission to store and publish all images and
                information for promotional, CPD and educational use, physical and on the web. It is
                the entrant's responsibility to obtain all necessary consents from other
                stakeholders, including project owners, prior to submission.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Exhibition:</span> submitted
                projects are shown to the public at an exhibition at the ADD Building, University of
                Nairobi, the dinner venue, or such other places as the planning team deems fit.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-border py-16 text-center lg:py-20">
          <div className="mx-auto max-w-xl px-6 lg:px-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Enter the next cycle
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Submissions open periodically through the AAK secretariat. Check the events calendar
              or contact the Architects Chapter for the next entry window, or view the 2026 cycle's
              submission portal for reference.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://forms.office.com/r/3tVqjPinXp"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                2026 submission portal
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
