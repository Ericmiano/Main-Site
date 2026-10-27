import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import type { RingTower as RingTowerComponent, RingTowerHit } from "@/components/ui/ring-tower";
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

/** Photos for the rings: each album's cover and one more, the grid-sized
 * copies, dealt round the five rings so no two show the same set. Each
 * remembers its album, so a click on the rings can open it. */
const RING_PHOTOS = mediaAlbums.flatMap((album) =>
  [album.cover, album.photos.find((photo) => photo.src !== album.cover.src)]
    .filter((photo) => photo !== undefined)
    .map((photo) => ({ url: photo.thumb ?? photo.src, album })),
);
const ALBUM_OF = new Map(RING_PHOTOS.map(({ url, album }) => [url, album]));
const RINGS = Array.from({ length: 5 }, (_, i) => ({
  images: RING_PHOTOS.filter((_, j) => j % 5 === i).map(({ url }) => url),
}));

/**
 * The opening screen's rings: album photos crawling round a tower of tilted
 * rings. Hovering a photo names its album and clicking (or tapping) opens
 * it; dragging spins the tower. Pointer only: the same albums are listed,
 * with links, below. three.js loads only here, once the page is up.
 */
function PhotoRings() {
  const navigate = useNavigate();
  const stage = useRef<HTMLDivElement>(null);
  const [Tower, setTower] = useState<typeof RingTowerComponent | null>(null);
  const [hover, setHover] = useState<{
    slug: string;
    x: number;
    y: number;
    /** Near the right edge: the label goes left of the pointer instead. */
    flip: boolean;
  } | null>(null);
  useEffect(() => {
    let live = true;
    void import("@/components/ui/ring-tower").then((module) => {
      if (live) setTower(() => module.RingTower);
    });
    return () => {
      live = false;
    };
  }, []);
  const onHover = useCallback((hit: RingTowerHit | null) => {
    const album = hit && ALBUM_OF.get(hit.url);
    const box = stage.current?.getBoundingClientRect();
    setHover(
      hit && album && box
        ? {
            slug: album.slug,
            x: hit.clientX - box.left,
            y: hit.clientY - box.top,
            flip: Math.min(box.right, window.innerWidth) - hit.clientX < 300,
          }
        : null,
    );
  }, []);
  const onPick = useCallback(
    (hit: RingTowerHit) => {
      const album = ALBUM_OF.get(hit.url);
      if (album) void navigate({ to: "/media/$slug", params: { slug: album.slug } });
    },
    [navigate],
  );
  const album = hover && mediaAlbums.find((a) => a.slug === hover.slug);

  return (
    <div
      ref={stage}
      // Runs off the right edge of the window; fades in from the words' side.
      className="relative h-[26rem] sm:h-[32rem] lg:-mr-[max(0px,calc((100vw-1400px)/2))] lg:h-auto lg:[mask-image:linear-gradient(to_right,transparent,#000_16%)]"
    >
      {/* The stage is always dark, so the rings' insides fade to black. */}
      {Tower ? (
        <Tower
          rings={RINGS}
          theme="dark"
          className="lg:right-[-14%] lg:left-[4%]"
          onHover={onHover}
          onPick={onPick}
        />
      ) : null}
      {album && hover ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 w-max max-w-64 rounded-lg bg-background px-4 py-3 text-ink-deep shadow-xl"
          style={{
            left: hover.x + (hover.flip ? -16 : 16),
            top: hover.y + 16,
            transform: hover.flip ? "translateX(-100%)" : undefined,
          }}
        >
          <span className="meta-label block text-primary">{album.category}</span>
          <span className="mt-1 block font-display text-lg leading-snug font-semibold">
            {album.title}
          </span>
          <span className="mt-1 flex items-center gap-1 text-sm text-ink-deep/70">
            {album.photos.length} photos &middot; Open album
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </span>
        </div>
      ) : null}
    </div>
  );
}

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
        {/* A dark opening screen: the words on the left, the album rings on
            the right. The colour tokens flip so the breadcrumb and text read
            light on dark. */}
        <section className="overflow-hidden bg-ink-deep [--border:color-mix(in_oklab,var(--background)_18%,transparent)] [--foreground:var(--background)] [--muted-foreground:color-mix(in_oklab,var(--background)_70%,transparent)]">
          <div className="mx-auto grid max-w-[1400px] lg:min-h-[calc(100svh-10.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="relative z-10 flex flex-col justify-between gap-12 px-6 pt-12 pb-4 lg:px-12 lg:py-16">
              <PageBreadcrumb trail={[{ label: "Media" }]} />

              <Reveal>
                <div className="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
                  <Photo className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>
                    {mediaAlbums.length} albums &nbsp;/&nbsp; {totalPhotos} photographs
                  </span>
                </div>
                <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
                  Media archive
                </h1>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {DESCRIPTION}
                </p>
                <p className="meta-label mt-8 text-muted-foreground">
                  Click or tap a photo to open its album &middot; drag to spin
                </p>
              </Reveal>
            </div>
            <PhotoRings />
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
                  <span className={filter === category ? "opacity-70" : undefined}>
                    {countFor(category)}
                  </span>
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              Showing {visible.length} {visible.length === 1 ? "album" : "albums"}
            </p>

            <ul
              ref={list}

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
                          // The thumbnail is 640px: offer the full photo too, so the
                          // wide lead card and high-density screens stay sharp.
                          {...(album.cover.thumb
                            ? {
                                srcSet: `${album.cover.thumb} 640w, ${album.cover.src} 1600w`,
                                sizes: isLead
                                  ? "(min-width: 640px) 90vw, 100vw"
                                  : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
                              }
                            : {})}
                          alt=""
                          loading={i < 2 ? "eager" : "lazy"}
                          // Carried into its place in the album's grid.
                          style={{ viewTransitionName: `album-${album.slug}` }}
                          className={cn(
                            "aspect-4/3 w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]",
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
