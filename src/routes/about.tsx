import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CountUp } from "@/components/site/CountUp";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { chapters, regionalBranches } from "@/data/site";

const SITE_URL = "https://aak.or.ke";
const TITLE = "About Us | Architectural Association of Kenya";
const DESCRIPTION =
  "Established in 1967, AAK is Kenya's leading association for professionals in the built and natural environment: eight chapters, three regional branches, registered under the Societies Act.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: AboutPage,
});

const objectives = [
  {
    title: "Policy & Standards",
    body: "Co-ordinate the activities of professionals concerned with the built and natural environment in Kenya, promoting integrity and directing members in all matters of professional practice.",
  },
  {
    title: "Education",
    body: "Advance the science and art of planning and building by developing standards of professional education, training and practice, and facilitate matters of mutual interest.",
  },
  {
    title: "Public Interest",
    body: "Create public awareness by marketing the services of member professions and providing professional opinions on matters pertaining to violation of statutes.",
  },
  {
    title: "Development",
    body: "Establish and accredit Continuing Professional Development programmes and encourage collaboration of professionals and societies in the built and natural environment.",
  },
  {
    title: "Advocacy",
    body: "Liaise with Government and regulatory agencies on matters affecting registration and licensing of professionals in the built and natural environment.",
  },
  {
    title: "Conservation",
    body: "Maintain and protect the heritage of the built and natural environment through research and dissemination of information.",
  },
  {
    title: "Community",
    body: "Offer community services by participating in the enhancement of the built and natural environment, maintaining building information services, and monitoring quality assurance on materials.",
  },
  {
    title: "Cooperation",
    body: "Foster national, regional and international co-operation in matters dealing with the professions related to the built and natural environment.",
  },
  {
    title: "Publications",
    body: "Publish documents and publications for the benefit of members and the general public in matters of the built and natural environment, and create revenue-generating activities.",
  },
];

const coreValues = ["Professionalism", "Integrity", "Transparency", "Accountability", "Innovation"];

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "About Us", item: `${SITE_URL}/about` },
        ],
      },
      {
        "@type": "AboutPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/about`,
        mainEntity: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

function AboutPage() {
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
            <PageBreadcrumb trail={[{ label: "About Us" }]} />

            <Reveal className="mt-8 max-w-3xl">
              <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <span>Who we are</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                Promoting excellence in the built environment.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Established in 1967, the Architectural Association of Kenya (AAK) is Kenya&rsquo;s
                leading association for professionals in the built and natural environment,
                incorporating Architects, Quantity Surveyors, Town Planners, Engineers, Landscape
                Architects, Environmental Design Consultants, Construction Project Managers and
                Interior Designers.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                The Association is registered under the Societies Act and brings together
                professionals from the private sector, public sector and academia, acting as a link
                between professionals and stakeholders including policymakers, manufacturers, real
                estate developers and financial institutions.
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { k: 1967, v: "Registered since" },
                { k: 8, v: "Professional chapters" },
                { k: 3, v: "Regional branches" },
                { k: 59, v: "Years of excellence" },
              ].map((stat) => (
                <div key={stat.v}>
                  <CountUp
                    value={stat.k}
                    grouped={stat.k !== 1967}
                    className="block font-display text-3xl font-semibold tabular-nums text-foreground"
                  />
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.v}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="mission-title" className="border-t border-border py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="mission-title" className="sr-only">
              Mission, vision and core values
            </h2>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <Reveal>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Our Mission
                </span>
                <p className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground">
                  To promote professionalism and integrity in the built and natural environment,
                  ensuring that every member adheres to the highest global standards of practice and
                  ethics.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Our Vision
                </span>
                <p className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground">
                  To be the leading professional organization in the built and natural environment
                  in the region, driving innovation and sustainable development for future
                  generations.
                </p>
              </Reveal>
            </div>

            <Reveal delay={160} className="mt-14 border-t border-border pt-10">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Our Core Values
              </span>
              <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-2">
                {coreValues.map((value) => (
                  <li key={value} className="font-display text-lg font-semibold text-foreground">
                    {value}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section
          aria-labelledby="objectives-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Our objectives"
              title={
                <span id="objectives-title">
                  Defining our commitment to professional excellence
                </span>
              }
            />
            <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {objectives.map((objective, i) => (
                <li key={objective.title}>
                  <Reveal delay={i * 60} className="h-full rounded-2xl bg-card p-7">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {objective.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {objective.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="structure-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Structure"
              title={<span id="structure-title">Eight chapters, three regional branches</span>}
              description="Every practising discipline in the built and natural environment has a home chapter; three branches extend that structure along the coast, the west and the south rift."
            />
            <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {chapters.map((chapter, i) => (
                  <li key={chapter.name}>
                    <Reveal delay={i * 50}>
                      <Link
                        to="/chapters/$slug"
                        params={{ slug: chapter.slug }}
                        className="block rounded-xl border border-border px-4 py-4 text-sm font-medium text-foreground transition-colors hover:border-primary/60"
                      >
                        {chapter.name}
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl bg-secondary/60 p-7">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Regional branches
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {regionalBranches.map((branch) => (
                    <li key={branch.chapter} className="flex items-center justify-between gap-3">
                      <span>{branch.chapter}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/team"
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  Meet the leadership
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </Link>
              </div>
            </div>

            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Secretariat.</span> The AAK
              Secretariat manages the day-to-day operations of the Association and serves as the
              primary point of contact for members and stakeholders.
            </p>
          </div>
        </section>

        <section className="border-t border-border py-16 text-center lg:py-20">
          <div className="mx-auto max-w-xl px-6 lg:px-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Join the association
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Membership gives you standing, CPD access and a voice across all eight chapters.
            </p>
            <a
              href="https://members.aak.or.ke/application/registerv3/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              Start your application
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
