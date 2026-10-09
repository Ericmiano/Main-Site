import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconArrowUpRight as ArrowUpRight,
  IconAward as Award,
  IconBrandYoutube as Youtube,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { YouTubeEmbed } from "@/components/site/YouTubeEmbed";
import { ArchitecturalDrawing } from "@/components/site/ArchitecturalDrawing";
import { collegeOfFellows } from "@/data/site";
import {
  fellowsIntro,
  fellowsRoles,
  MEET_THE_FELLOWS_PLAYLIST,
  meetTheFellowsIntro,
  meetTheFellowsVideos,
} from "@/data/fellows";
import { jsonLd } from "@/lib/json-ld";

const SITE_URL = "https://aak.or.ke";
const TITLE = "College of Fellows | Architectural Association of Kenya";
const DESCRIPTION =
  "The College of Fellows, AAK's senior membership category: its roles, the Meet the Fellows video series and the Fellows of 2026.";
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${MEET_THE_FELLOWS_PLAYLIST}`;

export const Route = createFileRoute("/college-of-fellows")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/college-of-fellows` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/college-of-fellows` }],
  }),
  component: CollegeOfFellowsPage,
});

const fellows = [...collegeOfFellows].sort((a, b) => a.localeCompare(b));
const [featured, ...moreVideos] = meetTheFellowsVideos;

function CollegeOfFellowsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Membership",
                item: `${SITE_URL}/membership`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "College of Fellows",
                item: `${SITE_URL}/college-of-fellows`,
              },
            ],
          }),
        }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb
              trail={[
                { label: "Membership", href: "/membership" },
                { label: "College of Fellows" },
              ]}
            />
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <Reveal className="max-w-2xl">
                <p className="meta-label text-primary">The senior membership category</p>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                  College of Fellows
                </h1>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {fellowsIntro}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <dl className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <dt className="meta-label text-muted-foreground">Fellows, 2026</dt>
                    <dd className="mt-2 font-display text-4xl font-semibold text-foreground">
                      {fellows.length}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <dt className="meta-label text-muted-foreground">Meet the Fellows</dt>
                    <dd className="mt-2 font-display text-4xl font-semibold text-foreground">
                      {meetTheFellowsVideos.length}
                      <span className="ml-2 text-base font-normal text-muted-foreground">
                        films
                      </span>
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        <section aria-labelledby="roles-title" className="relative overflow-hidden py-16 lg:py-24">
          <ArchitecturalDrawing
            intro
            variant="section"
            className="pointer-events-none absolute top-10 right-12 hidden w-[24rem] text-foreground/20 xl:block"
          />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="What Fellows do"
              title={<span id="roles-title">Roles of the College</span>}
            />
            <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {fellowsRoles.map((role, i) => (
                <li key={role.title}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="flex h-full flex-col rounded-2xl border border-border p-6">
                      <span className="font-display text-3xl font-semibold tabular-nums text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-foreground">
                        {role.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {role.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="meet-title"
          className="border-y border-border bg-ink-deep py-16 text-background lg:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="meta-label text-background/70">Video series</p>
                <h2
                  id="meet-title"
                  className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  Meet the Fellows
                </h2>
                <p className="mt-4 text-base leading-relaxed text-background/75">
                  {meetTheFellowsIntro}
                </p>
              </div>
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-background hover:text-background/80"
              >
                <Youtube className="h-5 w-5" aria-hidden="true" />
                Watch the series on YouTube
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {featured ? (
              <Reveal className="mt-10">
                <YouTubeEmbed
                  src={`https://www.youtube-nocookie.com/embed/${featured.id}`}
                  title={`Meet the Fellows: ${featured.name}`}
                  className="aspect-video w-full overflow-hidden rounded-2xl"
                />
              </Reveal>
            ) : null}

            <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {moreVideos.map((video, i) => (
                <li key={video.id}>
                  <Reveal delay={(i % 3) * 60}>
                    <YouTubeEmbed
                      src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                      title={video.name}
                      className="aspect-video w-full overflow-hidden rounded-xl"
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="fellows-list-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionHeading
              eyebrow="Honour · Service"
              title={<span id="fellows-list-title">Fellows of the College, 2026</span>}
              action={
                <span className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                  <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                  {fellows.length} Fellows
                </span>
              }
            />
            <Reveal delay={100}>
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3 lg:grid-cols-5">
                {fellows.map((name) => (
                  <li key={name} className="border-b border-border py-1.5 text-foreground">
                    {name}
                  </li>
                ))}
              </ul>
            </Reveal>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Fellowship isn&rsquo;t applied for: Corporate Members are nominated by the Governing
              Council and invited by the College.{" "}
              <Link to="/membership" className="link-underline font-medium text-foreground">
                See all membership categories
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
