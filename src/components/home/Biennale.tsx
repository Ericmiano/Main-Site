import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";

const BIENNALE_URL = "https://www.biennale.aak.or.ke/";

export function Biennale() {
  return (
    <section
      aria-labelledby="biennale-title"
      className="overflow-hidden bg-ink-deep py-32 lg:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <SectionRule index="03" label="Biennale" tone="dark" />
          <div className="mt-8 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
            Shifting the Center &middot; 7&ndash;12 September 2026
          </div>
          <h2
            id="biennale-title"
            className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-background sm:text-6xl lg:text-7xl"
          >
            AAK&rsquo;s first{" "}
            <span className="font-accent italic font-medium text-primary">Nairobi Biennale</span> of
            Architecture &amp; Art
          </h2>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-background/70">
            Exhibitions, conversations and public programming exploring Africa&rsquo;s built
            environment, under the theme &ldquo;Shifting the Center: From Fragility to
            Resilience.&rdquo; Held at the ASK Nairobi Showground, Jamhuri Park.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href={BIENNALE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              Explore the Biennale
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/events/$slug"
              params={{ slug: "nairobi-biennale-2026" }}
              className="link-underline text-sm font-medium text-background/80"
            >
              Event details on AAK
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-16">
          <a
            href={BIENNALE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden bg-background/5"
          >
            <img
              src="/biennale/featured.webp"
              alt="Exhibitors and AAK members at the Nairobi Biennale of Architecture & Art 2026"
              loading="lazy"
              className="aspect-3/2 w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
