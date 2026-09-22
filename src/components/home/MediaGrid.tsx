import { useState } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { media } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Lightbox } from "@/components/site/Lightbox";

const spanClass: Record<string, string> = {
  wide: "sm:col-span-2",
  tall: "",
  regular: "",
};

const aspectClass: Record<string, string> = {
  wide: "aspect-16/9",
  tall: "aspect-4/3",
  regular: "aspect-4/3",
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
        <SectionHeading
          eyebrow="Media & projects"
          title={<span id="media-title">Work, events and award-winning projects</span>}
          description="A rolling record of what members are building, the sites we visit and the projects recognised at the Awards of Excellence."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 80} className={spanClass[item.span] ?? ""}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-card text-left"
              >
                <div className="overflow-hidden bg-secondary">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 ${aspectClass[item.span] ?? "aspect-4/3"}`}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-end gap-2 px-6 py-6">
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Plate {String(i + 1).padStart(2, "0")} &nbsp;/&nbsp; {item.category}
                  </span>
                  <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
                    {item.title}
                  </h3>
                </div>
              </button>
            </Reveal>
          ))}
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
