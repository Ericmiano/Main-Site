import { useEffect, useRef, useState } from "react";
import {
  IconArrowUpRight as ArrowUpRight,
  IconCalendar as CalendarDays,
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconMapPin as MapPin,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { getEventDisplayStatus, getSortedEvents } from "@/data/site";
import { Countdown } from "@/components/site/Countdown";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export function EventsStrip() {
  const events = getSortedEvents().filter((event) => getEventDisplayStatus(event) !== "past");
  // Duplicated so the auto-scroll loop can reset at the halfway point
  // invisibly (the second half is identical to the first).
  const track = [...events, ...events];
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number;
    // Track position ourselves rather than reading scroller.scrollLeft back
    // each frame — some browsers round scrollLeft to whole pixels, which
    // would truncate a sub-pixel increment back to zero every frame and
    // stall the animation entirely.
    let position = scroller.scrollLeft;
    const step = () => {
      if (paused) {
        // Stay in sync with wherever the user left it (drag, wheel, nav
        // buttons) so resuming continues smoothly instead of jumping back.
        position = scroller.scrollLeft;
      } else {
        position += 1;
        const halfway = scroller.scrollWidth / 2;
        if (position >= halfway) {
          position -= halfway;
        }
        scroller.scrollLeft = position;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [paused]);

  const scrollByCard = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector("li");
    const amount = (card?.clientWidth ?? 320) + 20;
    scroller.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section id="events" aria-labelledby="events-title" className="bg-ink-deep py-14 lg:py-18">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="grid gap-8 border-b border-background/12 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
              <span>Ongoing &amp; upcoming</span>
            </div>
            <h2
              id="events-title"
              className="mt-3 font-display text-3xl font-semibold leading-[0.98] tracking-tight text-balance text-background sm:text-4xl"
            >
              What&rsquo;s happening at AAK
            </h2>
            <Link
              to="/events"
              className="link-underline mt-5 inline-block text-sm font-medium text-background/70"
            >
              See the full calendar
            </Link>
          </div>
          <blockquote className="max-w-sm border-l-2 border-primary/60 pl-5 lg:pl-6">
            <p className="font-accent text-base font-medium italic leading-snug text-background/85 sm:text-lg">
              &ldquo;Shifting the Center: reclaiming Africa&rsquo;s architecture and future.&rdquo;
            </p>
            <footer className="mt-3 text-xs uppercase tracking-[0.1em] text-background/45">
              Nairobi Biennale of Architecture &amp; Art, 2026 theme
            </footer>
          </blockquote>
        </Reveal>
      </div>

      <div
        className="group relative mt-9"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <ul
          ref={scrollerRef}
          className="rail flex gap-5 overflow-x-auto px-6 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] lg:px-12"
        >
          {track.map((event, i) => {
            const duplicate = i >= events.length;
            const status = getEventDisplayStatus(event);
            const cardClassName = "group flex h-full flex-col justify-between p-6";
            const cardBody = (
              <>
                <div className="relative z-20">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                        status === "ongoing"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background/15 text-background",
                      )}
                    >
                      {status === "ongoing" ? (
                        <span className="pulse-dot h-1.5 w-1.5 bg-primary-foreground" />
                      ) : null}
                      {status === "ongoing" ? "Ongoing" : status === "past" ? "Past" : "Upcoming"}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-background/70">
                      {event.kicker}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-background">
                    {event.title}
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-background/70">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                      <time dateTime={event.isoDate}>{event.date}</time>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                      {event.location}
                    </p>
                  </div>
                  <Countdown
                    targetIso={event.isoDate}
                    endIso={event.endIsoDate}
                    className="mt-3 inline-block text-xs font-semibold text-[oklch(0.75_0.13_38.5)]"
                  />
                </div>
                <span className="relative z-20 mt-6 inline-flex items-center gap-2 text-sm font-semibold text-background">
                  {event.cta}
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </span>
              </>
            );
            return (
              <li
                key={`${event.slug}-${i}`}
                className="w-[min(78vw,22rem)] shrink-0"
                aria-hidden={duplicate ? "true" : undefined}
              >
                <div className="h-full rounded-2xl border border-background/12 bg-background/5 transition-colors duration-300 hover:border-primary/60 hover:bg-background/10">
                  {event.externalSiteHref ? (
                    <a
                      href={event.externalSiteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={duplicate ? -1 : undefined}
                      className={cardClassName}
                    >
                      {cardBody}
                    </a>
                  ) : (
                    <Link
                      to="/events/$slug"
                      params={{ slug: event.slug }}
                      tabIndex={duplicate ? -1 : undefined}
                      className={cardClassName}
                    >
                      {cardBody}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-background/20 bg-background/10 text-background opacity-0 transition-opacity duration-300 hover:bg-background/20 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 sm:inline-flex"
          aria-label="Scroll events left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-background/20 bg-background/10 text-background opacity-0 transition-opacity duration-300 hover:bg-background/20 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 sm:inline-flex"
          aria-label="Scroll events right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
