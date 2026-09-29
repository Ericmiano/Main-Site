import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight, IconSchool as GraduationCap } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Student Affiliates | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK's six student affiliates: built-environment student associations at the Technical University of Kenya, JKUAT, the University of Nairobi and Kenyatta University.";

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

// AAK's recognised student affiliates, as confirmed by the secretariat.
const affiliates: { abbr?: string; name: string; university: string }[] = [
  {
    name: "Construction Students Association",
    university: "Technical University of Kenya",
  },
  {
    abbr: "ICOMSO",
    name: "Interactive Construction Management Students’ Organisation",
    university: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
  },
  {
    abbr: "CRESA",
    name: "Construction and Real Estate Students Association",
    university: "University of Nairobi",
  },
  {
    abbr: "AECAS",
    name: "Association of Engineering Construction and Architecture Students",
    university: "Technical University of Kenya",
  },
  {
    abbr: "ASA",
    name: "Architectural Students Association",
    university: "Kenyatta University",
  },
  {
    abbr: "ASATUK",
    name: "Architecture Student Organization",
    university: "Technical University of Kenya",
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
              <div className="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>For students</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Student affiliates
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                AAK supports student organisations for those studying the built environment,
                recognising six affiliates across four universities.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="affiliates-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="affiliates-title" className="sr-only">
              Student affiliate organisations
            </h2>
            <ul data-stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {affiliates.map((affiliate) => (
                <li key={affiliate.name}>
                  <div className="flex h-full flex-col rounded-2xl border border-border p-7">
                    <span className="meta-label flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {affiliate.university}
                    </span>
                    {affiliate.abbr ? (
                      <span className="mt-5 font-display text-3xl font-semibold tracking-tight text-primary">
                        {affiliate.abbr}
                      </span>
                    ) : null}
                    <h3
                      className={
                        affiliate.abbr
                          ? "mt-3 font-display text-lg font-semibold leading-snug text-foreground"
                          : "mt-5 font-display text-2xl font-semibold leading-snug text-foreground"
                      }
                    >
                      {affiliate.name}
                    </h3>
                  </div>
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
            <Link to="/membership" className="group btn-primary mt-7">
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
