import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/site/Reveal";
import { awardCategories } from "@/data/site";

export function Spotlight() {
  const reduceMotion = useReducedMotion();
  return (
    <section aria-labelledby="spotlight-title" className="bg-background pb-28 lg:pb-36">
      {/* The awards banner crosses the boundary from EventsStrip above —
          pulled up on top of that dark section instead of a gradient blend. */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.a
          href="/img/aak-duracoat-awards-of-excellence-2026.webp"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 -mt-12 block overflow-hidden shadow-2xl lg:-mt-16"
          initial={reduceMotion ? false : { opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/img/aak-duracoat-awards-of-excellence-2026.webp"
            alt="AAK Basco DuraCoat Awards of Excellence in Architecture campaign banner, dated 27 February 2026"
            loading="lazy"
            className="aspect-[2560/233] w-full object-cover"
          />
        </motion.a>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-12 lg:pt-20">
        <Reveal className="max-w-2xl lg:sticky lg:top-32 lg:self-start">
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

        <div>
          <div className="flex items-baseline justify-between border-b border-border pb-4">
            <span className="meta-label text-muted-foreground">The categories</span>
            <span className="meta-label text-muted-foreground">
              Projects completed 2020&ndash;2025
            </span>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-3">
            {awardCategories.map((category, i) => (
              <li
                key={category.name}
                className="border-b border-border sm:border-r sm:[&:nth-child(3n)]:border-r-0"
              >
                <Reveal delay={(i % 3) * 70} className="h-full">
                  <Link
                    to="/awards"
                    className="group flex h-full flex-row items-baseline gap-4 px-0 py-4 transition-colors hover:bg-secondary/60 sm:min-h-40 sm:flex-col sm:justify-between sm:gap-6 sm:p-5"
                  >
                    <span className="font-display text-sm text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-semibold leading-snug text-balance text-foreground">
                      {category.name.replace(/^Best /, "")}
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
