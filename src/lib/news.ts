/**
 * News & insights: posts written in AAK's WordPress back office
 * (cms.aak.or.ke), served to the site by /api/news (public/api/news.php on
 * cPanel, which cleans each post's HTML; src/routes/api.news.ts on Workers).
 */

export interface NewsCategory {
  name: string;
  slug: string;
  count?: number;
}

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  /** ISO 8601, UTC */
  date: string;
  modified: string;
  author: string;
  categories: NewsCategory[];
  image: { src: string; width: number; height: number; alt: string } | null;
  readingMinutes: number;
  /** Cleaned article HTML; only present for a single post. */
  content?: string;
}

export interface NewsList {
  posts: NewsPost[];
  total: number;
  totalPages: number;
  categories: NewsCategory[];
}

export type Loaded<T> = { state: "ready"; data: T } | { state: "not_found" | "unavailable" };

export async function fetchNewsList(page: number, category: string, perPage = 12) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (category) params.set("category", category);
  try {
    const res = await fetch(`/api/news?${params.toString()}`);
    if (!res.ok) return { state: "unavailable" } as const;
    return { state: "ready", data: (await res.json()) as NewsList } as const;
  } catch {
    return { state: "unavailable" } as const;
  }
}

/** The post the server already put in the page (api/news-page.php), if it's this one. */
function embeddedPost(slug: string): NewsPost | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById("aak-news-post");
  if (!el?.textContent) return null;
  try {
    const post = JSON.parse(el.textContent) as NewsPost;
    return post.slug === slug ? post : null;
  } catch {
    return null;
  }
}

export async function fetchNewsPost(slug: string): Promise<Loaded<NewsPost>> {
  const embedded = embeddedPost(slug);
  if (embedded) return { state: "ready", data: embedded };
  try {
    const res = await fetch(`/api/news?slug=${encodeURIComponent(slug)}`);
    if (res.status === 404) return { state: "not_found" };
    if (!res.ok) return { state: "unavailable" };
    const data = (await res.json()) as { post?: NewsPost };
    return data.post ? { state: "ready", data: data.post } : { state: "not_found" };
  } catch {
    return { state: "unavailable" };
  }
}

export const formatNewsDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  });

/** The shared article page that every /news/<slug> address is served from. */
export const NEWS_ARTICLE_SHELL = "__article__";
