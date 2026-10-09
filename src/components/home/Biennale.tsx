import { useRef } from "react";
import { IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { useAutoRail } from "@/hooks/use-auto-rail";

const BIENNALE_URL = "https://www.biennale.aak.or.ke/";

/** Photos from the Biennale's programme (from biennale.aak.or.ke). Add
 * exhibition-week photos to the front of this list. */
const PHOTOS: { src: string; alt: string; caption: string }[] = [
  {
    src: "/img/biennale/activities/group-photo.webp",
    alt: "Participants gathered in a library for a Nairobi Biennale programme session",
    caption: "Programme participants",
  },
  {
    src: "/img/biennale/activities/presentation.webp",
    alt: "A participant presenting her work on screen at a Biennale session",
    caption: "Presentations",
  },
  {
    src: "/img/biennale/activities/workshop.webp",
    alt: "Two participants sketching together at a Biennale design workshop",
    caption: "Design workshops",
  },
  {
    src: "/img/biennale/activities/talk.webp",
    alt: "A speaker addressing participants at a Biennale conversation",
    caption: "Conversations",
  },
  {
    src: "/img/biennale/activities/interview.webp",
    alt: "A participant interviewed in front of the Nairobi Biennale banner",
    caption: "Voices of the Biennale",
  },
];

export function Biennale() {
  const rail = useRef<HTMLOListElement>(null);
  const auto = useAutoRail(rail, 3500, { seamless: true });

  return (
    <section
      aria-labelledby="biennale-title"
      className="bg-ink-deep pb-28 text-background lg:pb-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 pt-24 lg:px-12 lg:pt-32">
        <SectionRule index="03" label="Biennale" tone="dark" />
      </div>

      {/* Full-bleed exhibition plate: the event's own photograph carries the
          title, dates and theme, so the section reads as a separate event. */}
      <div className="relative isolate mt-10 flex min-h-[80svh] items-end overflow-hidden lg:mt-14 lg:min-h-[88vh]">
        <img
          src="/img/biennale/featured.webp"
          alt="Exhibitors and AAK members at the Nairobi Biennale of Architecture & Art 2026"
          loading="lazy"
          width={1920}
          height={1280}
          // Scroll-scrubbed drift (MotionLayer); starts where it ends up at rest.
          data-parallax="40"
          className="photo-grade absolute inset-0 -z-10 h-[115%] w-full -translate-y-10 object-cover will-change-transform"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-ink-deep via-ink-deep/80 to-ink-deep/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-ink-deep/60 to-transparent"
        />

        <div className="mx-auto w-full max-w-[1400px] px-6 pb-12 lg:px-12 lg:pb-16">
          <Reveal>
            <p className="meta-label text-background/85">
              7&ndash;12 September 2026 &middot; Nairobi
            </p>
            <h2
              id="biennale-title"
              className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl"
            >
              Nairobi Biennale of{" "}
              <span className="font-accent italic font-medium">Architecture</span> &amp; Art
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 border-t border-background/20 pt-6 sm:grid-cols-3">
            <div>
              <p className="meta-label text-background/60">Theme</p>
              <p className="mt-2 font-display text-lg leading-snug">
                Shifting the Center: From Fragility to Resilience
              </p>
            </div>
            <div>
              <p className="meta-label text-background/60">Venue</p>
              <p className="mt-2 font-display text-lg leading-snug">
                ASK Nairobi Showground, Jamhuri Park
              </p>
            </div>
            <div>
              <p className="meta-label text-background/60">Edition</p>
              <p className="mt-2 font-display text-lg leading-snug">
                Nairobi&rsquo;s first Architecture Biennale
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-14 lg:px-12">
        <div className="flex items-end justify-between gap-6 pb-4">
          <p className="meta-label text-background/70">Biennale activities</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={auto.prev}
              aria-label="Previous photos"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-background/25 text-background transition-colors hover:bg-background/10 sm:flex"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={auto.next}
              aria-label="More photos"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-background/25 text-background transition-colors hover:bg-background/10 sm:flex"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ol
          ref={rail}
          aria-label="Photos from the Nairobi Biennale"
          // Scrolls sideways, so it must be reachable by keyboard.
          tabIndex={0}
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:mx-0 lg:px-0"
        >
          {/* Two copies for the seamless loop; the second is hidden from
              assistive tech and keyboard focus. */}
          {[0, 1].map((copy) =>
            PHOTOS.map((photo) => (
              <li
                key={`${copy}-${photo.src}`}
                className="w-[80%] shrink-0 snap-start sm:w-96"
                {...(copy ? { "aria-hidden": true, inert: true } : {})}
              >
                <figure>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={800}
                    className="aspect-3/2 w-full object-cover"
                  />
                  <figcaption className="meta-label mt-3 text-background/70">
                    {photo.caption}
                  </figcaption>
                </figure>
              </li>
            )),
          )}
        </ol>

        <Reveal className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <p className="max-w-xl text-base leading-relaxed text-background/70">
            Exhibitions, conversations and public programming exploring Africa&rsquo;s built
            environment.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 lg:justify-end">
            <a
              href={BIENNALE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group btn-primary"
            >
              Explore the Biennale
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/events/$slug"
              params={{ slug: "nairobi-biennale-2026" }}
              className="link-quiet text-background/85"
            >
              Event details on AAK
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
