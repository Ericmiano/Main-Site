import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconArrowUpRight as ArrowUpRight,
  IconCalendar as CalendarDays,
  IconMapPin as MapPin,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Countdown } from "@/components/site/Countdown";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { cn } from "@/lib/utils";
import { getEventDisplayStatus, getSortedEvents, type SiteEvent } from "@/data/site";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Events | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK's calendar of association-wide events: the Annual Convention, the Nairobi Biennale of Architecture & Art, the Sports & Wellness Day and the Urban Thinkers Campus.";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/events` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/events` }],
  }),
  component: EventsIndex,
});

function structuredData(events: SiteEvent[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Events", item: `${SITE_URL}/events` },
        ],
      },
      {
        "@type": "ItemList",
        name: "AAK events",
        itemListElement: events.map((event, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Event",
            name: event.title,
            startDate: event.isoDate,
            ...(event.endIsoDate ? { endDate: event.endIsoDate } : {}),
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: { "@type": "Place", name: event.location },
            url: `${SITE_URL}/events/${event.slug}`,
            organizer: { "@id": `${SITE_URL}/#organization` },
          },
        })),
      },
    ],
  };
}

function EventsIndex() {
  const events = getSortedEvents();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(events)) }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Events" }]} />

            <Reveal className="mt-8">
              <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Ongoing &amp; upcoming</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                What&rsquo;s happening at AAK
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {DESCRIPTION}
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="events-list-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="events-list-title" className="sr-only">
              All events
            </h2>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => {
                const status = getEventDisplayStatus(event);
                const cardClassName =
                  "group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7 transition-colors duration-300 hover:border-primary/60";
                const cardBody = (
                  <>
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                            status === "ongoing"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          {status === "ongoing" ? (
                            <span className="pulse-dot h-1.5 w-1.5 bg-primary-foreground" />
                          ) : null}
                          {status === "ongoing"
                            ? "Ongoing"
                            : status === "past"
                              ? "Past"
                              : "Upcoming"}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {event.kicker}
                        </span>
                      </div>
                      <h3 className="mt-6 font-display text-xl font-semibold leading-snug text-foreground">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {event.summary}
                      </p>
                      <div className="mt-5 space-y-2 text-sm text-muted-foreground">
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
                        className="mt-3 inline-block text-xs font-semibold text-primary"
                      />
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      View details
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    </span>
                  </>
                );
                return (
                  <li key={event.slug}>
                    <Reveal delay={i * 60} className="h-full">
                      {event.externalSiteHref ? (
                        <a
                          href={event.externalSiteHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cardClassName}
                        >
                          {cardBody}
                        </a>
                      ) : (
                        <Link
                          to="/events/$slug"
                          params={{ slug: event.slug }}
                          className={cardClassName}
                        >
                          {cardBody}
                        </Link>
                      )}
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
