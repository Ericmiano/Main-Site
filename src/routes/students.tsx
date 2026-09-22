import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight, IconSchool as GraduationCap } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Student Affiliates | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK supports student organisations across the architectural industry: the Architecture Students Association, CRESA and PLASA.";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/students` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/students` }],
  }),
  component: StudentsPage,
});

const affiliates = [
  {
    abbr: "ASA",
    name: "Architecture Students Association",
    body: "Represents students in architecture programmes, connecting them to AAK's Architects Chapter and its professional network from the start of their studies.",
  },
  {
    abbr: "CRESA",
    name: "Construction & Real Estate Students Association",
    body: "Nurtures and exposes students of real estate and construction management (RECM) to their profession and the construction industry through internships, career talks, industrial visits, social welfare activities and community development.",
  },
  {
    abbr: "PLASA",
    name: "Planning Students Association",
    body: "Represents students in planning programmes, linking them to AAK's Town Planners Chapter and the wider profession.",
  },
];

function StudentsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Student Affiliates" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>For students</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Student affiliates
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                AAK supports student organisations for those studying elements of the architectural
                industry, recognising three affiliates.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="affiliates-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="affiliates-title" className="sr-only">
              Student affiliate organisations
            </h2>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {affiliates.map((affiliate, i) => (
                <li key={affiliate.abbr}>
                  <Reveal delay={i * 80} className="h-full">
                    <div className="flex h-full flex-col rounded-2xl border border-border p-7">
                      <span className="font-display text-3xl font-semibold tracking-tight text-primary">
                        {affiliate.abbr}
                      </span>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-foreground">
                        {affiliate.name}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {affiliate.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border py-16 text-center lg:py-20">
          <div className="mx-auto max-w-xl px-6 lg:px-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Ready to join?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Student membership carries a reduced subscription. See the fees table for the current
              rate.
            </p>
            <Link
              to="/membership"
              className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              View membership &amp; fees
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
