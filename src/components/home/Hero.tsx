import { IconArrowRight as ArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import hero640 from "@/assets/hero-biennale-640.webp";
import hero960 from "@/assets/hero-biennale-960.webp";
import hero1280 from "@/assets/hero-biennale-1280.webp";
import hero1600 from "@/assets/hero-biennale-1600.webp";
import { Countdown } from "@/components/site/Countdown";
import { chapters, getEventDisplayStatus, getSortedEvents } from "@/data/site";

/** "Architects, Quantity Surveyors … and Interior Designers" */
const chapterList = (() => {
  const names = chapters.map((c) => c.name);
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
})();

/**
 * Homepage hero: positioning statement, then a full-width photograph of the
 * AAK community, then the current story as a flat paper panel on the photo's
 * lower-left corner (below the photo on phones, so it never covers faces).
 */
export function Hero() {
  const next = getSortedEvents().find((event) => getEventDisplayStatus(event) !== "past");

  return (
    <section aria-labelledby="hero-title" className="bg-background">
      <div className="mx-auto max-w-[1400px] px-6 pt-12 pb-10 lg:px-12 lg:pt-14 lg:pb-12">
        <p className="meta-label text-foreground/70">
          The Architectural Association of Kenya &middot; Est. 1967
        </p>
        {/* Static (no entrance animation): it's the first thing to read. */}
        <h1
          id="hero-title"
          className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          <span className="block text-foreground">Promoting excellence</span>
          <span className="block text-primary">in the built environment.</span>
        </h1>

        <div className="hero-item hero-delay-1 mt-8 flex flex-col gap-7 lg:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The umbrella professional body for Kenya&rsquo;s built and natural environment, uniting
            eight chapters: <span className="text-foreground">{chapterList}</span>.
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-4">
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

      <div className="relative">
        <div className="relative h-[46svh] min-h-[18rem] overflow-hidden bg-ink-deep sm:h-[56svh] lg:h-[max(24rem,calc(100svh-31rem))]">
          <img
            // Phones get the 640/960 file (49–91KB) instead of the 1600 one.
            src={hero1600}
            srcSet={`${hero640} 640w, ${hero960} 960w, ${hero1280} 1280w, ${hero1600} 1600w`}
            sizes="100vw"
            alt="AAK members and exhibitors at the Nairobi Biennale of Architecture, in front of a bamboo pavilion"
            width={1600}
            height={1067}
            fetchPriority="high"
            // Keep the group's faces in frame on wide, shallow crops.
            className="absolute inset-0 h-full w-full object-cover object-[50%_56%] hero-zoom"
          />
        </div>

        {next ? (
          <div className="lg:absolute lg:inset-x-0 lg:bottom-0">
            <div className="mx-auto max-w-[1400px] lg:px-12">
              <Link
                to="/events/$slug"
                params={{ slug: next.slug }}
                className="group relative block border-b border-border bg-background px-6 py-6 pr-16 transition-colors hover:bg-secondary lg:w-[30rem] lg:border-b-0 lg:px-8 lg:py-8 lg:pr-20"
              >
                <IconArrowUpRight
                  className="absolute top-6 right-6 h-6 w-6 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:top-8 lg:right-8"
                  aria-hidden="true"
                />
                <span className="meta-label block text-primary">
                  {getEventDisplayStatus(next) === "ongoing" ? "Happening now" : "Next up"} &middot;{" "}
                  {new Date(next.isoDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    timeZone: "UTC",
                  })}
                </span>
                <span className="mt-2 block font-display text-2xl font-semibold leading-tight text-balance text-foreground sm:text-3xl">
                  {next.title}
                </span>
                <Countdown
                  targetIso={next.isoDate}
                  endIso={next.endIsoDate}
                  className="mt-2 block text-sm font-medium text-muted-foreground"
                />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
