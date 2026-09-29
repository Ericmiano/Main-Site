import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconArrowUpRight as ArrowUpRight,
  IconCalendar as CalendarDays,
  IconMapPin as MapPin,
  IconPhoto as Photo,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { mediaAlbums } from "@/data/media-archive";
import { flipIfLoaded, gsapIfLoaded, preloadFlip, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const ALL = "All albums";
const CATEGORIES = [ALL, ...new Set(mediaAlbums.map((album) => album.category))];
const countFor = (category: string) =>
  category === ALL
    ? mediaAlbums.length
    : mediaAlbums.filter((album) => album.category === category).length;

const SITE_URL = "https://aak.or.ke";
const TITLE = "Media archive | Architectural Association of Kenya";
const DESCRIPTION =
  "Photographs from past AAK events: site visits, workshops, Grow A Classroom schools and more, one album per event.";

export const Route = createFileRoute("/media/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/media` },
      { property: "og:image", content: `${SITE_URL}${mediaAlbums[0]!.cover.src}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/media` }],
  }),
  component: MediaIndex,
});

function MediaIndex() {
  const totalPhotos = mediaAlbums.reduce((n, album) => n + album.photos.length, 0);
  const [filter, setFilter] = useState(ALL);
  const list = useRef<HTMLUListElement>(null);
  const flipState =
    useRef<ReturnType<NonNullable<ReturnType<typeof flipIfLoaded>>["getState"]>>(null);
  const heightBefore = useRef(0);

  useEffect(preloadFlip, []);

  const choose = (next: string) => {
    if (next === filter) return;
    const kit = gsapIfLoaded();
    const Flip = flipIfLoaded();
    const items = list.current ? [...list.current.children] : [];
    if (kit && Flip && !prefersReducedMotion()) {
      // Cards still waiting for their scroll-in would be measured hidden.
      kit.gsap.set(items, { clearProps: "opacity,visibility,transform" });
      flipState.current = Flip.getState(items);
      heightBefore.current = list.current?.offsetHeight ?? 0;
    }
    setFilter(next);
  };

  // Albums glide to their new places; the ones filtered in or out fade.
  useLayoutEffect(() => {
    const state = flipState.current;
    const kit = gsapIfLoaded();
    const Flip = flipIfLoaded();
    flipState.current = null;
    const ul = list.current;
    if (!state || !kit || !Flip || !ul) return;
    // Flip lifts the cards out of the flow while they move, which would
    // collapse the list and pull the footer up; ease its height instead.
    kit.gsap.fromTo(
      ul,
      { height: heightBefore.current },
      { height: ul.offsetHeight, duration: 0.7, ease: "expo.inOut", clearProps: "height" },
    );
    Flip.from(state, {
      duration: 0.7,
      ease: "expo.inOut",
      absolute: true,
      onEnter: (els) =>
        kit.gsap.fromTo(
          els,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.25, ease: "expo.out" },
        ),
      onLeave: (els) => kit.gsap.to(els, { autoAlpha: 0, y: -16, duration: 0.3 }),
    });
  }, [filter]);

  const visible = mediaAlbums.filter((album) => filter === ALL || album.category === filter);
  const lead = visible[0]?.slug;

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Media" }]} />

            <Reveal className="mt-8">
              <div className="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
                <Photo className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>
                  {mediaAlbums.length} albums &nbsp;/&nbsp; {totalPhotos} photographs
                </span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Media archive
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {DESCRIPTION}
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="albums-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="albums-title" className="sr-only">
              Albums
            </h2>
            <div
              role="group"
              aria-label="Filter albums by category"
              className="mb-10 flex flex-wrap gap-2 lg:mb-14"
            >
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={filter === category}
                  onClick={() => choose(category)}
                  className={cn(
                    "meta-label inline-flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors duration-300",
                    filter === category
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {category}
                  <span className="opacity-60">{countFor(category)}</span>
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              Showing {visible.length} {visible.length === 1 ? "album" : "albums"}
            </p>

            <ul
              ref={list}
              data-stagger
              className="relative grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {mediaAlbums.map((album, i) => {
                const shown = filter === ALL || album.category === filter;
                const isLead = album.slug === lead;
                return (
                  <li
                    key={album.slug}
                    className={cn(!shown && "hidden", isLead && "sm:col-span-2 lg:col-span-2")}
                  >
                    <Link
                      to="/media/$slug"
                      params={{ slug: album.slug }}
                      className="group flex h-full flex-col"
                    >
                      <div className="relative overflow-hidden bg-secondary">
                        <img
                          src={album.cover.thumb ?? album.cover.src}
                          alt=""
                          loading={i < 2 ? "eager" : "lazy"}
                          className={cn(
                            "aspect-4/3 w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105",
                            isLead && "sm:aspect-[16/9] lg:aspect-[21/8]",
                          )}
                        />
                        <span className="meta-label absolute bottom-3 left-3 bg-ink-deep/85 px-3 py-1.5 text-background">
                          {album.photos.length} photos
                          {album.video ? " + film" : ""}
                        </span>
                      </div>
                      <div className="mt-5 flex flex-1 flex-col border-t border-border pt-4">
                        <span className="meta-label text-muted-foreground">{album.category}</span>
                        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                          {album.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                          {album.date ? (
                            <span className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                              <time dateTime={album.isoDate}>{album.date}</time>
                            </span>
                          ) : null}
                          {album.location ? (
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                              {album.location}
                            </span>
                          ) : null}
                        </div>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                          View album
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                        </span>
                      </div>
                    </Link>
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
