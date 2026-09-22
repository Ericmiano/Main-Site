import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export function Spotlight() {
  return (
    <section
      aria-labelledby="spotlight-title"
      className="overflow-hidden bg-background py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
            In the spotlight &middot; 2026 winners announced
          </div>
          <h2
            id="spotlight-title"
            className="mt-5 font-display text-3xl font-semibold leading-[1.04] tracking-tight text-balance text-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            AAK &ndash; Basco DuraCoat{" "}
            <span className="font-accent italic font-medium text-primary">
              Awards of Excellence
            </span>{" "}
            in Architecture
          </h2>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
            Hosted by the Architects Chapter, the Awards of Excellence recognise outstanding
            architectural achievement across Kenya and East Africa. The 2026 cycle judged projects
            completed between 2020 and 2025 across nine categories, from Best Residential and
            Commercial to Best Student Project.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              to="/awards"
              className="group inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              See the winning projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chapters/$slug"
              params={{ slug: "architects" }}
              className="link-underline text-sm font-medium text-foreground"
            >
              About the Architects Chapter
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <figure className="overflow-hidden rounded-2xl bg-secondary">
            <img
              src="https://aak.or.ke/wp-content/uploads/2026/01/AAK-DURACOAT-AWARDS-OF-EXCELLENCE-2026-1-scaled.webp"
              alt="AAK Basco DuraCoat Awards of Excellence in Architecture campaign banner, dated 27 February 2026"
              loading="lazy"
              className="aspect-[2560/233] w-full object-cover"
            />
            <figcaption className="border-t border-border bg-card px-5 py-3 text-xs text-muted-foreground">
              Original call-for-entries campaign artwork for the 2026 cycle. Entries have since
              closed and winners are announced above.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
