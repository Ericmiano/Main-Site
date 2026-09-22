import { useMemo, useState } from "react";
import { IconChevronDown as ChevronDown, IconSearch as Search } from "@tabler/icons-react";
import { arbitrators, arbitratorChapters } from "@/data/arbitrators";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export function ArbitratorDirectory() {
  const [activeChapter, setActiveChapter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // A search should look across the whole panel, not just the chapter chip
    // currently selected — the chapter filter only applies when there's no query.
    if (q) {
      return arbitrators.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.organization.toLowerCase().includes(q) ||
          a.chapter.toLowerCase().includes(q) ||
          a.expertise.some((skill) => skill.toLowerCase().includes(q)),
      );
    }
    return activeChapter === "All"
      ? arbitrators
      : arbitrators.filter((a) => a.chapter === activeChapter);
  }, [activeChapter, query]);

  const visible = filtered.slice(0, visibleCount);
  const active = openIndex !== null ? filtered[openIndex] : undefined;

  const navigate = (direction: -1 | 1) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + filtered.length) % filtered.length;
    });
  };

  const setFilter = (chapter: string) => {
    setActiveChapter(chapter);
    setOpenIndex(null);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by chapter">
          {["All", ...arbitratorChapters].map((chapter) => (
            <button
              key={chapter}
              type="button"
              onClick={() => setFilter(chapter)}
              aria-pressed={activeChapter === chapter}
              className={cn(
                "rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.06em] transition-colors",
                activeChapter === chapter
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {chapter === "All" ? "All chapters" : chapter.replace(" Chapter", "")}
            </button>
          ))}
        </div>

        <label className="relative block w-full sm:w-64">
          <span className="sr-only">Search arbitrators by name or expertise</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveChapter("All");
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search all arbitrators"
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} arbitrator{filtered.length === 1 ? "" : "s"} · Source:{" "}
        <a href="mailto:aak@aak.or.ke" className="link-underline">
          AAK arbitrator profiles, 2026
        </a>
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No arbitrators match that search.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
          {visible.map((arbitrator, i) => (
            <li key={arbitrator.slug}>
              <Reveal delay={(i % PAGE_SIZE) * 40}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group flex w-full flex-col gap-2 px-5 py-4 text-left transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {arbitrator.photo ? (
                      <img
                        src={arbitrator.photo}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-muted-foreground"
                        aria-hidden="true"
                      >
                        {arbitrator.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                        {arbitrator.name}
                      </h3>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {arbitrator.position} · {arbitrator.organization}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:justify-end">
                    <span className="font-semibold uppercase tracking-[0.06em] text-primary">
                      {arbitrator.chapter.replace(" Chapter", "")}
                    </span>
                    <span>{arbitrator.expertise.join(" · ")}</span>
                    <span className="whitespace-nowrap">{arbitrator.yearsOfPractice}</span>
                  </div>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      {visibleCount < filtered.length || visibleCount > PAGE_SIZE ? (
        <div className="mt-6 flex flex-wrap items-center gap-5">
          {visibleCount < filtered.length ? (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              Show more ({filtered.length - visibleCount} remaining)
              <ChevronDown className="h-4 w-4 text-primary" />
            </button>
          ) : null}
          {visibleCount > PAGE_SIZE ? (
            <button
              type="button"
              onClick={() => setVisibleCount(PAGE_SIZE)}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Show less
              <ChevronDown className="h-4 w-4 rotate-180 text-primary" />
            </button>
          ) : null}
        </div>
      ) : null}

      <Lightbox
        open={active !== undefined}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null);
        }}
        onNavigate={navigate}
        title={active?.name ?? "Arbitrator profile"}
        className="max-w-2xl"
      >
        {active ? (
          <div className="px-6 py-8 sm:px-10">
            <div className="flex items-center gap-4">
              {active.photo ? (
                <img
                  src={active.photo}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : null}
              <div className="min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                  {active.chapter}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  {active.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {active.position} · {active.organization}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {active.expertise.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 border-y border-border py-6 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Registration
                </dt>
                <dd className="mt-1 text-sm text-foreground">{active.registration}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Years of practice
                </dt>
                <dd className="mt-1 text-sm text-foreground">{active.yearsOfPractice}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {active.profile.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                ADR experience &amp; training
              </h4>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {active.adrExperience.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Academic qualifications
              </h4>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {active.academicQualifications.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Professional memberships
              </h4>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {active.memberships.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </Lightbox>
    </div>
  );
}
