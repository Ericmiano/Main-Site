import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-architecture.jpg";
import { Countdown } from "@/components/site/Countdown";
import { getEventDisplayStatus, getSortedEvents } from "@/data/site";

export function Hero() {
  const next = getSortedEvents().find((event) => getEventDisplayStatus(event) !== "past");

  return (
    <section className="relative isolate flex min-h-[100vh] items-start overflow-hidden bg-ink-deep">
      <img
        src={heroImage}
        alt="Golden-hour view of a modern Nairobi building facade with a deep concrete grid"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover hero-zoom"
      />
      {/* Bottom-anchored scrim only — most of the frame stays at full vibrance,
          contrast is concentrated where the scroll cue sits. */}
      <div
        className="absolute inset-0 bg-linear-to-t from-ink-deep/85 via-ink-deep/15 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-ink-deep/55 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pt-20 lg:px-12 lg:pt-24">
        <p className="hero-item meta-label text-background/70">AAK</p>
        <p className="hero-item hero-delay-1 mt-5 max-w-2xl font-display text-2xl font-medium leading-snug text-balance text-background/80 sm:text-3xl">
          The Architectural Association of Kenya
        </p>
        <h1 className="hero-item hero-delay-2 mt-4 max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-balance text-background sm:text-6xl lg:text-[5.25rem]">
          Promoting excellence in the{" "}
          <span className="font-accent italic font-medium text-primary">built environment</span>.
        </h1>
        <p className="hero-item hero-delay-3 meta-label mt-8 text-background/70">
          Est. 1967 &middot; Nairobi, Kenya
        </p>

        <div className="hero-item hero-delay-3 mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/membership"
            className="group inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Join AAK
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#events"
            className="inline-flex items-center gap-3 rounded-xl border border-background/35 px-6 py-3.5 text-sm font-semibold text-background backdrop-blur-sm transition-colors hover:bg-background/10"
          >
            What&rsquo;s on
          </a>
        </div>

        {next ? (
          <Link
            to="/events/$slug"
            params={{ slug: next.slug }}
            className="hero-item hero-delay-4 group mt-12 flex max-w-md items-center gap-5 border-l-2 border-primary bg-ink-deep/55 py-4 pr-5 pl-5 backdrop-blur-md transition-colors hover:bg-ink-deep/75"
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

      <a
        href="#origin"
        className="hero-item hero-delay-4 group absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 text-background/80 transition-colors hover:text-background"
      >
        <span className="meta-label">Scroll to explore</span>
        <span
          aria-hidden="true"
          className="text-base transition-transform group-hover:translate-y-0.5"
        >
          &darr;
        </span>
      </a>
    </section>
  );
}
