import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Reveal } from "@/components/site/Reveal";

export function Spotlight() {
  return (
    <section
      aria-labelledby="spotlight-title"
      className="overflow-hidden bg-background pb-28 lg:pb-36"
    >
      {/* The awards banner crosses the boundary from EventsStrip above —
          pulled up on top of that dark section instead of a gradient blend. */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.a
          href="https://aak.or.ke/wp-content/uploads/2026/01/AAK-DURACOAT-AWARDS-OF-EXCELLENCE-2026-1-scaled.webp"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 -mt-24 block max-w-xl overflow-hidden shadow-2xl lg:-mt-36"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="https://aak.or.ke/wp-content/uploads/2026/01/AAK-DURACOAT-AWARDS-OF-EXCELLENCE-2026-1-scaled.webp"
            alt="AAK Basco DuraCoat Awards of Excellence in Architecture campaign banner, dated 27 February 2026"
            loading="lazy"
            className="aspect-3/2 w-full object-cover"
          />
        </motion.a>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-14 lg:px-12 lg:pt-20">
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
      </div>
    </section>
  );
}
