import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { initiatives } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export function Initiatives() {
  const [featured, ...rest] = initiatives;
  if (!featured) return null;

  return (
    <section
      id="initiatives"
      aria-labelledby="initiatives-title"
      className="bg-ink-deep py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
            <span>Projects &amp; initiatives</span>
          </div>
          <h2
            id="initiatives-title"
            className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-balance text-background sm:text-5xl lg:text-6xl"
          >
            Programmes we run for the public good
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-background/65">
            Long-running initiatives where our members put professional expertise to work for Kenyan
            communities.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <div className="group grid overflow-hidden rounded-2xl border border-background/12 bg-background/5 transition-colors duration-300 hover:border-primary/60 hover:bg-background/10 lg:grid-cols-2">
            <Link to="/initiatives/$slug" params={{ slug: featured.slug }} className="contents">
              <div className="overflow-hidden bg-secondary">
                <img
                  src={featured.image}
                  alt={`${featured.title} initiative`}
                  loading="lazy"
                  className="aspect-16/10 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 lg:aspect-auto"
                />
              </div>
              <div className="relative z-20 flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                <span
                  className={cn(
                    "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em]",
                    featured.tone === "green" ? "text-sustain" : "text-primary",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 w-1.5",
                      featured.tone === "green" ? "bg-sustain" : "bg-primary",
                    )}
                  />
                  Flagship &middot; {featured.eyebrow}
                </span>
                <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-balance text-background sm:text-4xl">
                  {featured.title}
                </h3>
                <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-background/65">
                  {featured.description}
                </p>
                <span
                  className={cn(
                    "mt-8 inline-flex w-fit items-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold transition-transform duration-300 group-hover:-translate-y-0.5",
                    featured.tone === "green"
                      ? "bg-sustain text-sustain-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {featured.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </Reveal>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((initiative, i) => (
            <li key={initiative.id}>
              <Reveal delay={i * 100} className="h-full">
                <div className="h-full rounded-2xl border border-background/12 bg-background/5 transition-colors duration-300 hover:border-primary/60 hover:bg-background/10">
                  <Link
                    to="/initiatives/$slug"
                    params={{ slug: initiative.slug }}
                    className="group flex h-full flex-col"
                  >
                    <div className="overflow-hidden bg-secondary">
                      <img
                        src={initiative.image}
                        alt={`${initiative.title} initiative`}
                        loading="lazy"
                        className="aspect-16/10 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="relative z-20 flex flex-1 flex-col p-8">
                      <span
                        className={cn(
                          "text-[11px] font-semibold uppercase tracking-[0.16em]",
                          initiative.tone === "green" ? "text-sustain" : "text-primary",
                        )}
                      >
                        {initiative.eyebrow}
                      </span>
                      <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-background">
                        {initiative.title}
                      </h3>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-background/65">
                        {initiative.description}
                      </p>
                      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-background">
                        {initiative.cta}
                        <ArrowUpRight
                          className={cn(
                            "h-4 w-4",
                            initiative.tone === "green" ? "text-sustain" : "text-primary",
                          )}
                        />
                      </span>
                    </div>
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
