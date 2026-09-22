import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
import { getEvent, getEventDisplayStatus, type SiteEvent } from "@/data/site";

const SITE_URL = "https://aak.or.ke";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return event;
  },
  head: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) {
      return { meta: [{ title: "Event not found | Architectural Association of Kenya" }] };
    }
    const title = `${event.title} | Architectural Association of Kenya`;
    return {
      meta: [
        { title },
        { name: "description", content: event.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: event.summary },
        { property: "og:type", content: "article" },
        { property: "og:image", content: event.image },
        { property: "og:url", content: `${SITE_URL}/events/${event.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/events/${event.slug}` }],
    };
  },
  component: EventDetail,
  notFoundComponent: EventNotFound,
});

function RegisterCta({ event, className }: { event: SiteEvent; className: string }) {
  if (event.registerTo) {
    return (
      <Link {...event.registerTo} className={className}>
        {event.registerLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    );
  }
  return (
    <a href={event.registerHref} target="_blank" rel="noopener noreferrer" className={className}>
      {event.registerLabel}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

/** Absolute URL for the register destination, for JSON-LD — resolves the `/initiatives/$slug` param when present. */
function registerUrl(event: SiteEvent): string | undefined {
  if (event.registerHref) return event.registerHref;
  if (!event.registerTo) return undefined;
  const path =
    "params" in event.registerTo
      ? event.registerTo.to.replace("$slug", event.registerTo.params.slug)
      : event.registerTo.to;
  return `${SITE_URL}${path}`;
}

function structuredData(event: SiteEvent) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Events", item: `${SITE_URL}/events` },
          {
            "@type": "ListItem",
            position: 3,
            name: event.title,
            item: `${SITE_URL}/events/${event.slug}`,
          },
        ],
      },
      {
        "@type": "Event",
        name: event.title,
        description: event.summary,
        startDate: event.isoDate,
        ...(event.endIsoDate ? { endDate: event.endIsoDate } : {}),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        image: event.image,
        location: {
          "@type": "Place",
          name: event.location,
          address: event.venue,
        },
        organizer: {
          "@type": "Organization",
          name: "Architectural Association of Kenya",
          url: SITE_URL,
        },
        offers: {
          "@type": "Offer",
          url: registerUrl(event),
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };
}

function EventDetail() {
  const event = Route.useLoaderData();
  const status = getEventDisplayStatus(event);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(event)) }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-10 lg:py-14">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb
              trail={[{ label: "Events", href: "/events" }, { label: event.title }]}
            />
          </div>
        </section>

        <article>
          <section className="py-14 lg:py-20">
            <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-12">
              <Reveal>
                <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  <span
                    className={
                      status === "ongoing"
                        ? "inline-flex items-center gap-2 bg-primary px-3 py-1 text-primary-foreground"
                        : "inline-flex items-center gap-2 bg-secondary px-3 py-1 text-secondary-foreground"
                    }
                  >
                    {status === "ongoing" ? (
                      <span className="pulse-dot h-1.5 w-1.5 bg-primary-foreground" />
                    ) : null}
                    {status === "ongoing" ? "Ongoing" : status === "past" ? "Past" : "Upcoming"}
                  </span>
                  <span>{event.kicker}</span>
                </div>
                <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
                  {event.title}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {event.summary}
                </p>

                <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {event.facts.map((fact) => (
                    <div key={fact.label} className="rounded-xl border border-border p-4">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {fact.label}
                      </dt>
                      <dd className="mt-1.5 text-sm font-medium text-foreground">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                <Countdown
                  targetIso={event.isoDate}
                  endIso={event.endIsoDate}
                  compact={false}
                  className="mt-8"
                />

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <RegisterCta
                    event={event}
                    className="group inline-flex items-center gap-3 rounded-xl bg-foreground px-7 py-4 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
                  />
                  <Link to="/events" className="link-underline text-sm font-medium text-foreground">
                    Back to all events
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <figure className="overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src={event.image}
                    alt={event.imageAlt}
                    loading="lazy"
                    className="aspect-4/3 w-full object-cover"
                  />
                </figure>
                <div className="mt-6 space-y-3 rounded-2xl border border-border p-6 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <time dateTime={event.isoDate}>{event.date}</time>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{event.venue}</span>
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {event.body.length ? (
            <section
              aria-labelledby="event-details-title"
              className="border-t border-border py-14 lg:py-20"
            >
              <div className="mx-auto max-w-3xl px-6 lg:px-12">
                <h2 id="event-details-title" className="sr-only">
                  About this event
                </h2>
                <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
                  {event.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {event.agenda && event.agenda.length ? (
            <section
              aria-labelledby="event-agenda-title"
              className="border-t border-border bg-secondary/40 py-14 lg:py-20"
            >
              <div className="mx-auto max-w-3xl px-6 lg:px-12">
                <h2
                  id="event-agenda-title"
                  className="font-display text-2xl font-semibold tracking-tight text-foreground"
                >
                  Programme
                </h2>
                <ol className="mt-8 space-y-6 border-l border-border pl-6">
                  {event.agenda.map((item) => (
                    <li key={`${item.time}-${item.label}`} className="relative">
                      <span
                        className="absolute -left-[1.6rem] top-1 h-2.5 w-2.5 bg-primary"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {item.time}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">{item.label}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ) : null}

          <section className="border-t border-border py-16 text-center lg:py-20">
            <div className="mx-auto max-w-xl px-6 lg:px-12">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Ready to take part?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.cta}</p>
              <RegisterCta
                event={event}
                className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              />
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function EventNotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[50vh] items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Event not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This event may have closed or the link may be out of date.
          </p>
          <Link
            to="/events"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            View all events
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
