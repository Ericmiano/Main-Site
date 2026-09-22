import { createFileRoute } from "@tanstack/react-router";
import {
  IconArrowUpRight as ArrowUpRight,
  IconCircleCheck as BadgeCheck,
  IconCashBanknote as Banknote,
  IconHeartHandshake as HeartHandshake,
  IconNews as Newspaper,
  IconShieldCheck as ShieldCheck,
  IconUsers as Users,
  IconUsersGroup as Vote,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Membership | Architectural Association of Kenya";
const DESCRIPTION =
  "How to join AAK, membership tiers and fees, and the benefits of belonging to Kenya's professional association for the built and natural environment.";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/membership` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/membership` }],
  }),
  component: MembershipPage,
});

const steps = [
  {
    step: "01",
    title: "Check requirements",
    body: "Membership tiers accommodate students, technicians, graduates and registered professionals across all eight chapters. Confirm which tier fits your qualifications.",
  },
  {
    step: "02",
    title: "Register",
    body: "Create your application at the member portal, members.aak.or.ke/register, and submit your professional and academic details.",
  },
  {
    step: "03",
    title: "Log in",
    body: "Once approved, sign in at members.aak.or.ke/login to manage your subscription, CPD record and chapter activity.",
  },
  {
    step: "04",
    title: "Validate",
    body: "Anyone can confirm a member's certificate is genuine and current at members.aak.or.ke/validate.",
  },
];

const fees: { category: string; entrance: string; annual: string }[] = [
  { category: "Corporate", entrance: "1,000.00", annual: "7,500.00" },
  { category: "Licentiate", entrance: "1,000.00", annual: "5,500.00" },
  { category: "Graduate", entrance: "600.00", annual: "3,750.00" },
  { category: "Student", entrance: "None", annual: "500.00" },
  { category: "Firm", entrance: "2,000.00", annual: "15,000.00" },
  { category: "Technician", entrance: "600.00", annual: "1,500.00" },
  { category: "Visiting", entrance: "None", annual: "75,000.00" },
  { category: "Institutional Members", entrance: "5,000.00", annual: "50,000.00" },
];

const applicationProcess = [
  {
    step: "01",
    title: "Complete the application",
    body: "Complete the official application form and sign the declaration as required under By Law BL 4.0 of the AAK Constitution.",
  },
  {
    step: "02",
    title: "Get proposed and seconded",
    body: "All applicants must be proposed and seconded by corporate members of the chapter being applied for.",
  },
  {
    step: "03",
    title: "Submit to the Secretariat",
    body: "Submit the application to the Secretariat with the prescribed entrance fee and the first annual subscription.",
  },
  {
    step: "04",
    title: "Chapter and Council approval",
    body: "Approval is granted through the Chapter Chairman and confirmed by the Governing Council.",
  },
];

const electionCriteria = [
  "Election is determined by a majority vote of the Chapter Council.",
  "Rejections include a summary of reasons; re-application is permitted after twelve months.",
  "Successful candidates are entered into the Register of Association by the Honorary Registrar.",
  "Official Certificates of Membership are issued by the Governing Council.",
];

const benefits = [
  {
    icon: Users,
    text: "Attend general meetings of the Association and of your Chapter or Branch.",
  },
  {
    icon: BadgeCheck,
    text: "Participate in all Association, Chapter, Branch or Group activities and professional forums.",
  },
  {
    icon: Vote,
    text: "Voting eligibility for corporate members at General Meetings and Governing Council sessions.",
  },
  { icon: Banknote, text: "AAK Sacco access.", href: "https://sacco.aak.or.ke/" },
  { icon: ShieldCheck, text: "Medical schemes." },
  { icon: Newspaper, text: "CPD presentations and industry journals." },
  { icon: HeartHandshake, text: "Benevolent funds." },
  { icon: ShieldCheck, text: "Professional insurance." },
];

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Membership", item: `${SITE_URL}/membership` },
        ],
      },
    ],
  };
}

function MembershipPage() {
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
            <PageBreadcrumb trail={[{ label: "Membership" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Practise with the standing of a recognised professional body.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
              <a
                href="https://members.aak.or.ke/register"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start your application
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="join-steps-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="How to join"
              title={<span id="join-steps-title">Four steps to membership</span>}
            />
            <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
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
          </div>
        </section>

        <section
          aria-labelledby="fees-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Fees & subscriptions"
              title={<span id="fees-title">Membership tiers</span>}
              description="All fees are quoted in Kenya Shillings (KES) and are subject to periodic review by the AAK Council."
            />
            <div className="mt-14 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  AAK membership entrance and annual subscription fees
                </caption>
                <thead>
                  <tr className="border-b border-border bg-secondary/60 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Entrance fee (KES)
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Annual subscription (KES)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((row) => (
                    <tr key={row.category} className="border-b border-border last:border-b-0">
                      <td className="px-6 py-4 font-semibold text-foreground">{row.category}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.entrance}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section aria-labelledby="benefits-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Benefits"
              title={<span id="benefits-title">What membership includes</span>}
            />
            <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map(({ icon: Icon, text, href }, i) => (
                <li key={text}>
                  <Reveal delay={(i % 4) * 60} className="h-full">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-full flex-col gap-3 rounded-2xl bg-card p-6 transition-colors hover:bg-secondary"
                      >
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        <p className="link-underline text-sm leading-relaxed text-foreground">
                          {text}
                        </p>
                      </a>
                    ) : (
                      <div className="flex h-full flex-col gap-3 rounded-2xl bg-card p-6">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        <p className="text-sm leading-relaxed text-foreground">{text}</p>
                      </div>
                    )}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="application-process-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Registration pathway"
              title={<span id="application-process-title">Application process</span>}
            />
            <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {applicationProcess.map((step, i) => (
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
          </div>
        </section>

        <section aria-labelledby="election-criteria-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Governance and validation"
              title={<span id="election-criteria-title">Election criteria</span>}
            />
            <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {electionCriteria.map((item, i) => (
                <li key={item}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="flex h-full items-start gap-3 rounded-xl border border-border p-5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true" />
                      <p className="text-sm leading-relaxed text-foreground">{item}</p>
                    </div>
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
