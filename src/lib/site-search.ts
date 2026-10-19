import { searchIndex } from "@/data/search-index";
import { createSearch } from "@/lib/search";

/** One search engine over the whole index, built when search first loads. */
export const siteSearch = createSearch(searchIndex);

const RECENT_KEY = "aak-recent-searches";

export function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}

export function rememberSearch(query: string) {
  const q = query.trim();
  if (q.length < 2) return;
  try {
    const next = [q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(
      0,
      5,
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Private browsing: nothing remembered.
  }
}

/** Internal hrefs may carry a section (#…); split them for the router. */
export function splitHref(href: string): { to: string; hash?: string } {
  const i = href.indexOf("#");
  return i === -1 ? { to: href } : { to: href.slice(0, i) || "/", hash: href.slice(i + 1) };
}
