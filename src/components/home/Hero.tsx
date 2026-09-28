import { IconArrowRight as ArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import hero640 from "@/assets/hero-architecture-640.webp";
import hero960 from "@/assets/hero-architecture-960.webp";
import hero1280 from "@/assets/hero-architecture-1280.webp";
import hero1920 from "@/assets/hero-architecture-1920.webp";
import { Countdown } from "@/components/site/Countdown";
import { chapters, getEventDisplayStatus, getSortedEvents } from "@/data/site";

/** "Architects, Quantity Surveyors … and Interior Designers" */
const chapterList = (() => {
  const names = chapters.map((c) => c.name);
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
})();

/**
 * Statement hero, after RIBA's: the positioning line in AAK red on a light
 * band, then a full-bleed photograph carrying an angled red card for the
 * lead story (the next event).
 */
export function Hero() {
  const next = getSortedEvents().find((event) => getEventDisplayStatus(event) !== "past");

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

        {next ? (
          <Link
            to="/events/$slug"
            params={{ slug: next.slug }}
            // Bleeds off the left edge like a pasted-on label; the photo clips it.
            className="hero-item hero-delay-2 group absolute bottom-5 -left-6 w-[min(34rem,calc(100%-1.5rem))] origin-bottom-left -rotate-3 bg-primary py-7 pr-16 pl-12 text-primary-foreground shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] transition-transform duration-300 hover:-rotate-2 sm:bottom-8 sm:py-9 sm:pl-[4.5rem] lg:top-[max(1.5rem,calc(100svh-42rem))] lg:bottom-auto lg:w-[calc(max(0px,(100vw-1400px)/2)+38rem)] lg:pl-[calc(max(0px,(100vw-1400px)/2)+4.5rem)]"
          >
            <IconArrowUpRight
              className="absolute top-5 right-5 h-9 w-9 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-11 sm:w-11"
              stroke={2.6}
              aria-hidden="true"
            />
            <span className="meta-label block text-primary-foreground/85">
              {getEventDisplayStatus(next) === "ongoing" ? "Happening now" : "Next up"} &middot;{" "}
              {new Date(next.isoDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                timeZone: "UTC",
              })}
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
