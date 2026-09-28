import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { useScrollParallax } from "@/hooks/use-scroll-parallax";

const BIENNALE_URL = "https://www.biennale.aak.or.ke/";

export function Biennale() {
  const parallax = useScrollParallax<HTMLDivElement>(40);

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
      <div
        ref={parallax.ref}
        className="relative isolate mt-10 flex min-h-[80svh] items-end overflow-hidden lg:mt-14 lg:min-h-[88vh]"
      >
        <img
          src="/biennale/featured.webp"
          alt="Exhibitors and AAK members at the Nairobi Biennale of Architecture & Art 2026"
          loading="lazy"
          width={1920}
          height={1280}
          className="photo-grade absolute inset-0 -z-10 h-[115%] w-full object-cover will-change-transform"
          style={{ transform: `translateY(${parallax.offset - 40}px)` }}
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
        <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
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
