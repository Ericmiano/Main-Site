import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { conventionMagazine2026 as magazine, media } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { Lightbox } from "@/components/site/Lightbox";
import { thumbnailFor } from "@/lib/thumbnail";
import { cn } from "@/lib/utils";
import { useAutoRail } from "@/hooks/use-auto-rail";

export function MediaGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const auto = useAutoRail(rail);
  const activeItem = openIndex !== null ? media[openIndex] : undefined;

  const navigate = (direction: -1 | 1) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + media.length) % media.length;
    });
  };

  return (
    // Charcoal "gallery wall": the light plates read as exhibited work.
    <section id="media" aria-labelledby="media-title" className="bg-ink-deep py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <SectionRule index="06" label="The archive" tone="dark" />
            <h2 id="media-title" className="type-section mt-8 text-background">
              Work, events and award-winning projects.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-background/70">
              A rolling record of what members are building, the sites we visit and the projects
              recognised at the Awards of Excellence.
            </p>
          </Reveal>

          {/* New: a small card for the latest AAK publication. */}
          <Reveal delay={120} className="lg:shrink-0">
            <a
              href={magazine.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex max-w-sm items-center gap-4 rounded-xl border border-background/15 p-3 pr-5 transition-colors hover:border-background/40 hover:bg-background/5"
            >
              <img
                src={magazine.cover}
                alt={magazine.coverAlt}
                width={360}
                height={509}
                loading="lazy"
                className="w-16 shrink-0 rounded-sm shadow-lg transition-transform duration-300 group-hover:-rotate-2"
              />
              <span className="min-w-0">
                <span className="meta-label block text-background/70">New</span>
                <span className="mt-1 block font-display text-base font-semibold leading-snug text-background">
                  {magazine.title}
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-background/80">
                  Read the magazine &middot; {magazine.details}
                  <ArrowUpRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                </span>
              </span>
            </a>
          </Reveal>
        </div>

        {/* Phones: a swipeable, auto-advancing rail of equal plates. sm+: the asymmetric mosaic. */}
        <div
          ref={rail}
          className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {media.map((item, i) => {
            const isLead = i === 0;
            return (
              <Reveal
                key={item.id}
                delay={(i % 3) * 80}
                wipe={isLead}
                className={cn(
                  "w-[82%] shrink-0 snap-start sm:w-auto",
                  isLead && "sm:col-span-3 lg:col-span-5",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group relative flex h-full w-full flex-col overflow-hidden bg-card text-left"
                >
                  <div className="overflow-hidden bg-secondary">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className={cn(
                        "aspect-4/3 w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]",
                        isLead && "sm:aspect-video",
                      )}
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-end gap-2 px-5 py-5">
                    <span className="meta-label text-muted-foreground">
                      Plate {String(i + 1).padStart(2, "0")} &nbsp;/&nbsp; {item.category}
                    </span>
                    <h3
                      className={cn(
                        "font-display font-semibold leading-snug text-foreground",
                        isLead ? "text-2xl sm:text-3xl" : "text-lg",
                      )}
                    >
                      {item.title}
                    </h3>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-background/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-background/70">
            Full albums from past events, from site visits and workshops to Grow A Classroom
            schools.
          </p>
          <Link to="/media" className="group btn-primary self-start sm:self-auto">
            See the full media archive
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Lightbox
        open={activeItem !== undefined}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null);
        }}
        onNavigate={navigate}
        title={activeItem?.title ?? "Media"}
        origin={() => (activeItem ? thumbnailFor(activeItem.image) : null)}
      >
        {activeItem ? (
          <>
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="max-h-[60vh] w-full bg-secondary object-cover"
            />
            <div className="flex flex-col gap-3 px-6 py-6 sm:px-8 sm:py-7">
              <span className="meta-label text-muted-foreground">
                Plate {String((openIndex ?? 0) + 1).padStart(2, "0")} &nbsp;/&nbsp;{" "}
                {activeItem.category}
              </span>
              <h3 className="font-display text-xl font-semibold leading-snug text-foreground">
                {activeItem.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{activeItem.caption}</p>
              {activeItem.href ? (
                <a
                  href={activeItem.href}
                  // Albums on this site open in place; documents in a new tab.
                  {...(activeItem.href.startsWith("/")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="group mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  {activeItem.hrefLabel ?? "View"}
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </a>
              ) : null}
            </div>
          </>
        ) : null}
      </Lightbox>
    </section>
  );
}
