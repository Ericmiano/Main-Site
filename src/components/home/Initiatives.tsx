import { useState } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { initiatives } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

// Homepage display order only — leads with Grow A Classroom. The nav menu's
// initiatives panel keeps the canonical `initiatives` order from site.ts.
const orderedInitiatives = [
  ...initiatives.filter((initiative) => initiative.slug === "grow-a-classroom"),
  ...initiatives.filter((initiative) => initiative.slug !== "grow-a-classroom"),
];

export function Initiatives() {
  const [active, setActive] = useState(0);
  const selected = orderedInitiatives[active];
  if (!selected) return null;

  return (
    <section
      id="initiatives"
      aria-labelledby="initiatives-title"
      className="bg-ink-deep py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <p className="meta-label text-primary">Public impact</p>
          <h2
            id="initiatives-title"
            className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-balance text-background sm:text-5xl lg:text-6xl"
          >
            Programmes we run for the public good.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-background/65">
            Long-running initiatives where our members put professional expertise to work for Kenyan
            communities. Select one to explore it.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Link
            to="/initiatives/$slug"
            params={{ slug: selected.slug }}
            className="group block overflow-hidden rounded-2xl bg-secondary"
          >
            <div className="relative aspect-4/3 lg:aspect-auto lg:h-[32rem]">
              <img
                src={selected.image}
                alt={`${selected.title} initiative`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-deep/90 to-transparent p-8">
                <span
                  className={cn(
                    "meta-label",
                    selected.tone === "green" ? "text-sustain" : "text-primary",
                  )}
                >
                  {selected.eyebrow}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-background sm:text-3xl">
                  {selected.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-background/75">
                  {selected.description}
                </p>
                <span
                  className={cn(
                    "mt-5 inline-flex items-center gap-2 text-sm font-semibold",
                    selected.tone === "green" ? "text-sustain" : "text-primary",
                  )}
                >
                  {selected.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          <ul className="border-t border-background/12">
            {orderedInitiatives.map((initiative, i) => (
              <li key={initiative.id} className="border-b border-background/12">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={cn(
                        "meta-label",
                        i === active ? "text-primary" : "text-background/35",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-xl font-semibold transition-colors duration-300 sm:text-2xl",
                        i === active ? "text-background" : "text-background/40",
                      )}
                    >
                      {initiative.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={cn(
                      "h-5 w-5 shrink-0 transition-opacity duration-300",
                      i === active ? "opacity-100 text-primary" : "opacity-0",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
