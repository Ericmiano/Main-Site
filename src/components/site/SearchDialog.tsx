import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command as CommandPrimitive } from "cmdk";
import { IconClock as Clock, IconSearch as Search } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ResultBody } from "@/components/site/search-results";
import {
  categoryLabel,
  searchCategories,
  searchIndex,
  type SearchEntry,
} from "@/data/search-index";
import { getEventDisplayStatus, getSortedEvents } from "@/data/site";
import { readRecent, rememberSearch, siteSearch, splitHref } from "@/lib/site-search";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Filter = "All" | SearchEntry["category"];

/** Up to this many results in the dialog; the search page shows them all. */
const SHOWN = 30;

/**
 * Site search (Ctrl/⌘ K or "/"). Results are ranked across everything by how
 * well they match (see lib/search), with typo tolerance and AAK's acronyms;
 * chips narrow them to one kind. With nothing typed it offers quick links,
 * upcoming events and the visitor's recent searches.
 */
export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (open) setRecent(readRecent());
    else {
      setQuery("");
      setFilter("All");
    }
  }, [open]);

  const hits = useMemo(() => (query.trim() ? siteSearch.search(query, 200) : []), [query]);
  const counts = useMemo(() => {
    const c = new Map<SearchEntry["category"], number>();
    for (const h of hits) c.set(h.entry.category, (c.get(h.entry.category) ?? 0) + 1);
    return c;
  }, [hits]);
  const shown = useMemo(
    () =>
      (filter === "All" ? hits : hits.filter((h) => h.entry.category === filter)).slice(0, SHOWN),
    [hits, filter],
  );
  const total = filter === "All" ? hits.length : (counts.get(filter) ?? 0);

  // Nothing typed: quick links and what's coming up.
  const suggestions = useMemo(
    () => ({
      quick: searchIndex.filter((e) => e.category === "Quick link"),
      upcoming: getSortedEvents()
        .filter((event) => getEventDisplayStatus(event) !== "past")
        .slice(0, 4)
        .map((event) => searchIndex.find((e) => e.href === `/events/${event.slug}`))
        .filter((e): e is SearchEntry => Boolean(e)),
    }),
    [],
  );

  function go(entry: SearchEntry) {
    rememberSearch(query);
    onOpenChange(false);
    if (entry.external) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
      return;
    }
    const { to, hash } = splitHref(entry.href);
    void navigate({ to, ...(hash ? { hash } : {}) });
  }

  function seeAll() {
    rememberSearch(query);
    onOpenChange(false);
    void navigate({ to: "/search", search: { q: query.trim() } });
  }

  const item = (entry: SearchEntry, key: string, terms?: string[], excerpt?: string) => (
    <CommandItem key={key} value={key} onSelect={() => go(entry)} className="items-start gap-3">
      <ResultBody entry={entry} terms={terms} excerpt={excerpt} />
    </CommandItem>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Search the AAK website</DialogTitle>
        <DialogDescription className="sr-only">
          Search pages, events, documents, people, FAQs and more. Use the arrow keys to move through
          the results and Enter to open one.
        </DialogDescription>
        <Command
          shouldFilter={false}
          loop
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-2.5"
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <CommandPrimitive.Input
              value={query}
              onValueChange={(v) => {
                setQuery(v);
                setFilter("All");
              }}
              onKeyDown={(e) => {
                // Ctrl/⌘ Enter: all results on the search page.
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && query.trim()) {
                  e.preventDefault();
                  seeAll();
                }
              }}
              placeholder="Search events, documents, people, fees, FAQs…"
              aria-label="Search the AAK website"
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>

          {hits.length ? (
            <div
              role="group"
              aria-label="Filter results"
              className="flex gap-1.5 overflow-x-auto border-b border-border px-3 py-2 [scrollbar-width:none]"
            >
              {(["All", ...searchCategories.filter((c) => counts.has(c))] as Filter[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={filter === c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                    filter === c
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {c === "All" ? "All" : categoryLabel[c]}{" "}
                  <span className="opacity-60">{c === "All" ? hits.length : counts.get(c)}</span>
                </button>
              ))}
            </div>
          ) : null}

          <CommandList className="max-h-[min(60vh,32rem)]">
            {query.trim() ? (
              <>
                <CommandEmpty>
                  No results for &ldquo;{query.trim()}&rdquo;. Try fewer words, or another spelling.
                </CommandEmpty>
                {shown.length ? (
                  <CommandGroup
                    heading={`${total} result${total === 1 ? "" : "s"}${filter === "All" ? "" : ` in ${categoryLabel[filter]}`}`}
                  >
                    {shown.map((h) =>
                      item(
                        h.entry,
                        `${h.entry.category}|${h.entry.title}|${h.entry.href}`,
                        h.terms,
                        h.excerpt,
                      ),
                    )}
                  </CommandGroup>
                ) : null}
                {hits.length ? (
                  <CommandGroup>
                    <CommandItem
                      value="__see-all"
                      onSelect={seeAll}
                      className="justify-center text-sm font-semibold text-primary"
                    >
                      See all {hits.length} results on the search page
                    </CommandItem>
                  </CommandGroup>
                ) : null}
              </>
            ) : (
              <>
                {recent.length ? (
                  <CommandGroup heading="Recent searches">
                    {recent.map((r) => (
                      <CommandItem
                        key={r}
                        value={`__recent|${r}`}
                        onSelect={() => setQuery(r)}
                        className="gap-3"
                      >
                        <Clock
                          className="h-4 w-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="text-foreground">{r}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}
                <CommandGroup heading="Quick links">
                  {suggestions.quick.map((e) => item(e, `quick|${e.title}`))}
                </CommandGroup>
                {suggestions.upcoming.length ? (
                  <CommandGroup heading="Coming up">
                    {suggestions.upcoming.map((e) => item(e, `event|${e.href}`))}
                  </CommandGroup>
                ) : null}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
