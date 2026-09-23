import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { initiatives } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { cn } from "@/lib/utils";

// Homepage display order only — leads with Grow A Classroom. The nav menu's
// initiatives panel keeps the canonical `initiatives` order from site.ts.
const orderedInitiatives = [
  ...initiatives.filter((initiative) => initiative.slug === "grow-a-classroom"),
  ...initiatives.filter((initiative) => initiative.slug !== "grow-a-classroom"),
];

export function Initiatives() {
  return (
    <section
      id="initiatives"
      aria-labelledby="initiatives-title"
      className="bg-paper-earth py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <SectionRule index="04" label="Public impact" />
          <h2
            id="initiatives-title"
            className="mt-8 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            Programmes we run for the public good.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70">
            Long-running initiatives where our members put professional expertise to work for Kenyan
            communities.
          </p>
        </Reveal>

        <ul className="mt-16 border-t border-foreground/15">
          {orderedInitiatives.map((initiative, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={initiative.id} className="border-b border-foreground/15 py-12 lg:py-16">
                <Reveal delay={(i % 3) * 60}>
                  <Link
                    to="/initiatives/$slug"
                    params={{ slug: initiative.slug }}
                    className={cn(
                      "group grid items-center gap-8 lg:gap-16",
                      i === 0
                        ? "lg:grid-cols-1"
                        : flip
                          ? "lg:grid-cols-[1.3fr_1fr] lg:[&>*:first-child]:order-2"
                          : "lg:grid-cols-[1fr_1.3fr]",
                    )}
                  >
                    <div>
                      <span className="font-display text-lg text-foreground/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={cn(
                          "mt-2 font-display font-semibold tracking-tight text-balance text-foreground",
                          i === 0 ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
                        )}
                      >
                        {initiative.title}
                      </h3>
                      <span
                        className={cn(
                          "meta-label mt-3 block",
                          initiative.tone === "green" ? "text-sustain" : "text-primary",
                        )}
                      >
                        {initiative.eyebrow} &middot; Kenya
                      </span>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/70">
                        {initiative.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {initiative.cta}
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      </span>
                    </div>

                    <div
                      className={cn(
                        "overflow-hidden bg-secondary",
                        i === 0 ? "aspect-21/9" : "aspect-4/3",
                      )}
                    >
                      <img
                        src={initiative.image}
                        alt={`${initiative.title} initiative`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
