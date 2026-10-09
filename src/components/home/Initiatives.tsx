import type { CSSProperties } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { initiatives } from "@/data/site";
import { InitiativeEmblem } from "@/components/site/InitiativeEmblem";
import { InitiativeLink } from "@/components/site/InitiativeLink";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { cn } from "@/lib/utils";

// Homepage display order only — leads with Grow A Classroom. The nav menu's
// initiatives panel keeps the canonical `initiatives` order from site.ts.
const [featured, ...rest] = [
  ...initiatives.filter((initiative) => initiative.slug === "grow-a-classroom"),
  ...initiatives.filter((initiative) => initiative.slug !== "grow-a-classroom"),
];

const toneClass = (tone: string) => (tone === "green" ? "text-sustain" : "text-primary");

export function Initiatives() {
  if (!featured) return null;

  return (
    <section
      id="initiatives"
      aria-labelledby="initiatives-title"
      className="bg-paper-earth py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <SectionRule index="04" label="Initiatives" />
          <h2 id="initiatives-title" className="type-section mt-8 text-foreground">
            AAK Initiatives
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70">
            Long-running initiatives where our members put professional expertise to work for Kenyan
            communities.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal wipe>
            <InitiativeLink initiative={featured} className="group block">
              <div className="relative overflow-hidden bg-secondary">
                {featured.emblem ? (
                  <InitiativeEmblem
                    src={featured.emblem}
                    title={featured.title}
                    decorative
                    className="absolute bottom-4 left-4 z-10 h-16 w-16 p-2 sm:h-20 sm:w-20 sm:p-2.5"
                  />
                ) : null}
                <img
                  src={featured.image}
                  style={{ viewTransitionName: `initiative-${featured.slug}` }}
                  alt={`${featured.title} initiative`}
                  loading="lazy"
                  className="photo-grade aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="meta-label text-foreground/70">01</span>
                <span className={cn("meta-label", toneClass(featured.tone))}>
                  {featured.eyebrow} &middot; Kenya
                </span>
              </div>
              <h3
                style={{ "--brand": featured.brand?.light ?? "var(--foreground)" } as CSSProperties}
                className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-foreground transition-colors duration-300 group-hover:text-[var(--brand)] sm:text-4xl"
              >
                {featured.title}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/70">
                {featured.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                {featured.cta}
                <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </InitiativeLink>
          </Reveal>

          <ol className="border-t border-foreground/15">
            {rest.map((initiative, i) => (
              <li key={initiative.id} className="border-b border-foreground/15">
                <Reveal delay={i * 60}>
                  <InitiativeLink
                    initiative={initiative}
                    className="group grid grid-cols-[5.5rem_1fr] items-center gap-5 py-5 sm:grid-cols-[7rem_1fr]"
                  >
                    <div className="relative overflow-hidden bg-secondary">
                      {initiative.emblem ? (
                        <InitiativeEmblem
                          src={initiative.emblem}
                          title={initiative.title}
                          decorative
                          className="absolute bottom-1.5 left-1.5 z-10 h-8 w-8 rounded-lg p-1 sm:h-9 sm:w-9"
                        />
                      ) : null}
                      <img
                        src={initiative.image}
                        style={{ viewTransitionName: `initiative-${initiative.slug}` }}
                        alt=""
                        loading="lazy"
                        className="photo-grade aspect-4/3 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-3">
                        <span className="meta-label text-foreground/70">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <span className={cn("meta-label truncate", toneClass(initiative.tone))}>
                          {initiative.eyebrow}
                        </span>
                      </div>
                      <h3
                        style={
                          {
                            "--brand": initiative.brand?.light ?? "var(--foreground)",
                          } as CSSProperties
                        }
                        className="mt-1.5 flex items-center gap-2 font-display text-xl font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-[var(--brand)]"
                      >
                        {initiative.title}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground/70">
                        {initiative.description}
                      </p>
                    </div>
                  </InitiativeLink>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
