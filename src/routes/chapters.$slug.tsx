import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { getChapter } from "@/data/site";
import { chapterCouncils, chapterBranches } from "@/data/chapter-councils";

const SITE_URL = "https://aak.or.ke";

export const Route = createFileRoute("/chapters/$slug")({
  loader: ({ params }) => {
    const chapter = getChapter(params.slug);
    if (!chapter) throw notFound();
    return chapter;
  },
  head: ({ params }) => {
    const chapter = getChapter(params.slug);
    if (!chapter) {
      return { meta: [{ title: "Chapter not found | Architectural Association of Kenya" }] };
    }
    const title = `${chapter.name} Chapter | Architectural Association of Kenya`;
    return {
      meta: [
        { title },
        { name: "description", content: chapter.definition },
        { property: "og:title", content: title },
        { property: "og:description", content: chapter.definition },
        { property: "og:type", content: "website" },
        { property: "og:image", content: chapter.image },
        { property: "og:url", content: `${SITE_URL}/chapters/${chapter.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/chapters/${chapter.slug}` }],
    };
  },
  component: ChapterDetail,
  notFoundComponent: ChapterNotFound,
});

function ChapterDetail() {
  const chapter = Route.useLoaderData();
  const council = chapterCouncils[chapter.slug] ?? [];
  const branches = chapterBranches[chapter.slug] ?? [];

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
                    name: `${chapter.name} Chapter`,
                    item: `${SITE_URL}/chapters/${chapter.slug}`,
                  },
                ],
              },
              {
                "@type": "Organization",
                name: `AAK ${chapter.name} Chapter`,
                description: chapter.definition,
                parentOrganization: { "@id": `${SITE_URL}/#organization` },
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
              trail={[{ label: "Chapters", href: "/#chapters" }, { label: chapter.name }]}
            />
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-[1fr_1.1fr] lg:px-12">
            <Reveal>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                AAK Chapter
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                {chapter.name}
              </h1>
              <p className="mt-5 max-w-xl font-accent text-lg italic leading-relaxed text-muted-foreground">
                {chapter.tagline}
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                {chapter.definition}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <figure className="overflow-hidden rounded-2xl bg-secondary">
                <img
                  src={chapter.image}
                  alt={`${chapter.name} chapter of the Architectural Association of Kenya`}
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover"
                />
              </figure>
            </Reveal>
          </div>
        </section>

        {council.length ? (
          <section
            aria-labelledby="chapter-council-title"
            className="border-t border-border bg-secondary/40 py-14 lg:py-20"
          >
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
              <h2
                id="chapter-council-title"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                Chapter council, 2025/2027
              </h2>
              <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {council.map((member) => (
                  <li key={`${member.name}-${member.role}`} className="rounded-xl bg-card p-5">
                    <p className="font-display text-base font-semibold text-foreground">
                      {member.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {branches.length ? (
          <section
            aria-labelledby="chapter-branches-title"
            className="border-t border-border py-14 lg:py-20"
          >
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
              <h2
                id="chapter-branches-title"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                Regional branches
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
                {branches.map((branch) => (
                  <div key={branch.name}>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {branch.name}
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {branch.members.map((member) => (
                        <li
                          key={`${member.name}-${member.role}`}
                          className="rounded-xl bg-card p-4"
                        >
                          <p className="font-display text-sm font-semibold text-foreground">
                            {member.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{member.role}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <div className="border-t border-border bg-secondary/40 py-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {chapter.footerTagline}
          </span>
        </div>

        <section className="py-16 text-center lg:py-20">
          <div className="mx-auto max-w-xl px-6 lg:px-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Join the {chapter.name} Chapter
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Membership gives you standing, CPD access and a voice within your chapter.
            </p>
            <Link
              to="/membership"
              className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              How to join
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ChapterNotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[50vh] items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Chapter not found</h1>
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
