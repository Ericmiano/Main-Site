import { IconArrowUpRight as ArrowUpRight, IconMapPin as MapPin } from "@tabler/icons-react";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { getEventDisplayStatus, getSortedEvents } from "@/data/site";
import { Countdown } from "@/components/site/Countdown";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { cn } from "@/lib/utils";
import { useGsap } from "@/hooks/use-gsap";

export function EventsStrip() {
  const events = getSortedEvents().filter((event) => getEventDisplayStatus(event) !== "past");
  const timeline = useRef<HTMLDivElement>(null);

  // The year as a journey: a line draws down the rail as the reader scrolls,
  // and each event's marker and date light up as the line reaches them.
  useGsap(timeline, ({ gsap }, el) => {
    const fill = el.querySelector("[data-timeline-fill]");
    gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 65%", end: "bottom 65%", scrub: 0.5 },
      },
    );
    for (const item of el.querySelectorAll("li")) {
      const day = item.querySelector("[data-day]");
      const dot = item.querySelector<HTMLElement>("[data-dot]");
      gsap.set(day, { opacity: 0.35 });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 65%",
            toggleActions: "play none none reverse",
            // Colour via CSS ([data-lit] in styles.css): GSAP can't blend oklch.
            onEnter: () => dot?.setAttribute("data-lit", ""),
            onLeaveBack: () => dot?.removeAttribute("data-lit"),
          },
        })
        .to(day, { opacity: 1, duration: 0.4 })
        .to(dot, { scale: 1.6, duration: 0.4 }, 0);
    }
  });

  return (
    <section id="events" aria-labelledby="events-title" className="bg-ink-deep py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <SectionRule index="02" label="AAK now" tone="dark" />
        </Reveal>
        <Reveal className="mt-8 grid gap-8 border-b border-background/12 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 id="events-title" className="type-section mt-4 text-background">
              What&rsquo;s happening at AAK
            </h2>
            <Link to="/events" className="link-quiet mt-5 text-background/80">
              See the full calendar
            </Link>
          </div>
          <blockquote className="max-w-sm border-l-2 border-primary/60 pl-5 lg:pl-6">
            <p className="font-accent text-base font-medium italic leading-snug text-background/85 sm:text-lg">
              &ldquo;Shifting the Center: reclaiming Africa&rsquo;s architecture and future.&rdquo;
            </p>
            <footer className="meta-label mt-3 text-background/65">
              Nairobi Biennale of Architecture &amp; Art, 2026 theme
            </footer>
          </blockquote>
        </Reveal>

        <div ref={timeline} className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-3 top-0 bottom-0 w-px bg-background/12 lg:-left-6"
          >
            <div data-timeline-fill className="h-full w-full origin-top scale-y-0 bg-primary" />
          </div>
          <ul>
            {events.map((event, i) => {
              const status = getEventDisplayStatus(event);
              const start = new Date(event.isoDate);
              const month = start.toLocaleDateString("en-US", { month: "long" });
              const day = start.toLocaleDateString("en-US", { day: "2-digit" });
              const prevMonth =
                i > 0
                  ? new Date(events[i - 1]!.isoDate).toLocaleDateString("en-US", { month: "long" })
                  : null;
              const cardClassName =
                "group grid gap-4 py-8 sm:grid-cols-[5rem_1fr] sm:items-center lg:grid-cols-[8rem_1fr_auto] lg:gap-8";
              const body = (
                <>
                  {month !== prevMonth ? (
                    <span className="meta-label -mb-2 text-background/60 sm:col-span-full">
                      {month}
                    </span>
                  ) : null}
                  <span
                    data-day
                    className="font-display text-5xl font-semibold text-background/90 lg:text-6xl"
                  >
                    {day}
                  </span>
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "meta-label",
                          status === "ongoing" ? "text-primary" : "text-background/50",
                        )}
                      >
                        {status === "ongoing" ? "Ongoing" : "Upcoming"}
                      </span>
                      <span className="meta-label text-background/50">{event.kicker}</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-background transition-colors duration-300 group-hover:text-primary">
                      {event.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-background/65">
                      <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                      {event.location}
                    </p>
                    <Countdown
                      targetIso={event.isoDate}
                      endIso={event.endIsoDate}
                      className="mt-2 inline-block text-xs font-semibold text-[oklch(0.75_0.13_38.5)]"
                    />
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-background">
                    View event
                    <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </>
              );
              return (
                <li
                  key={event.slug}
                  className="relative border-b border-background/12 first:border-t"
                >
                  <span
                    data-dot
                    aria-hidden="true"
                    className="timeline-dot absolute -left-3 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/30 lg:-left-6"
                  />
                  {event.externalSiteHref ? (
                    <a
                      href={event.externalSiteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClassName}
                    >
                      {body}
                    </a>
                  ) : (
                    <Link
                      to="/events/$slug"
                      params={{ slug: event.slug }}
                      className={cardClassName}
                    >
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <p className="text-sm text-background/65">
            Conventions, CPD sessions, site visits and more across the year.
          </p>
          <Link to="/events" className="group btn-primary">
            View all events
            <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
