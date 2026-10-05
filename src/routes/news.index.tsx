import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IconNews as Newspaper } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { NewsCard, NewsCardSkeleton } from "@/components/news/NewsCard";
import { fetchNewsList, type NewsCategory, type NewsPost } from "@/lib/news";
import { jsonLd } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

const SITE_URL = "https://aak.or.ke";
const TITLE = "News & insights | Architectural Association of Kenya";
const DESCRIPTION =
  "Blogs, articles and opinion from the Architectural Association of Kenya and its members on Kenya's built and natural environment.";
const PER_PAGE = 12;

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/news` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/news` }],
  }),
  component: NewsIndex,
});

type Status = "loading" | "ready" | "more" | "unavailable";

function NewsIndex() {
  const [category, setCategory] = useState("");
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<Status>("loading");

  async function load(nextCategory: string, nextPage: number) {
    setStatus(nextPage === 1 ? "loading" : "more");
    const res = await fetchNewsList(nextPage, nextCategory, PER_PAGE);
    if (res.state !== "ready") {
      setStatus("unavailable");
      return;
    }
    setPosts((prev) => (nextPage === 1 ? res.data.posts : [...prev, ...res.data.posts]));
    setCategories(res.data.categories);
    setTotalPages(res.data.totalPages);
    setPage(nextPage);
    setStatus("ready");
  }

  // The chosen category lives in the address (?category=op-ed) so it can be shared.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("category") ?? "";
    setCategory(initial);
    void load(initial, 1);
  }, []);

  function choose(next: string) {
    if (next === category) return;
    setCategory(next);
    const url = next ? `?category=${encodeURIComponent(next)}` : window.location.pathname;
    window.history.replaceState(null, "", url);
    void load(next, 1);
  }

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
                name: "News & insights",
                item: `${SITE_URL}/news`,
              },
            ],
          }),
        }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "News & insights" }]} />
            <Reveal className="mt-8 max-w-3xl">
              <div className="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
                <Newspaper className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Blogs, articles &amp; opinion</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                News &amp; insights
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="news-list-title" className="py-12 lg:py-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="news-list-title" className="sr-only">
              Latest posts
            </h2>
            {categories.length > 0 ? (
              <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
                {[{ name: "All", slug: "" }, ...categories].map((c) => (
                  <button
                    key={c.slug || "all"}
                    type="button"
                    aria-pressed={category === c.slug}
                    onClick={() => choose(c.slug)}
                    className={cn(
                      "meta-label rounded-full border px-4 py-2 transition-colors",
                      category === c.slug
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ) : null}

            <div aria-live="polite" aria-busy={status === "loading"}>
              {status === "loading" ? (
                <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <li key={i}>
                      <NewsCardSkeleton />
                    </li>
                  ))}
                </ul>
              ) : status === "unavailable" && posts.length === 0 ? (
                <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground">
                  News &amp; insights can&rsquo;t be loaded right now. Please try again shortly.
                </p>
              ) : posts.length === 0 ? (
                <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {category
                    ? "Nothing in this category yet."
                    : "The first posts are on their way. Check back soon."}
                </p>
              ) : (
                <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <NewsCard post={post} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {posts.length > 0 && page < totalPages ? (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => void load(category, page + 1)}
                  disabled={status === "more"}
                  className="btn-primary"
                >
                  {status === "more" ? "Loading…" : "Show more"}
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
