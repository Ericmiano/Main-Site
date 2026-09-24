import { useState } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { media } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { Lightbox } from "@/components/site/Lightbox";
import { cn } from "@/lib/utils";

const spanClass: Record<string, string> = {
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  regular: "",
};

export function MediaGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activeItem = openIndex !== null ? media[openIndex] : undefined;

  const navigate = (direction: -1 | 1) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + media.length) % media.length;
    });
  };

  return (
    <section id="media" aria-labelledby="media-title" className="bg-secondary py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <SectionRule index="06" label="The archive" />
          <h2
            id="media-title"
            className="mt-8 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-balance text-foreground sm:text-5xl"
          >
            Work, events and award-winning projects.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            A rolling record of what members are building, the sites we visit and the projects
            recognised at the Awards of Excellence.
          </p>
        </Reveal>

        {/* Phones: a swipeable rail of equal plates. sm+: the asymmetric mosaic. */}
        <div className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
          {media.map((item, i) => {
            const isLead = i === 0;
            const isTall = !isLead && item.span === "tall";
            return (
              <Reveal
                key={item.id}
                delay={(i % 3) * 80}
                className={cn(
                  "w-[82%] shrink-0 snap-start sm:w-auto",
                  isLead ? "sm:col-span-3" : (spanClass[item.span] ?? ""),
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group relative flex h-full w-full flex-col overflow-hidden bg-card text-left"
                >
                  <div className={cn("overflow-hidden bg-secondary", isTall && "sm:h-full")}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className={cn(
                        "aspect-4/3 w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105",
                        isLead && "sm:aspect-21/9",
                        isTall && "sm:aspect-auto sm:h-full",
                      )}
                    />
                  </div>

                  {isTall ? (
                    <div className="absolute inset-x-0 bottom-0 z-10 hidden bg-linear-to-t from-ink-deep/85 to-transparent px-6 py-6 sm:block">
                      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-background/70">
                        Plate {String(i + 1).padStart(2, "0")} &nbsp;/&nbsp; {item.category}
                      </span>
                      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-background">
                        {item.title}
                      </h3>
                    </div>
                  ) : null}
                  <div
                    className={cn(
                      "flex flex-1 flex-col justify-end gap-2 px-6 py-6",
                      isTall && "sm:hidden",
                    )}
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
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
      </div>

      <Lightbox
        open={activeItem !== undefined}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null);
        }}
        onNavigate={navigate}
        title={activeItem?.title ?? "Media"}
      >
        {activeItem ? (
          <>
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="max-h-[60vh] w-full bg-secondary object-cover"
            />
            <div className="flex flex-col gap-3 px-6 py-6 sm:px-8 sm:py-7">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
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
                  target="_blank"
                  rel="noopener noreferrer"
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
