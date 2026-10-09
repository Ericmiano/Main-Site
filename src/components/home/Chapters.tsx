import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { chapters } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { gsapIfLoaded, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/** Desktop: one screen — a numbered index whose hovered/focused entry swaps
 * the large photograph beside it. */
function ChapterIndex() {
  const [active, setActive] = useState(0);
  const current = chapters[active] ?? chapters[0]!;
  const photos = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  // The "03 / 08" counter counts to each new chapter rather than jumping.
  const [shownNumber, setShownNumber] = useState(1);
  const counter = useRef({ n: 1 });
  const firstRun = useRef(true);

  // With GSAP loaded: the new photo wipes in across the old one, the number
  // counts, the caption slides up. Otherwise the CSS crossfade does the job.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const kit = prefersReducedMotion() ? null : gsapIfLoaded();
    if (!kit) {
      counter.current.n = active + 1;
      setShownNumber(active + 1);
      return;
    }
    const { gsap } = kit;
    const img = photos.current?.querySelectorAll("img")[active];
    const tweens: gsap.core.Tween[] = [
      gsap.to(counter.current, {
        n: active + 1,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => setShownNumber(Math.round(counter.current.n)),
      }),
    ];
    if (img) {
      tweens.push(
        gsap.fromTo(
          img,
          { clipPath: "inset(0% 0% 0% 100%)", opacity: 1, zIndex: 1 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "expo.inOut",
            clearProps: "clipPath,opacity,zIndex",
          },
        ),
      );
    }
    if (caption.current) {
      tweens.push(
        gsap.fromTo(
          caption.current.children,
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: "expo.out" },
        ),
      );
    }
    // Sweeping down the list: finish each wipe rather than leave it half-done.
    return () => {
      for (const tween of tweens) tween.progress(1).kill();
    };
  }, [active]);

  return (
    <div className="hidden lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <ol className="border-t border-border">
        {chapters.map((chapter, i) => (
          <li key={chapter.slug} className="border-b border-border">
            <Link
              to="/chapters/$slug"
              params={{ slug: chapter.slug }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex items-baseline gap-6 py-4"
            >
              <span
                className={cn(
                  "meta-label w-6 shrink-0 transition-colors duration-300",
                  i === active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {pad(i + 1)}
              </span>
              <span
                className={cn(
                  "font-display text-2xl font-semibold tracking-tight transition-[color,transform] duration-300 xl:text-3xl",
                  i === active ? "translate-x-2 text-foreground" : "text-foreground/60",
                )}
              >
                {chapter.name}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className={cn(
                  "ml-auto h-5 w-5 shrink-0 self-center text-primary transition-opacity duration-300",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            </Link>
          </li>
        ))}
      </ol>

      <div ref={photos} className="relative self-stretch overflow-hidden rounded-2xl bg-secondary">
        {chapters.map((chapter, i) => (
          <img
            key={chapter.slug}
            src={chapter.image}
            alt=""
            loading="lazy"
            className={cn(
              "photo-grade absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out",
              i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
            )}
          />
        ))}
        <div
          ref={caption}
          className="absolute inset-x-0 bottom-0 z-[2] bg-linear-to-t from-ink-deep/85 to-transparent p-8 pt-24"
        >
          <p className="meta-label text-background/70">
            {pad(shownNumber)} / {pad(chapters.length)}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-background">{current.name}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-background/80">
            {current.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Phones: a compact numbered index rather than eight full-height cards. */
function ChapterList() {
  return (
    <ol className="border-t border-border sm:hidden">
      {chapters.map((chapter, i) => (
        <li key={chapter.slug} className="border-b border-border">
          <Link
            to="/chapters/$slug"
            params={{ slug: chapter.slug }}
            className="flex min-h-20 items-center gap-4 py-3"
          >
            <span className="meta-label w-6 shrink-0 text-muted-foreground">{pad(i + 1)}</span>
            <span className="flex-1 font-display text-lg font-semibold leading-tight text-foreground">
              {chapter.name}
            </span>
            <img
              src={chapter.image}
              alt=""
              loading="lazy"
              className="photo-grade h-14 w-14 shrink-0 object-cover"
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Tablets: a two-column card grid. */
function ChapterGrid() {
  return (
    <ul className="hidden gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid sm:grid-cols-2 lg:hidden">
      {chapters.map((chapter, i) => (
        <li key={chapter.slug} className="bg-card">
          <Reveal delay={(i % 2) * 70}>
            <Link to="/chapters/$slug" params={{ slug: chapter.slug }} className="group block">
              <div className="overflow-hidden bg-secondary">
                <img
                  src={chapter.image}
                  alt={`${chapter.name} chapter of the Architectural Association of Kenya`}
                  loading="lazy"
                  className="photo-grade aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-6 py-5">
                <h3 className="font-display text-base font-semibold leading-tight text-foreground">
                  {chapter.name}
                </h3>
                <span className="meta-label text-muted-foreground">{pad(i + 1)}</span>
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
      className="bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <SectionRule index="05" label="The association" />
          <h2 id="chapters-title" className="type-section mt-8 text-foreground">
            Umbrella association of eight professional chapters.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Experts across the built and natural environment disciplines, united behind technical
            excellence and sustainable development in Kenya.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <ChapterIndex />
          <ChapterList />
          <ChapterGrid />
        </Reveal>
      </div>
    </section>
  );
}
