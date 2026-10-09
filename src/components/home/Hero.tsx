import { useEffect, useState } from "react";
import {
  IconArrowRight as ArrowRight,
  IconArrowUpRight,
  IconPlayerPauseFilled as Pause,
  IconPlayerPlayFilled as Play,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Countdown } from "@/components/site/Countdown";
import { chapters, getEventDisplayStatus, getSortedEvents, heroEventSlug } from "@/data/site";
import { cn } from "@/lib/utils";

/** The hero's rotating photographs: AAK's people at work, built from the
 * largest originals available as public/img/hero/<name>-<width>.webp. */
const SLIDES: {
  name: string;
  /** Widths built for this photo, smallest first. */
  widths: number[];
  /** Aspect ratio (height / width) of the files. */
  ratio: number;
  alt: string;
  caption: string;
}[] = [
  {
    name: "convention-2026",
    widths: [960, 1600, 2400],
    ratio: 3852 / 6584,
    alt: "Delegates in a group photo in the main hall at the AAK Annual Convention 2026 in Diani",
    caption: "AAK Annual Convention 2026 · Diani",
  },
  {
    name: "biennale-week",
    widths: [960, 1600, 2000],
    ratio: 2 / 3,
    alt: "A full audience for a talk in the exhibition hall during Nairobi Biennale 2026",
    caption: "Nairobi Biennale 2026 · Exhibition week",
  },
  {
    name: "gac-iiani",
    widths: [960, 1600],
    ratio: 1066 / 1600,
    alt: "AAK team and school leaders present a masterplan model at Iiani School, Nzambani",
    caption: "Grow A Classroom · Iiani, Makueni",
  },
  {
    name: "healthy-homes-launch",
    widths: [960, 1600, 2400],
    ratio: 1688 / 3008,
    alt: "Guests holding copies of AAK's Healthy Homes Guidelines at the launch",
    caption: "Launch of the Healthy Homes Guidelines",
  },
  {
    name: "members-waldorf",
    widths: [960, 1600],
    ratio: 1064 / 1600,
    alt: "AAK members and guests beneath the timber-pole pavilion at the Nairobi Waldorf School",
    caption: "AAK members at the Nairobi Waldorf School, July 2026",
  },
  {
    name: "gac-mabokoni",
    widths: [960, 1600, 2400],
    ratio: 2 / 3,
    alt: "Pupils, teachers and AAK members at Mabokoni Primary School, Kwale",
    caption: "Grow A Classroom · Mabokoni, Kwale",
  },
];
const SLIDE_MS = 6000;
const file = (name: string, w: number) => `/img/hero/${name}-${w}.webp`;

/**
 * Crossfading hero photographs. The first loads at once (it's the LCP); each
 * of the others loads while the one before it is showing, so it's decoded
 * before it fades in and visitors only download the photos they reach.
 * Auto-advances every 6s unless paused, and never for prefers-reduced-motion.
 * The dots pick a photo; the button pauses.
 */
function HeroPhotos() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Highest slide index allowed to load: the current one and the next.
  const [loadUpTo, setLoadUpTo] = useState(0);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  useEffect(() => {
    setLoadUpTo((n) => Math.max(n, Math.min(index + 1, SLIDES.length - 1)));
  }, [index]);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduced, index]);

  const current = SLIDES[index]!;
  return (
    <>
      {SLIDES.map((slide, i) => {
        if (i > loadUpTo && i !== index) return null;
        const largest = slide.widths[slide.widths.length - 1]!;
        return (
          <img
            key={slide.name}
            src={file(slide.name, slide.widths[1] ?? largest)}
            srcSet={slide.widths.map((w) => `${file(slide.name, w)} ${w}w`).join(", ")}
            sizes="100vw"
            alt={i === index ? slide.alt : ""}
            aria-hidden={i === index ? undefined : true}
            width={largest}
            height={Math.round(largest * slide.ratio)}
            fetchPriority={i === 0 ? "high" : undefined}
            decoding={i === 0 ? undefined : "async"}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        );
      })}
      <div className="absolute top-3 right-4 z-10 flex items-center gap-3 rounded-sm bg-ink-deep/70 px-2 py-1 text-[0.6875rem] text-background/90 lg:top-auto lg:right-12 lg:bottom-3">
        <span>{current.caption}</span>
        <span className="flex items-center gap-1" role="group" aria-label="Hero photos">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1} of ${SLIDES.length}: ${slide.caption}`}
              aria-current={i === index ? "true" : undefined}
              className="flex h-6 w-4 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full bg-background transition-all",
                  i === index ? "w-3.5" : "w-1.5 opacity-50",
                )}
              />
            </button>
          ))}
        </span>
        {reduced ? null : (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play hero photos" : "Pause hero photos"}
            className="flex h-6 w-6 items-center justify-center"
          >
            {paused ? (
              <Play className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Pause className="h-3 w-3" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </>
  );
}

/** "Architects, Quantity Surveyors … and Interior Designers" */
const chapterList = (() => {
  const names = chapters.map((c) => c.name);
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
})();

/**
 * Statement hero, after RIBA's: the positioning line in AAK red on a light
 * band, then full-bleed rotating photographs carrying an angled red card for the
 * lead story: the pinned event (heroEventSlug) while it's ahead, else the
 * next event.
 */

/** "3rd December" */
function dayMonth(iso: string) {
  const date = new Date(iso);
  const day = date.getUTCDate();
  const suffix =
    day % 100 >= 11 && day % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][day % 10] ?? "th");
  return `${day}${suffix} ${date.toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" })}`;
}
export function Hero() {
  const upcoming = getSortedEvents().filter((event) => getEventDisplayStatus(event) !== "past");
  const pinned = upcoming.find((event) => event.slug === heroEventSlug);
  const next = pinned ?? upcoming[0];

  return (
    <section aria-labelledby="hero-title" className="bg-background">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 pt-12 pb-10 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-16 lg:px-12 lg:pt-14 lg:pb-12">
        <div>
          <p className="meta-label text-foreground/70">
            The Architectural Association of Kenya &middot; Est. 1967
          </p>
          {/* Visible from first paint (no entrance animation): it's the page's LCP. */}
          <h1
            id="hero-title"
            className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-balance text-primary sm:text-6xl lg:text-7xl"
          >
            Promoting excellence in the built environment.
          </h1>
        </div>

        <div className="hero-item hero-delay-1 lg:pb-2">
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The umbrella professional body for Kenya&rsquo;s built and natural environment, uniting
            eight chapters: <span className="text-foreground">{chapterList}</span>.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link to="/membership" className="group btn-primary">
              Join AAK
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a href="#events" className="link-quiet">
              What&rsquo;s on
            </a>
          </div>
        </div>
      </div>

      <div className="relative isolate h-[58svh] min-h-[22rem] overflow-hidden bg-ink-deep lg:h-[68svh]">
        <HeroPhotos />

        {next ? (
          <Link
            to="/events/$slug"
            params={{ slug: next.slug }}
            // Bleeds off the left edge like a pasted-on label; the photo clips it.
            className="hero-item hero-delay-2 group absolute bottom-2 -left-6 w-[min(34rem,calc(100%-1.5rem))] origin-bottom-left -rotate-3 bg-primary py-7 pr-16 pl-12 text-primary-foreground shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] transition-transform duration-300 hover:-rotate-2 sm:bottom-4 sm:py-9 sm:pl-[4.5rem] lg:top-[max(1.5rem,calc(100svh-39rem))] lg:bottom-auto lg:w-[calc(max(0px,(100vw-1400px)/2)+38rem)] lg:pl-[calc(max(0px,(100vw-1400px)/2)+4.5rem)]"
          >
            <IconArrowUpRight
              className="absolute top-5 right-5 h-9 w-9 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-11 sm:w-11"
              stroke={2.6}
              aria-hidden="true"
            />
            <span className="meta-label block text-primary-foreground/85">
              {getEventDisplayStatus(next) === "ongoing"
                ? "Happening now"
                : pinned
                  ? pinned.kicker
                  : "Next up"}{" "}
              &middot; {dayMonth(next.isoDate)}
            </span>
            <span className="mt-2 block font-display text-2xl font-semibold leading-tight text-balance sm:text-3xl">
              {next.title}
            </span>
            <Countdown
              targetIso={next.isoDate}
              endIso={next.endIsoDate}
              className="mt-2 block text-sm font-semibold text-primary-foreground/85"
            />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
