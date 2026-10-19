import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { IconSearch as Search } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { ResultBody } from "@/components/site/search-results";
import {
  categoryLabel,
  searchCategories,
  searchIndex,
  type SearchEntry,
} from "@/data/search-index";
import { rememberSearch, siteSearch, splitHref } from "@/lib/site-search";
import { cn } from "@/lib/utils";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Search | Architectural Association of Kenya";
const DESCRIPTION =
  "Search the AAK website: events, documents and reports, people, membership fees, FAQs, initiatives and photo albums.";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search["q"] === "string" && search["q"] ? { q: search["q"] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      // Results pages shouldn't be indexed themselves.
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/search` }],
  }),
  component: SearchPage,
});

type Filter = "All" | SearchEntry["category"];
const EXAMPLES = [
  "SBE report",
  "membership fees",
  "Fellows",
  "Urban Thinkers Campus",
  "certificate",
];

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  // The page is prebuilt without a query; results appear once it's running,
  // so the first render matches the prebuilt HTML.
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    setReady(true);
    setInput(q);
    // Only when the address changes from outside this page's own typing.
  }, [q]);

  // Keep the address in step with what's typed (shareable, back-button friendly).
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      if (input.trim() !== q) {
        void navigate({ search: input.trim() ? { q: input.trim() } : {}, replace: true });
      }
    }, 300);
    return () => window.clearTimeout(t);
  }, [input, q, ready, navigate]);

  const query = ready ? input : "";
  const hits = useMemo(() => (query.trim() ? siteSearch.search(query, 500) : []), [query]);
  const counts = useMemo(() => {
    const c = new Map<SearchEntry["category"], number>();
    for (const h of hits) c.set(h.entry.category, (c.get(h.entry.category) ?? 0) + 1);
    return c;
  }, [hits]);
  useEffect(() => setFilter("All"), [query]);
  const shown = filter === "All" ? hits : hits.filter((h) => h.entry.category === filter);
  const quick = searchIndex.filter((e) => e.category === "Quick link");

  const result = (entry: SearchEntry, terms?: string[], excerpt?: string) => {
    const className =
      "flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:border-foreground/40 hover:bg-secondary/40";
    const body = <ResultBody entry={entry} terms={terms} excerpt={excerpt} wrap />;
    if (entry.external) {
      return (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => rememberSearch(query)}
          className={className}
        >
          {body}
        </a>
      );
    }
    const { to, hash } = splitHref(entry.href);
    return (
      <Link
        to={to}
        {...(hash ? { hash } : {})}
        onClick={() => rememberSearch(query)}
        className={className}
      >
        {body}
      </Link>
    );
  };

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-12 lg:py-16">
          <div className="mx-auto max-w-[1000px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Search" }]} />
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Search
            </h1>
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-background px-4 focus-within:border-foreground/50"
            >
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search events, documents, people, fees, FAQs…"
                aria-label="Search the AAK website"
                autoFocus
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </form>
            {hits.length ? (
              <div role="group" aria-label="Filter results" className="mt-4 flex flex-wrap gap-1.5">
                {(["All", ...searchCategories.filter((c) => counts.has(c))] as Filter[]).map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={filter === c}
                      onClick={() => setFilter(c)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        filter === c
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                      )}
                    >
                      {c === "All" ? "All" : categoryLabel[c]}{" "}
                      <span className="opacity-60">
                        {c === "All" ? hits.length : counts.get(c)}
                      </span>
                    </button>
                  ),
                )}
              </div>
            ) : null}
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="mx-auto max-w-[1000px] px-6 lg:px-12">
            {query.trim() ? (
              <>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {hits.length
                    ? `${shown.length} result${shown.length === 1 ? "" : "s"} for “${query.trim()}”${filter === "All" ? "" : ` in ${categoryLabel[filter]}`}`
                    : `No results for “${query.trim()}”. Try fewer words or another spelling.`}
                </p>
                <ul className="mt-5 grid gap-3">
                  {shown.map((h) => (
                    <li key={`${h.entry.category}|${h.entry.title}|${h.entry.href}`}>
                      {result(h.entry, h.terms, h.excerpt)}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Try{" "}
                  {EXAMPLES.map((ex, i) => (
                    <span key={ex}>
                      <button
                        type="button"
                        onClick={() => setInput(ex)}
                        className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                      >
                        {ex}
                      </button>
                      {i < EXAMPLES.length - 1 ? ", " : "."}
                    </span>
                  ))}
                </p>
                <h2 className="meta-label mt-10 text-muted-foreground">Quick links</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {quick.map((e) => (
                    <li key={e.title}>{result(e)}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
