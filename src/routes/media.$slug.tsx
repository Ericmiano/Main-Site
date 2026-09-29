import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  IconArrowLeft as ArrowLeft,
  IconArrowRight as ArrowRight,
  IconArrowUpRight as ArrowUpRight,
  IconCalendar as CalendarDays,
  IconMapPin as MapPin,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { getMediaAlbum, mediaAlbums, type MediaAlbum } from "@/data/media-archive";

const SITE_URL = "https://aak.or.ke";

export const Route = createFileRoute("/media/$slug")({
  loader: ({ params }) => {
    const album = getMediaAlbum(params.slug);
    if (!album) throw notFound();
    return album;
  },
  head: ({ params }) => {
    const album = getMediaAlbum(params.slug);
    if (!album) {
      return { meta: [{ title: "Album not found | Architectural Association of Kenya" }] };
    }
    const title = `${album.title}: photos | Architectural Association of Kenya`;
    return {
      meta: [
        { title },
        { name: "description", content: album.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: album.summary },
        { property: "og:type", content: "article" },
        { property: "og:image", content: `${SITE_URL}${album.cover.src}` },
        { property: "og:url", content: `${SITE_URL}/media/${album.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/media/${album.slug}` }],
    };
  },
  component: AlbumPage,
  notFoundComponent: AlbumNotFound,
});

function structuredData(album: MediaAlbum) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Media", item: `${SITE_URL}/media` },
          {
            "@type": "ListItem",
            position: 3,
            name: album.title,
            item: `${SITE_URL}/media/${album.slug}`,
          },
        ],
      },
      {
        "@type": "ImageGallery",
        name: album.title,
        description: album.summary,
        ...(album.isoDate ? { dateCreated: album.isoDate } : {}),
        contentLocation: { "@type": "Place", name: album.location },
        image: album.photos.map((photo) => `${SITE_URL}${photo.src}`),
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

const isExternal = (href: string) => /^https?:|\.pdf$/i.test(href);

function AlbumPage() {
  const album = Route.useLoaderData();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos = album.photos;
  const active = openIndex !== null ? photos[openIndex] : undefined;

  const position = mediaAlbums.findIndex((a) => a.slug === album.slug);
  const newer = mediaAlbums[position - 1];
  const older = mediaAlbums[position + 1];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(album)) }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Media", href: "/media" }, { label: album.title }]} />

            <Reveal className="mt-8">
              <div className="meta-label flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5 text-muted-foreground">
                <span>{album.category}</span>
                <span aria-hidden="true">/</span>
                <span>
                  {photos.length} photos{album.video ? " + film" : ""}
                </span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                {album.title}
              </h1>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {album.date ? (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                    <time dateTime={album.isoDate}>{album.date}</time>
                  </span>
                ) : null}
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  {album.location}
                </span>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {album.summary}
              </p>
              {album.links?.length ? (
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                  {album.links.map((link) =>
                    isExternal(link.href) ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-quiet inline-flex items-center gap-2 text-foreground"
                      >
                        {link.label}
                        <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
                      </a>
                    ) : (
                      <a key={link.href} href={link.href} className="link-quiet text-foreground">
                        {link.label}
                      </a>
                    ),
                  )}
                </div>
              ) : null}
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="photos-title" className="py-12 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="photos-title" className="sr-only">
              Photographs
            </h2>

            {album.video ? (
              <figure className="mb-10 overflow-hidden bg-ink-deep">
                <video
                  controls
                  preload="none"
                  poster={album.cover.thumb ?? album.cover.src}
                  className="aspect-video w-full"
                >
                  <source src={album.video.src} type="video/mp4" />
                </video>
                <figcaption className="meta-label px-4 py-3 text-background/70">
                  Film &middot; {album.video.title}
                </figcaption>
              </figure>
            ) : null}

            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {photos.map((photo, i) => (
                <li key={photo.src}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    className="group block w-full overflow-hidden bg-secondary"
                  >
                    <img
                      src={photo.thumb ?? photo.src}
                      alt={photo.alt}
                      loading={i < 8 ? "eager" : "lazy"}
                      decoding="async"
                      className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </button>
                </li>
              ))}
            </ul>

            <nav
              aria-label="More albums"
              className="mt-16 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-2"
            >
              {newer ? (
                <Link to="/media/$slug" params={{ slug: newer.slug }} className="group">
                  <span className="meta-label flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4 text-primary" aria-hidden="true" />
                    Newer album
                  </span>
                  <span className="mt-2 block font-display text-lg font-semibold text-foreground group-hover:underline">
                    {newer.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {older ? (
                <Link
                  to="/media/$slug"
                  params={{ slug: older.slug }}
                  className="group sm:text-right"
                >
                  <span className="meta-label flex items-center gap-2 text-muted-foreground sm:justify-end">
                    Older album
                    <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
                  </span>
                  <span className="mt-2 block font-display text-lg font-semibold text-foreground group-hover:underline">
                    {older.title}
                  </span>
                </Link>
              ) : null}
            </nav>
            <p className="mt-10">
              <Link to="/media" className="link-quiet text-foreground">
                All albums
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Lightbox
        open={active !== undefined}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null);
        }}
        onNavigate={(direction) =>
          setOpenIndex((current) =>
            current === null ? current : (current + direction + photos.length) % photos.length,
          )
        }
        title={active?.alt ?? album.title}
      >
        {active ? (
          <figure>
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[72vh] w-full bg-ink-deep object-contain"
            />
            <figcaption className="flex items-baseline justify-between gap-4 px-6 py-5 sm:px-8">
              <span className="text-sm leading-relaxed text-foreground">{active.alt}</span>
              <span className="meta-label shrink-0 text-muted-foreground">
                {(openIndex ?? 0) + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
        ) : null}
      </Lightbox>
      <Footer />
    </>
  );
}

function AlbumNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
        <h1 className="font-display text-4xl font-semibold text-foreground">Album not found</h1>
        <p className="mt-4 text-muted-foreground">
          That album isn&rsquo;t in the archive.{" "}
          <Link to="/media" className="link-quiet text-foreground">
            See all albums
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
