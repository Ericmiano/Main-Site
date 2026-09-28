import { useRef } from "react";
import {
  IconArrowLeft as ArrowLeft,
  IconArrowRight as ArrowRight,
  IconArrowUpRight as ArrowUpRight,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/site/Reveal";
import { awardCategories, awardWinners2024 } from "@/data/site";
import { useAutoRail } from "@/hooks/use-auto-rail";
import { cn } from "@/lib/utils";

const RANK = ["Winner", "1st Runner-up", "Runner-up", "2nd Runner-up"];

// Headline results only; honourable mentions stay on /awards.
const featured = awardWinners2024
  .filter((w) => RANK.includes(w.result))
  .sort((a, b) => Number(a.result !== "Winner") - Number(b.result !== "Winner"));

export function Spotlight() {
  const reduceMotion = useReducedMotion();
  const rail = useRef<HTMLOListElement>(null);
  const auto = useAutoRail(rail, 3000, { seamless: true });

  return (
    <section
      aria-labelledby="spotlight-title"
      className="bg-background pt-20 pb-28 lg:pt-28 lg:pb-36"
    >
      <motion.div
        className="mx-auto max-w-[1400px] px-6 lg:px-12"
        // Same initial markup as the server render; reduced motion just skips the tween.
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-end justify-between gap-6 pb-4">
          <p className="meta-label text-muted-foreground">
            Awards of Excellence &middot; 2024 winners
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={auto.prev}
              aria-label="Previous winners"
              className="hidden h-10 sm:flex w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={auto.next}
              aria-label="More winners"
              className="hidden h-10 sm:flex w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ol
          ref={rail}
          className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] lg:mr-[-3rem] lg:ml-0 lg:pl-0 lg:pr-12"
        >
          {/* Two copies for the seamless loop; the second is hidden from
              assistive tech and keyboard focus. */}
          {[0, 1].map((copy) => [
            ...featured.map((winner) => (
              <li
                key={`${copy}-${winner.project}-${winner.category}`}
                className="w-[78%] shrink-0 snap-start sm:w-72 lg:w-80"
                {...(copy ? { "aria-hidden": true, inert: true } : {})}
              >
                <a
                  href={winner.pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col bg-card shadow-xl ring-1 ring-foreground/5"
                >
                  <div className="overflow-hidden bg-secondary">
                    <img
                      src={winner.image}
                      alt={`${winner.project}, ${winner.category}`}
                      loading="lazy"
                      className="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span
                      className={cn(
                        "meta-label",
                        winner.result === "Winner" ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {winner.result}
                    </span>
                    <h3 className="font-display text-lg font-semibold leading-snug text-balance text-foreground">
                      {winner.project}
                    </h3>
                    <p className="mt-auto pt-2 text-xs leading-relaxed text-muted-foreground">
                      {winner.category}
                    </p>
                  </div>
                </a>
              </li>
            )),
            <li
              key={`${copy}-all-winners`}
              className="w-[78%] shrink-0 snap-start sm:w-72 lg:w-80"
              {...(copy ? { "aria-hidden": true, inert: true } : {})}
            >
              <Link
                to="/awards"
                className="group flex h-full min-h-72 flex-col justify-between bg-ink-deep p-6 text-background shadow-xl"
              >
                <span className="meta-label text-background/60">
                  {awardWinners2024.length} recognised projects
                </span>
                <span className="font-display text-2xl font-semibold leading-tight">
                  See every winner, runner-up and honourable mention
                  <ArrowUpRight className="ml-2 inline h-5 w-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>,
          ])}
        </ol>
      </motion.div>

      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-12 lg:pt-20">
        <Reveal className="max-w-2xl lg:sticky lg:top-[calc(var(--header-h,5rem)+var(--register-h,0px)+2rem)] lg:self-start">
          <div className="meta-label text-muted-foreground">
            In the spotlight &middot; Awards of Excellence
          </div>
          <h2 id="spotlight-title" className="type-section mt-5 text-foreground">
            AAK &ndash; Basco DuraCoat{" "}
            <span className="font-accent italic font-medium">Awards of Excellence</span> in
            Architecture
          </h2>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
            Hosted by the Architects Chapter, the Awards of Excellence recognise outstanding
            architectural achievement across Kenya and East Africa. The 2026 cycle covers projects
            completed between 2020 and 2025 across nine categories, from Best Residential and
            Commercial to Best Student Project.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link to="/awards" className="group btn-primary">
              See the winning projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chapters/$slug"
              params={{ slug: "architects" }}
              className="link-quiet text-foreground"
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
