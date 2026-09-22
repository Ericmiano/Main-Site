import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import {
  getInitiativeDetail,
  type InitiativeGalleryImage,
  type InitiativeVideo,
} from "@/data/initiatives-detail";

function VideoEmbed({ video, className }: { video: InitiativeVideo; className?: string }) {
  if (video.kind === "file") {
    return (
      <video controls preload="metadata" className={className}>
        <source src={video.src} type="video/mp4" />
      </video>
    );
  }
  return (
    <iframe
      src={video.src}
      title={video.title}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

function PhotoGrid({ photos }: { photos: InitiativeGalleryImage[] }) {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, i) => (
        <li key={photo.src}>
          <Reveal delay={(i % 3) * 60}>
            <figure className="overflow-hidden rounded-2xl bg-secondary">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-4/3 w-full object-cover"
              />
            </figure>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

const SITE_URL = "https://aak.or.ke";

export const Route = createFileRoute("/initiatives/$slug")({
  loader: ({ params }) => {
    const initiative = getInitiativeDetail(params.slug);
    if (!initiative) throw notFound();
    return initiative;
  },
  head: ({ params }) => {
    const initiative = getInitiativeDetail(params.slug);
    if (!initiative) {
      return { meta: [{ title: "Initiative not found | Architectural Association of Kenya" }] };
    }
    const title = `${initiative.title} | Architectural Association of Kenya`;
    return {
      meta: [
        { title },
        { name: "description", content: initiative.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: initiative.summary },
        { property: "og:type", content: "article" },
        { property: "og:image", content: initiative.image },
        { property: "og:url", content: `${SITE_URL}/initiatives/${initiative.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/initiatives/${initiative.slug}` }],
    };
  },
  component: InitiativeDetail,
  notFoundComponent: InitiativeNotFound,
});

function InitiativeDetail() {
  const initiative = Route.useLoaderData();
  const [primaryVideo, ...moreVideos] = initiative.videos ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: initiative.title,
                    item: `${SITE_URL}/initiatives/${initiative.slug}`,
                  },
                ],
              },
              {
                "@type": "Article",
                headline: initiative.title,
                description: initiative.summary,
                image: initiative.image,
                publisher: { "@id": `${SITE_URL}/#organization` },
              },
            ],
          }),
        }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-10 lg:py-14">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb
              trail={[{ label: "Initiatives", href: "/#initiatives" }, { label: initiative.title }]}
            />
          </div>
        </section>

        <article>
          <section className="py-14 lg:py-20">
            <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-12">
              <Reveal>
                <span
                  className={
                    initiative.tone === "green"
                      ? "text-[11px] font-semibold uppercase tracking-[0.16em] text-sustain"
                      : "text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                  }
                >
                  {initiative.eyebrow}
                </span>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                  {initiative.title}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {initiative.summary}
                </p>

                {initiative.stats.length ? (
                  <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {initiative.stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-border p-4">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {stat.label}
                        </dt>
                        <dd className="mt-1.5 text-sm font-medium text-foreground">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </Reveal>

              <Reveal delay={120}>
                <figure className="overflow-hidden rounded-2xl bg-secondary">
                  {primaryVideo ? (
                    <VideoEmbed video={primaryVideo} className="aspect-video w-full" />
                  ) : (
                    <img
                      src={initiative.image}
                      alt={initiative.imageAlt}
                      loading="lazy"
                      className="aspect-4/3 w-full object-cover"
                    />
                  )}
                </figure>
              </Reveal>
            </div>
          </section>

          {moreVideos.length ? (
            <section className="border-t border-border py-14 lg:py-20">
              <div className="mx-auto max-w-3xl px-6 lg:px-12">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  More video
                </h2>
                <div className="mt-4 space-y-8">
                  {moreVideos.map((video) => (
                    <div key={video.src}>
                      <p className="mb-3 text-sm font-medium text-foreground">{video.title}</p>
                      <div className="aspect-video overflow-hidden border border-border bg-secondary">
                        <VideoEmbed video={video} className="h-full w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section className="border-t border-border py-14 lg:py-20">
            <div className="mx-auto max-w-3xl px-6 lg:px-12">
              <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
                {initiative.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {initiative.audio?.length ? (
                <div className="mt-10 border-t border-border pt-8">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Radio coverage
                  </h2>
                  <ul className="mt-4 space-y-5">
                    {initiative.audio.map((clip) => (
                      <li key={clip.src}>
                        <p className="text-sm font-medium text-foreground">{clip.label}</p>
                        <audio controls preload="none" className="mt-2 w-full">
                          <source src={clip.src} type="audio/mpeg" />
                        </audio>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {initiative.documents?.length ? (
                <div className="mt-10 border-t border-border pt-8">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Documents
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {initiative.documents.map((doc) => (
                      <li key={doc.href}>
                        <a
                          href={doc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                        >
                          {doc.title}
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {initiative.contacts?.length ? (
                <div className="mt-10 border-t border-border pt-8">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Report a concern
                  </h2>
                  <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {initiative.contacts.map((contact) => (
                      <li key={contact.href}>
                        <a
                          href={contact.href}
                          target={contact.href.startsWith("http") ? "_blank" : undefined}
                          rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="group flex flex-col rounded-xl border border-border p-4 transition-colors hover:bg-secondary/60"
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                            {contact.label}
                          </span>
                          <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                            {contact.value}
                            <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>

          {initiative.gallery?.length ? (
            <section
              aria-labelledby="gallery-title"
              className="border-t border-border bg-secondary/40 py-14 lg:py-20"
            >
              <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                <h2
                  id="gallery-title"
                  className="font-display text-2xl font-semibold tracking-tight text-foreground"
                >
                  Photo gallery
                </h2>
                <PhotoGrid photos={initiative.gallery} />
              </div>
            </section>
          ) : null}

          {initiative.events?.map((event, i) => (
            <section
              key={event.title}
              aria-labelledby={`event-title-${i}`}
              className="border-t border-border bg-secondary/40 py-14 lg:py-20"
            >
              <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2
                    id={`event-title-${i}`}
                    className="font-display text-2xl font-semibold tracking-tight text-foreground"
                  >
                    {event.title}
                  </h2>
                  {event.date ? (
                    <span className="text-sm font-medium text-muted-foreground">{event.date}</span>
                  ) : null}
                </div>
                {event.video ? (
                  <Reveal className="mt-8">
                    <figure className="overflow-hidden rounded-2xl bg-secondary">
                      <VideoEmbed video={event.video} className="aspect-video w-full" />
                    </figure>
                  </Reveal>
                ) : null}
                <PhotoGrid photos={event.gallery} />
              </div>
            </section>
          ))}

          <section className="border-t border-border py-16 text-center lg:py-20">
            <div className="mx-auto max-w-xl px-6 lg:px-12">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Get involved
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Reach the secretariat to support or take part in this programme.
              </p>
              <a
                href="mailto:advocacy@aak.or.ke"
                className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Contact advocacy@aak.or.ke
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function InitiativeNotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[50vh] items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Initiative not found
          </h1>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
