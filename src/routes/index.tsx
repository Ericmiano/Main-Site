import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { EventsStrip } from "@/components/home/EventsStrip";
import { Spotlight } from "@/components/home/Spotlight";
import { Biennale } from "@/components/home/Biennale";
import { Initiatives } from "@/components/home/Initiatives";
import { Chapters } from "@/components/home/Chapters";
import { Partners } from "@/components/home/Partners";
import { MediaGrid } from "@/components/home/MediaGrid";
import { Publications } from "@/components/home/Publications";
import { Membership } from "@/components/home/Membership";
import { getSortedEvents } from "@/data/site";

const SITE_URL = "https://aak.or.ke";
const TITLE = "AAK | Architectural Association of Kenya";
const DESCRIPTION =
  "The Architectural Association of Kenya unites eight built-environment chapters. Explore events, awards, green building standards and member services.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Architectural Association of Kenya" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Index,
});

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Architectural Association of Kenya",
        alternateName: "AAK",
        url: SITE_URL,
        foundingDate: "1967",
        description: DESCRIPTION,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
      },
      {
        "@type": "ItemList",
        name: "Upcoming AAK events",
        itemListElement: getSortedEvents().map((event, i) => ({
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

function Index() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <Header />
      <main>
        <Hero />
        <EventsStrip />
        <Spotlight />
        <Biennale />
        <Initiatives />
        <Chapters />
        <Partners />
        <MediaGrid />
        <Publications />
        <Membership />
      </main>
      <Footer />
    </>
  );
}
