import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";

const paths = [
  {
    title: "Become a member",
    body: "Join the chapter that matches your discipline and access CPD, advocacy and professional networks.",
    href: "https://members.aak.or.ke/register",
    cta: "Start application",
  },
  {
    title: "Validate a certificate",
    body: "Confirm that a practitioner's AAK membership certificate is genuine and current.",
    href: "https://members.aak.or.ke/validate",
    cta: "Check a certificate",
  },
  {
    title: "Find a professional",
    body: "Search the member directory for architects, surveyors, planners and engineers near you.",
    href: "https://members.aak.or.ke/directory",
    cta: "Open the directory",
  },
];

export function Membership() {
  return (
    <section
      id="membership"
      aria-labelledby="membership-title"
      className="bg-primary py-24 text-primary-foreground lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-3xl">
          <SectionRule index="08" label="Your AAK" tone="primary" />
          <h2
            id="membership-title"
            className="mt-8 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Practise with the standing of a recognised professional body.
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-primary-foreground/25 md:grid md:grid-cols-3">
          {paths.map((path, i) => (
            <div
              key={path.title}
              className="border-b border-primary-foreground/25 py-10 md:border-b-0 md:border-r md:px-10 md:py-0 md:first:pl-0 md:last:border-r-0 md:last:pr-0 lg:px-14"
            >
              <Reveal delay={i * 80} className="md:h-full md:py-10">
                <span className="font-display text-sm text-primary-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{path.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90">
                  {path.body}
                </p>
                <a
                  href={path.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2 border-b border-primary-foreground/50 pb-1 text-sm font-semibold text-primary-foreground transition-colors hover:border-primary-foreground"
                >
                  {path.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
