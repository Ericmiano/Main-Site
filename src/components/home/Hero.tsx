import { useEffect, useState } from "react";
import { announcement } from "@/data/announcement";
import { IconArrowRight as ArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Countdown } from "@/components/site/Countdown";
import {
  chapters,
  eventEndTime,
  getEventDisplayStatus,
  getSortedEvents,
  HERO_EVENT_ORDER,
  type SiteEvent,
} from "@/data/site";
import { renderTime } from "@/lib/render-time";
import { cn } from "@/lib/utils";
import { OccasionDecor } from "@/components/site/Occasion";
import { NewPost } from "@/components/home/NewPost";

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
  /** Where the crop centres (CSS object-position), to keep faces in frame
   * when the wide hero cuts the photo's top and bottom. Default: centre. */
  position?: string;
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
    position: "50% 15%",
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
    position: "50% 80%",
  },
  // From the old aak.or.ke homepage (Wayback, 19 Sept 2026), where they ran
  // without captions: dates from the photos' camera data, events not named.
  {
    name: "archive-audience-2025",
    widths: [960, 1600, 2400],
    ratio: 1707 / 2560,
    alt: "Two members in suits listening from the front row of an audience",
    caption: "In the audience · March 2025",
    position: "50% 30%",
  },
  {
    name: "archive-golf-2025",
    widths: [960, 1600, 2400],
    ratio: 1707 / 2560,
    alt: "A golfer putting on the green as other players and caddies look on",
    caption: "On the green · April 2025",
  },
  {
    name: "archive-team-2025",
    widths: [960, 1600, 2400],
    ratio: 1707 / 2560,
    alt: "A group photo in a meeting room, the AAK logo on the screen behind",
    caption: "AAK team and members · February 2025",
    position: "50% 35%",
  },
  {
    name: "archive-track-2022",
    widths: [960, 1600, 2400],
    ratio: 1920 / 2560,
    alt: "A large crowd cheering with raised arms for a group photo beside a running track",
    caption: "At the track · November 2022",
    position: "50% 55%",
  },
  {
    name: "archive-workshop-2025",
    widths: [960, 1600, 2400],
    ratio: 1707 / 2560,
    alt: "Students seated in a studio listening to a presenter beside a laptop and projector",
    caption: "A workshop session · February 2025",
  },
  {
    name: "archive-heritage",
    widths: [960, 1600, 2400],
    ratio: 1044 / 2560,
    alt: "AAK members and guests in a group photo beside a vintage railway carriage, an AAK banner behind them",
    caption: "AAK members and guests",
    position: "50% 25%",
  },
];
const SLIDE_MS = 6000;
const file = (name: string, w: number) => `/img/hero/${name}-${w}.webp`;

/**
 * Crossfading hero photographs. The first loads at once (it's the LCP); each
 * of the others loads while the one before it is showing, so it's decoded
 * before it fades in and visitors only download the photos they reach.
 * Auto-advances every 6s, never for prefers-reduced-motion. The dots pick a
 * photo.
 */
function HeroPhotos() {
  const [index, setIndex] = useState(0);
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
    if (reduced) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [reduced, index]);

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
            style={slide.position ? { objectPosition: slide.position } : undefined}
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
 * band, then full-bleed rotating photographs carrying an angled red card that
 * cycles through every upcoming event.
 */

/** "3rd December" */
function dayMonth(iso: string) {
  const date = new Date(iso);
  const day = date.getUTCDate();
  const suffix =
    day % 100 >= 11 && day % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][day % 10] ?? "th");
  return `${day}${suffix} ${date.toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" })}`;
}
const CARD_MS = 8_000;

/**
 * The angled red card on the hero photos: every upcoming event in turn, in
 * HERO_EVENT_ORDER, a new one every 8 seconds. Hovering or focusing the card
 * holds it; the dots pick an event. No automatic
 * turning for prefers-reduced-motion. Each card carries its end time
 * (data-ends), so one that ends is hidden by TIMED_HIDE_SCRIPT and skipped,
 * even mid-loop.
 */
function HeroEvents({ events, asOf }: { events: SiteEvent[]; asOf: Date }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const count = events.length;

  /** The next event that hasn't ended, after `from` (or `from` if none). */
  const nextLive = (from: number) => {
    for (let k = 1; k <= count; k++) {
      const j = (from + k) % count;
      if (eventEndTime(events[j]!) > Date.now()) return j;
    }
    return from;
  };

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  // Off the current card the moment its event ends (or at once if it has).
  useEffect(() => {
    const current = events[index];
    if (!current) return;
    const left = eventEndTime(current) - Date.now();
    if (left <= 0) {
      setIndex((i) => nextLive(i));
      return;
    }
    if (left > 2 ** 31 - 1) return;
    const timer = window.setTimeout(() => setIndex((i) => nextLive(i)), left + 50);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, events]);
  useEffect(() => {
    if (held || reduced || count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => nextLive(i)), CARD_MS);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [held, reduced, count, index]);

  if (!count) return null;
  return (
    <div
      role="region"
      aria-label="Upcoming events"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      // Bleeds off the left edge like a pasted-on label; the photo clips it.
      className="hero-item hero-delay-2 absolute bottom-2 -left-6 w-[min(34rem,calc(100%-1.5rem))] origin-bottom-left -rotate-3 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] transition-transform duration-300 hover:-rotate-2 sm:bottom-4 lg:top-[max(1.5rem,calc(100svh-39rem))] lg:bottom-auto lg:w-[calc(max(0px,(100vw-1400px)/2)+38rem)]"
    >
      {/* All cards share one grid cell, so the box keeps the tallest card's
          height and doesn't jump as they change. */}
      <div className="grid bg-primary">
        {events.map((event, i) => {
          const shown = i === index;
          return (
            <Link
              key={event.slug}
              to="/events/$slug"
              params={{ slug: event.slug }}
              data-ends={eventEndTime(event)}
              aria-hidden={shown ? undefined : true}
              tabIndex={shown ? undefined : -1}
              className={cn(
                "group relative block py-7 pr-16 pl-12 text-primary-foreground transition-opacity duration-500 [grid-area:1/1] sm:py-9 sm:pl-[4.5rem] lg:pl-[calc(max(0px,(100vw-1400px)/2)+4.5rem)]",
                count > 1 && "pb-12 sm:pb-14",
                shown ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <IconArrowUpRight
                className="absolute top-5 right-5 h-9 w-9 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-11 sm:w-11"
                stroke={2.6}
                aria-hidden="true"
              />
              <span className="meta-label block text-primary-foreground/85">
                {getEventDisplayStatus(event, asOf) === "ongoing" ? "Happening now" : event.kicker}{" "}
                &middot; {dayMonth(event.isoDate)}
              </span>
              <span className="mt-2 block font-display text-2xl font-semibold leading-tight text-balance sm:text-3xl">
                {event.title}
              </span>
              <Countdown
                targetIso={event.isoDate}
                endIso={event.endIsoDate}
                className="mt-2 block text-sm font-semibold text-primary-foreground/85"
              />
            </Link>
          );
        })}
      </div>
      {count > 1 ? (
        <div className="absolute right-4 bottom-2 flex items-center gap-1 text-primary-foreground sm:bottom-3">
          <span className="flex items-center" role="group" aria-label="Choose an event">
            {events.map((event, i) => (
              <button
                key={event.slug}
                type="button"
                data-ends={eventEndTime(event)}
                onClick={() => setIndex(i)}
                aria-label={`Event ${i + 1} of ${count}: ${event.title}`}
                aria-current={i === index ? "true" : undefined}
                className="flex h-6 w-4 items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full bg-primary-foreground transition-all",
                    i === index ? "w-3.5" : "w-1.5 opacity-50",
                  )}
                />
              </button>
            ))}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export function Hero() {
  // As of when the page was rendered, so the first render matches the
  // prebuilt page; TIMED_HIDE_SCRIPT handles anything ending after that.
  const asOf = new Date(renderTime());
  const upcoming = getSortedEvents(asOf).filter(
    (event) => getEventDisplayStatus(event, asOf) !== "past",
  );
  const heroPlace = (slug: string) => {
    const at = HERO_EVENT_ORDER.indexOf(slug);
    return at === -1 ? HERO_EVENT_ORDER.indexOf("*") : at;
  };
  const heroEvents = [...upcoming].sort((a, b) => heroPlace(a.slug) - heroPlace(b.slug));

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

        {/* min-w-0: a long title in the "New today" chip is cut short, not widening the page. */}
        <div className="hero-item hero-delay-1 min-w-0 lg:pb-2">
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
            {announcement ? (
              <a
                data-announcement="hero"
                href={announcement.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet text-primary"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                New: {announcement.short}
              </a>
            ) : null}
          </div>
          <NewPost variant="inline" />
        </div>
      </div>

      <div className="relative isolate h-[58svh] min-h-[22rem] overflow-hidden bg-ink-deep lg:h-[68svh]">
        <HeroPhotos />
        <OccasionDecor />
        <NewPost variant="overlay" />

        <HeroEvents events={heroEvents} asOf={asOf} />
      </div>
    </section>
  );
}
