import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import hero640 from "@/assets/hero-architecture-640.webp";
import hero960 from "@/assets/hero-architecture-960.webp";
import hero1280 from "@/assets/hero-architecture-1280.webp";
import hero1920 from "@/assets/hero-architecture-1920.webp";
import { Countdown } from "@/components/site/Countdown";
import { getEventDisplayStatus, getSortedEvents } from "@/data/site";

export function Hero() {
  const next = getSortedEvents().find((event) => getEventDisplayStatus(event) !== "past");

  return (
    // Shorter than the viewport so the next section visibly begins below it.
    <section className="relative isolate flex min-h-[calc(100svh-12rem)] items-end overflow-hidden bg-ink-deep">
      <img
        // Phones get the 640/960 file (20–36KB) instead of the full 1920 one.
        src={hero1920}
        srcSet={`${hero640} 640w, ${hero960} 960w, ${hero1280} 1280w, ${hero1920} 1920w`}
        sizes="100vw"
        alt="Golden-hour view of a modern Nairobi building facade with a deep concrete grid"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover hero-zoom"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-ink-deep/90 via-ink-deep/35 to-ink-deep/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] gap-10 px-6 pt-24 pb-12 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16 lg:px-12 lg:pb-16">
        <div>
          <p className="hero-item meta-label text-background/75">
            The Architectural Association of Kenya &middot; Est. 1967
          </p>
          <h1 className="hero-item hero-delay-1 mt-5 max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-balance text-background sm:text-6xl lg:text-[5.25rem]">
            Promoting excellence in the{" "}
            <span className="font-accent italic font-medium text-primary">built environment</span>.
          </h1>
          <p className="hero-item hero-delay-2 mt-6 max-w-xl text-base leading-relaxed text-background/85 sm:text-lg">
            The professional body for Kenya&rsquo;s built and natural environment: architects,
            quantity surveyors, planners, engineers and more, across eight chapters.
          </p>
          <div className="hero-item hero-delay-3 mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link to="/membership" className="group btn-primary">
              Join AAK
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a href="#events" className="link-quiet text-background">
              What&rsquo;s on
            </a>
          </div>
        </div>

        {next ? (
          <Link
            to="/events/$slug"
            params={{ slug: next.slug }}
            className="hero-item hero-delay-4 group flex max-w-md items-center gap-5 border-l-2 border-primary bg-ink-deep/60 py-4 pr-5 pl-5 backdrop-blur-md transition-colors hover:bg-ink-deep/80 lg:justify-self-end"
          >
            <span className="shrink-0 text-center">
              <span className="block font-display text-3xl font-semibold leading-none text-background">
                {new Date(next.isoDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  timeZone: "UTC",
                })}
              </span>
              <span className="meta-label mt-1 block text-background/60">
                {new Date(next.isoDate).toLocaleDateString("en-GB", {
                  month: "short",
                  timeZone: "UTC",
                })}
              </span>
            </span>
            <span className="min-w-0">
              <span className="meta-label block text-[oklch(0.75_0.13_38.5)]">
                {getEventDisplayStatus(next) === "ongoing" ? "Happening now" : "Next up"}
              </span>
              <span className="mt-1 block truncate font-display text-lg font-semibold text-background">
                {next.title}
              </span>
              <Countdown
                targetIso={next.isoDate}
                endIso={next.endIsoDate}
                className="mt-0.5 block text-xs font-semibold text-background/70"
              />
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
