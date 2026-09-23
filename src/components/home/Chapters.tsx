import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { chapters } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { useScrollParallax } from "@/hooks/use-scroll-parallax";
import { cn } from "@/lib/utils";

const COUNT = chapters.length;

/** Desktop, motion-safe: a sticky image panel crossfades as the reader
 * scrolls past each chapter's text block. Mobile and reduced-motion users
 * get the plain stacked list further down instead — see the render guard
 * classes below. */
function PinnedChapters() {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // Tracks the whole scroll track's progress so the pinned image can drift
  // subtly in place, even while its own container stays stuck via `sticky`.
  const track = useScrollParallax<HTMLUListElement>(18);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = itemRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) setActive(index);
          }
        }
      },
      // Fires when a chapter block crosses the vertical center of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const el of itemRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const activeChapter = chapters[active];
  if (!activeChapter) return null;

  return (
    <div className="hidden lg:motion-safe:grid lg:grid-cols-2 lg:gap-16">
      <div className="sticky top-28 h-[70vh] self-start overflow-hidden rounded-2xl bg-secondary">
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${track.offset}px) scale(1.1)` }}
        >
          {chapters.map((chapter, i) => (
            <img
              key={chapter.slug}
              src={chapter.image}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
                i === active ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-linear-to-t from-ink-deep/80 to-transparent p-8">
          <span className="font-display text-2xl font-semibold text-background">
            {activeChapter.name}
          </span>
          <span className="meta-label text-background/80">
            {String(active + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
          </span>
        </div>
      </div>

      <ul ref={track.ref}>
        {chapters.map((chapter, i) => (
          <li
            key={chapter.slug}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="flex min-h-[70vh] flex-col justify-center border-t border-border py-10 first:border-t-0"
          >
            <span className="meta-label text-primary">
              {String(i + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
            </span>
            <h3
              className={cn(
                "mt-4 font-display text-3xl font-semibold tracking-tight text-balance transition-colors duration-500 sm:text-4xl",
                i === active ? "text-foreground" : "text-foreground/35",
              )}
            >
              {chapter.name}
            </h3>
            <p
              className={cn(
                "mt-4 max-w-md text-base leading-relaxed transition-colors duration-500",
                i === active ? "text-muted-foreground" : "text-muted-foreground/40",
              )}
            >
              {chapter.tagline}
            </p>
            <Link
              to="/chapters/$slug"
              params={{ slug: chapter.slug }}
              className={cn(
                "group mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold transition-colors duration-500",
                i === active ? "text-foreground" : "text-foreground/35",
              )}
            >
              Explore the chapter
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Mobile and reduced-motion fallback — full content, no pinning/crossfade. */
function StackedChapters() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 lg:motion-safe:hidden">
      {chapters.map((chapter, i) => (
        <li key={chapter.slug} className="bg-card">
          <Reveal delay={(i % 4) * 70}>
            <Link to="/chapters/$slug" params={{ slug: chapter.slug }} className="group block">
              <div className="overflow-hidden bg-secondary">
                <img
                  src={chapter.image}
                  alt={`${chapter.name} chapter of the Architectural Association of Kenya`}
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover grayscale transition-[transform,filter] duration-[1200ms] ease-out group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <div className="relative z-20 flex items-center justify-between gap-3 px-6 py-5">
                <h3 className="font-display text-base font-semibold leading-tight text-foreground">
                  {chapter.name}
                </h3>
                <span className="text-[11px] uppercase tracking-[0.14em] text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore
                </span>
              </div>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function Chapters() {
  return (
    <section
      id="chapters"
      aria-labelledby="chapters-title"
      className="relative isolate bg-background py-24 lg:py-32"
    >
      {/* Continues the preceding dark section's tone into this light section's top edge. */}
      <div
        className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-ink-deep to-transparent lg:h-32"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <p className="meta-label text-primary">The association</p>
          <h2
            id="chapters-title"
            className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl"
          >
            Eight professional chapters, one association.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Experts across the built and natural environment disciplines, united behind technical
            excellence and sustainable development in Kenya.
          </p>
        </Reveal>

        <div className="mt-16">
          <PinnedChapters />
          <StackedChapters />
        </div>
      </div>
    </section>
  );
}
