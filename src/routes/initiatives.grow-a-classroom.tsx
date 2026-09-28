import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  IconArrowUpRight as ArrowUpRight,
  IconCheck as Check,
  IconCopy as Copy,
  IconPhoto as PhotoIcon,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { CountUp } from "@/components/site/CountUp";
import { Lightbox } from "@/components/site/Lightbox";
import {
  gacDonation,
  gacOverview,
  gacSchools,
  gacStrategy,
  gacTagline,
  gacTargets,
  gacVideo,
  type GacPhoto,
  type GacSchool,
} from "@/data/grow-a-classroom";
import { cn } from "@/lib/utils";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Grow A Classroom | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK's Grow A Classroom programme: master plans, landscaping and on-site timber for Kenya's public schools, and the schools it has worked with so far.";
const HERO = gacSchools[0]!.highlights[0]!;
const counties = new Set(gacSchools.map((s) => s.county)).size;

export const Route = createFileRoute("/initiatives/grow-a-classroom")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `${SITE_URL}${HERO.src}` },
      { property: "og:url", content: `${SITE_URL}/initiatives/grow-a-classroom` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/initiatives/grow-a-classroom` }],
  }),
  component: GrowAClassroom,
});

const pad = (n: number) => String(n).padStart(2, "0");

function CopyValue({ label, value, dark }: { label: string; value: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the value stays visible to type.
    }
  };
  return (
    <div>
      <p className={cn("meta-label", dark ? "text-background/60" : "text-muted-foreground")}>
        {label}
      </p>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()} ${value}`}
        className="group mt-1 inline-flex items-center gap-2.5"
      >
        <span className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
          {value}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold transition-opacity",
            dark ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </span>
      </button>
    </div>
  );
}

function DonateCard({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "p-6 sm:p-7",
        dark ? "bg-ink-deep/70 text-background backdrop-blur-md" : "bg-background text-foreground",
      )}
    >
      <p
        className={cn(
          "meta-label",
          dark ? "text-[oklch(0.75_0.13_38.5)]" : "text-muted-foreground",
        )}
      >
        Donate &middot; {gacDonation.method}
      </p>
      <div className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
        <CopyValue label="Paybill" value={gacDonation.paybill} dark={dark} />
        <CopyValue label="Account" value={gacDonation.account} dark={dark} />
      </div>
    </div>
  );
}

function SchoolStory({
  school,
  index,
  onOpen,
}: {
  school: GacSchool;
  index: number;
  onOpen: (photos: GacPhoto[], start: number) => void;
}) {
  const photos = school.allPhotos ?? school.highlights;
  const [lead, ...rest] = school.highlights;

  return (
    <article
      id={school.id}
      aria-labelledby={`${school.id}-title`}
      className="scroll-mt-28 border-t border-border py-14 first:border-t-0 lg:py-20"
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="meta-label text-muted-foreground">
            {pad(index + 1)} / {pad(gacSchools.length)}
          </p>
          <h3
            id={`${school.id}-title`}
            className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            {school.name}
          </h3>
          <p className="meta-label mt-3 text-muted-foreground">
            {school.kind} &middot; {school.county}
            {school.date ? <> &middot; {school.date}</> : null}
          </p>

          {school.outcomes.length ? (
            <ul className="mt-8 space-y-3 border-t border-border pt-6">
              {school.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sustain/15 text-sustain">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={() => onOpen(photos, 0)}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            <PhotoIcon className="h-4 w-4 text-primary" aria-hidden="true" />
            View {photos.length > school.highlights.length ? `all ${photos.length}` : "the"} photos
          </button>
        </Reveal>

        <div>
          {lead ? (
            <ul className="grid grid-cols-5 gap-2 sm:gap-3">
              {[lead, ...rest].map((p, i) => (
                <li key={p.src} className={cn(i === 0 && "col-span-5")}>
                  <Reveal wipe={i === 0} delay={i === 0 ? 0 : (i % 3) * 60} className="h-full">
                    <button
                      type="button"
                      onClick={() =>
                        onOpen(
                          photos,
                          photos.findIndex((x) => x.src === p.src),
                        )
                      }
                      className="group block h-full w-full overflow-hidden bg-secondary"
                      aria-label={`Open photo: ${p.alt}`}
                    >
                      <img
                        src={p.src}
                        alt={p.alt}
                        loading="lazy"
                        className={cn(
                          "photo-grade h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                          i === 0 ? "aspect-video" : "aspect-square",
                        )}
                      />
                    </button>
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : null}

          {school.video ? (
            <Reveal className="mt-3">
              <figure className="overflow-hidden bg-ink-deep">
                <video controls preload="none" poster={lead?.src} className="aspect-video w-full">
                  <source src={school.video.src} type="video/mp4" />
                </video>
                <figcaption className="meta-label px-4 py-3 text-background/70">
                  Film &middot; {school.video.title}
                </figcaption>
              </figure>
            </Reveal>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function GrowAClassroom() {
  const [viewer, setViewer] = useState<{ photos: GacPhoto[]; index: number } | null>(null);
  const current = viewer ? viewer.photos[viewer.index] : undefined;

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
                    name: "Grow A Classroom",
                    item: `${SITE_URL}/initiatives/grow-a-classroom`,
                  },
                ],
              },
              {
                "@type": "Article",
                headline: "Grow A Classroom",
                description: DESCRIPTION,
                image: `${SITE_URL}${HERO.src}`,
                publisher: { "@id": `${SITE_URL}/#organization` },
              },
            ],
          }),
        }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-ink-deep">
          <img
            src={HERO.src}
            alt={HERO.alt}
            fetchPriority="high"
            className="photo-grade absolute inset-0 -z-10 h-full w-full object-cover hero-zoom"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-ink-deep via-ink-deep/60 to-ink-deep/10"
          />
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 pt-28 pb-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:px-12 lg:pb-16">
            <div>
              <div className="[&_a]:text-background/70 [&_a:hover]:text-background [&_li]:text-background/70 [&_span]:text-background">
                <PageBreadcrumb
                  trail={[
                    { label: "Initiatives", href: "/#initiatives" },
                    { label: "Grow A Classroom" },
                  ]}
                />
              </div>
              <p className="hero-item meta-label mt-10 text-sustain">
                Professional CSR &middot; Advocacy programme
              </p>
              <h1 className="hero-item hero-delay-1 mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-background sm:text-7xl lg:text-8xl">
                Grow A Classroom
              </h1>
              <p className="hero-item hero-delay-2 mt-5 max-w-xl font-accent text-xl italic text-background/85 sm:text-2xl">
                {gacTagline}
              </p>
            </div>
            <div className="hero-item hero-delay-3 lg:justify-self-end">
              <DonateCard dark />
            </div>
          </div>
        </section>

        {/* Targets */}
        <section aria-label="Impact targets" className="bg-ink-deep text-background">
          <dl className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-background/10 lg:grid-cols-4">
            {gacTargets.map((t) => (
              <div key={t.label} className="bg-ink-deep px-6 py-10 lg:px-12 lg:py-14">
                <dt className="meta-label text-background/55">{t.label}</dt>
                <dd className="mt-3 font-display text-4xl font-semibold tabular-nums sm:text-5xl lg:text-6xl">
                  <CountUp value={t.value} grouped {...(t.suffix ? { suffix: t.suffix } : {})} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Overview + film */}
        <section aria-labelledby="gac-overview" className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-12">
            <Reveal>
              <SectionRule index="01" label="The programme" />
              <h2 id="gac-overview" className="type-section mt-8 text-foreground">
                Better schools, designed by professionals and grown on site.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">{gacOverview}</p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We are actively seeking partners to roll out this initiative across all 47 counties
                in Kenya.
              </p>
            </Reveal>
            <Reveal delay={100} className="self-center">
              <div className="aspect-video overflow-hidden bg-ink-deep shadow-2xl">
                <iframe
                  src={gacVideo.src}
                  title={gacVideo.title}
                  loading="lazy"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="gac-strategy" className="bg-paper-earth py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <Reveal className="max-w-2xl">
              <SectionRule index="02" label="How it works" />
              <h2 id="gac-strategy" className="type-section mt-8 text-foreground">
                A classroom that grows its own materials.
              </h2>
            </Reveal>
            <ol className="mt-14 grid gap-px bg-foreground/15 sm:grid-cols-2 lg:grid-cols-5">
              {gacStrategy.map((step, i) => (
                <li key={step.title} className="bg-paper-earth">
                  <Reveal delay={i * 70} className="flex h-full flex-col p-6 lg:p-7">
                    <span className="font-display text-4xl font-semibold text-foreground/25">
                      {pad(i + 1)}
                    </span>
                    <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/70">{step.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* School by school */}
        <section aria-labelledby="gac-schools" className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <Reveal className="max-w-2xl">
              <SectionRule index="03" label="School by school" />
              <h2 id="gac-schools" className="type-section mt-8 text-foreground">
                {gacSchools.length} schools across {counties} counties, so far.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Follow the Grow A Classroom initiative school by school, with highlights from each
                visit.
              </p>
            </Reveal>

            <nav
              aria-label="Schools"
              className="sticky top-16 z-20 -mx-6 mt-10 border-y border-border bg-background/90 px-6 backdrop-blur-md lg:mx-0 lg:px-0"
            >
              <ul className="flex gap-6 overflow-x-auto py-3 [scrollbar-width:none]">
                {gacSchools.map((s, i) => (
                  <li key={s.id} className="shrink-0">
                    <a
                      href={`#${s.id}`}
                      className="flex items-baseline gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <span className="meta-label text-muted-foreground">{pad(i + 1)}</span>
                      {s.name.replace(/ Primary School$/, "")}
                      <span className="text-muted-foreground">
                        &middot; {s.county.replace(/ County$/, "")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-4">
              {gacSchools.map((school, i) => (
                <SchoolStory
                  key={school.id}
                  school={school}
                  index={i}
                  onOpen={(photos, index) => setViewer({ photos, index: Math.max(index, 0) })}
                />
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              More schools across Kenya are joining the programme. Check back for updates.
            </p>
          </div>
        </section>

        {/* Get involved */}
        <section
          aria-labelledby="gac-involved"
          className="bg-primary py-20 text-primary-foreground lg:py-28"
        >
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
            <Reveal>
              <SectionRule index="04" label="Get involved" tone="primary" />
              <h2 id="gac-involved" className="type-section mt-8">
                Help grow the next classroom.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-primary-foreground/90">
                Donate towards the Grow A Classroom initiative, or partner with AAK to take it to
                more schools across all 47 counties.
              </p>
              <a
                href="mailto:advocacy@aak.or.ke?subject=Grow%20A%20Classroom%20partnership"
                className="group link-quiet mt-8"
              >
                Partner with us: advocacy@aak.or.ke
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
            <Reveal delay={100} className="lg:self-end">
              <div className="shadow-2xl">
                <DonateCard />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />

      <Lightbox
        open={viewer !== null}
        onOpenChange={(open) => {
          if (!open) setViewer(null);
        }}
        onNavigate={(direction) =>
          setViewer((v) =>
            v ? { ...v, index: (v.index + direction + v.photos.length) % v.photos.length } : v,
          )
        }
        title={current?.alt ?? "Photo"}
      >
        {current && viewer ? (
          <figure>
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[75vh] w-full bg-ink-deep object-contain"
            />
            <figcaption className="flex items-baseline justify-between gap-4 px-5 py-4 text-sm text-muted-foreground">
              <span>{current.alt}</span>
              <span className="meta-label shrink-0">
                {viewer.index + 1} / {viewer.photos.length}
              </span>
            </figcaption>
          </figure>
        ) : null}
      </Lightbox>
    </>
  );
}
