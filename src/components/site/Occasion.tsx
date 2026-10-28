import type { CSSProperties, ReactNode } from "react";
import {
  IconChristmasTree,
  IconConfetti,
  IconHammer,
  IconLeaf,
  IconMoonStars,
  IconSunrise,
} from "@tabler/icons-react";
import { OCCASIONS, occasionsWith, type OccasionGarland, type OccasionId } from "@/data/occasions";

/*
 * Occasion themes (see data/occasions.ts). Everything here is rendered on
 * every build and hidden by default ([data-occasion-for] in styles.css);
 * OCCASION_SCRIPT shows the pieces for the occasion that's on: on every page
 * a strip under the main bar, a garland across the top of the page and a
 * greeting atop the footer; on the homepage a greeting and a decoration on
 * the photos. All of it is decoration except the greetings, which are text.
 */

/** The Kenyan flag's stripes, small, for the national days' greeting. */
function FlagMark() {
  return (
    <span
      aria-hidden="true"
      className="occasion-flag-stripes inline-block h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-foreground/15"
    />
  );
}

const ICONS: Record<OccasionId, ReactNode> = {
  "new-year": <IconConfetti className="h-4 w-4 text-primary" aria-hidden="true" />,
  ramadan: <IconMoonStars className="h-4 w-4 text-[#0f6b4b]" aria-hidden="true" />,
  "eid-al-fitr": <IconMoonStars className="h-4 w-4 text-[#0f6b4b]" aria-hidden="true" />,
  easter: <IconSunrise className="h-4 w-4 text-[#c27c0e]" aria-hidden="true" />,
  "labour-day": <IconHammer className="h-4 w-4 text-[#c27c0e]" aria-hidden="true" />,
  "eid-al-adha": <IconMoonStars className="h-4 w-4 text-[#0f6b4b]" aria-hidden="true" />,
  "madaraka-day": <FlagMark />,
  "mazingira-day": <IconLeaf className="h-4 w-4 text-[#2f7d32]" aria-hidden="true" />,
  "mashujaa-day": <FlagMark />,
  "jamhuri-day": <FlagMark />,
  christmas: <IconChristmasTree className="h-4 w-4 text-[#2f7d32]" aria-hidden="true" />,
};

/** On the national days, the flag's stripes along the bottom of the main bar
 * (it stays in view as the header sticks). */
export function OccasionStrip() {
  return (
    <div
      aria-hidden="true"
      data-occasion-for={occasionsWith("flag")}
      className="occasion-strip occasion-strip-flag pointer-events-none absolute inset-x-0 top-full z-30 h-3"
    />
  );
}

// Fixed "random" placements, so every build draws the same.
const scatter = (i: number, a: number, b: number) => ((i * a + b) % 100) / 100;

/** The occasions hanging a given garland, for data-occasion-for. */
const withGarland = (garland: OccasionGarland) =>
  OCCASIONS.filter((o) => o.garland === garland)
    .map((o) => o.id)
    .join(" ");
const GARLANDS = [...new Set(OCCASIONS.map((o) => o.garland))];

/**
 * The occasion's decoration hanging along a scalloped string across the full
 * width (flag bunting, lights, lanterns, crescents, flowers, tools, leaves or
 * confetti). Drawn as repeating images in styles.css (.occasion-garland-*),
 * so a page carries one empty element, not hundreds of pieces.
 */
function Garland({ garland }: { garland: OccasionGarland }) {
  return (
    <div className={`occasion-garland occasion-garland-${garland} absolute inset-x-0 top-0 h-12`} />
  );
}

/**
 * On every page, under the header: a banner with the occasion's greeting and
 * a line about it, on its own artwork (.occasion-banner-<id>), with its
 * garland hanging below. It's in the page, not the sticky header, so it
 * scrolls away with the content.
 */
export function OccasionBanner() {
  return (
    <>
      {OCCASIONS.map((o) => (
        <section
          key={o.id}
          data-occasion-for={o.id}
          aria-label={o.greeting}
          className={`occasion-banner occasion-banner-${o.id} relative z-40 text-white`}
        >
          <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center gap-1 px-6 py-6 text-center [text-shadow:0_1px_8px_rgb(0_0_0/0.6)] sm:flex-row sm:gap-5 sm:py-7 lg:px-12">
            <p className="flex items-center gap-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="flex shrink-0 [&>span]:h-5 [&>span]:w-7 [&>svg]:h-8 [&>svg]:w-8 [&>svg]:text-[#f2c94c]">
                {ICONS[o.id]}
              </span>
              {o.greeting}
            </p>
            <p className="text-sm text-white/85 sm:text-base">{o.message} &middot; AAK</p>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full">
            <Garland garland={o.garland} />
          </div>
        </section>
      ))}
    </>
  );
}

/** On every page, atop the footer: the occasion's greeting from AAK, large. */
export function OccasionFooterBanner() {
  return (
    <div
      data-occasion-for={OCCASIONS.map((o) => o.id).join(" ")}
      className="relative overflow-hidden border-b border-background/10"
    >
      {GARLANDS.map((garland) => (
        <div
          key={garland}
          aria-hidden="true"
          data-occasion-for={withGarland(garland)}
          className="pointer-events-none absolute inset-0"
        >
          <Garland garland={garland} />
        </div>
      ))}
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-6 pt-20 pb-10 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        {OCCASIONS.map((o) => (
          <div key={o.id} data-occasion-for={o.id} className="flex-col gap-1">
            <p className="flex items-center gap-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {/* Larger, and gold to read on the dark footer (the flag keeps its colours). */}
              <span className="flex shrink-0 [&>span]:h-5 [&>span]:w-7 [&>svg]:h-8 [&>svg]:w-8 [&>svg]:text-[#f2c94c]">
                {ICONS[o.id]}
              </span>
              {o.greeting}
            </p>
            <p className="text-sm text-background/70">{o.message}</p>
          </div>
        ))}
        <p className="text-sm text-background/65">from the Architectural Association of Kenya</p>
      </div>
    </div>
  );
}

/** Christmas: a string of lights along the top of the photos. */
function Lights() {
  const bulbs = 30;
  return (
    <div className="absolute inset-x-0 top-0 h-16">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 16"
        preserveAspectRatio="none"
      >
        <path
          d="M0 2 Q12.5 14 25 2 T50 2 T75 2 T100 2"
          fill="none"
          stroke="rgb(20 20 20 / 0.7)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {Array.from({ length: bulbs }, (_, i) => {
        const x = (i + 0.5) / bulbs;
        // On the wire: a sag every quarter of the width.
        const t = (x * 4) % 1;
        const sag = 4 * t * (1 - t);
        return (
          <span
            key={i}
            className={`occasion-bulb occasion-bulb-${i % 4}`}
            style={
              {
                left: `${x * 100}%`,
                top: `${(2 + sag * 12) * 4}px`,
                animationDelay: `${(i % 7) * 0.35}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

/** Ramadan and Eid: a crescent and stars in the corner. */
function Crescent() {
  return (
    <div className="absolute right-4 bottom-14 lg:top-8 lg:right-12 lg:bottom-auto">
      <svg viewBox="0 0 120 120" className="occasion-crescent h-24 w-24 lg:h-32 lg:w-32">
        <defs>
          <mask id="occasion-crescent-cut">
            <rect width="120" height="120" fill="white" />
            <circle cx="74" cy="48" r="34" fill="black" />
          </mask>
        </defs>
        <circle cx="56" cy="60" r="40" fill="#f2c94c" mask="url(#occasion-crescent-cut)" />
        {[
          [96, 22, 5],
          [106, 50, 3.5],
          [86, 86, 4],
        ].map(([cx, cy, r], i) => (
          <path
            key={i}
            className="occasion-star"
            style={{ animationDelay: `${i * 0.6}s` }}
            d={`M${cx} ${cy! - r!}L${cx! + r! * 0.3} ${cy! - r! * 0.3}L${cx! + r!} ${cy}L${cx! + r! * 0.3} ${cy! + r! * 0.3}L${cx} ${cy! + r!}L${cx! - r! * 0.3} ${cy! + r! * 0.3}L${cx! - r!} ${cy}L${cx! - r! * 0.3} ${cy! - r! * 0.3}Z`}
            fill="#f2c94c"
          />
        ))}
      </svg>
    </div>
  );
}

/** New Year: confetti drifting down over the photos. */
function Confetti() {
  return (
    <>
      {Array.from({ length: 60 }, (_, i) => (
        <span
          key={i}
          className={`occasion-confetti occasion-confetti-${i % 5}`}
          style={{
            left: `${scatter(i, 37, 11) * 100}%`,
            top: "-2rem",
            animationDelay: `${-scatter(i, 29, 3) * 9}s`,
            animationDuration: `${7 + scatter(i, 17, 5) * 5}s`,
          }}
        />
      ))}
    </>
  );
}

/** Mazingira Day: leaves drifting down. */
function Leaves() {
  return (
    <>
      {Array.from({ length: 18 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`occasion-leaf occasion-leaf-${i % 3}`}
          style={{
            left: `${scatter(i, 41, 13) * 100}%`,
            top: "-2rem",
            animationDelay: `${-scatter(i, 31, 9) * 12}s`,
          }}
        >
          <path d="M5 21C5 12 10 5 21 3c-1 10-7 16-16 18Z" />
          <path d="M5 21 15 10" fill="none" stroke="rgb(0 0 0 / 0.25)" strokeWidth="1" />
        </svg>
      ))}
    </>
  );
}

/** The national days: a sash in the Kenyan flag's colours across a corner. */
function FlagSash() {
  return (
    <div className="absolute -right-20 bottom-12 h-10 w-80 -rotate-45 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.6)] lg:top-10 lg:bottom-auto lg:rotate-45">
      <div className="occasion-flag-stripes h-full w-full" />
    </div>
  );
}

/** Over the homepage photos, under the event card: the occasion's decoration. */
export function OccasionDecor() {
  const layer = "pointer-events-none absolute inset-0 overflow-hidden";
  return (
    <>
      <div aria-hidden="true" data-occasion-for={occasionsWith("flag")} className={layer}>
        <FlagSash />
      </div>
      <div aria-hidden="true" data-occasion-for={occasionsWith("lights")} className={layer}>
        <Lights />
      </div>
      <div aria-hidden="true" data-occasion-for={occasionsWith("crescent")} className={layer}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgb(10_40_30/0.55),transparent_55%)]" />
        <Crescent />
      </div>
      <div aria-hidden="true" data-occasion-for={occasionsWith("confetti")} className={layer}>
        <Confetti />
      </div>
      <div aria-hidden="true" data-occasion-for={occasionsWith("leaves")} className={layer}>
        <Leaves />
      </div>
      <div aria-hidden="true" data-occasion-for={occasionsWith("dawn")} className={layer}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgb(255_190_80/0.7),rgb(255_214_120/0.25)_35%,transparent_70%)]" />
      </div>
    </>
  );
}
