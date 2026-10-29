import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";

interface Latest {
  slug: string;
  title: string;
  date: string;
  categories: { name: string }[];
}

/** A Nairobi calendar day, as yyyy-mm-dd. */
const nairobiDay = (time: number) =>
  new Date(time).toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });

/** Milliseconds from now to the next midnight in Nairobi (UTC+3, no daylight saving). */
const untilNairobiMidnight = (now: number) => {
  const nairobi = now + 3 * 3_600_000;
  return 86_400_000 - (nairobi % 86_400_000);
};

// The latest post, asked for once per page however many chips there are.
let latestRequest: Promise<Latest | undefined> | null = null;
const latestPost = () =>
  (latestRequest ??= fetch("/api/news?per_page=1")
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { posts?: Latest[] } | null) => data?.posts?.[0])
    .catch(() => undefined));

/**
 * "New today" on the homepage: the latest News & insights post, on the day
 * (Nairobi time) it was published. It goes at midnight, even if the page
 * stays open, and comes back with the next new post. Loaded after the page,
 * so the prebuilt page is unchanged; on a site without News & insights
 * (/api/news missing) it never appears.
 *
 * "overlay" sits over the hero photo (tablets and up); "inline" goes under
 * the hero's buttons on phones, where the photo's caption takes that corner.
 */
export function NewPost({ variant }: { variant: "overlay" | "inline" }) {
  const [post, setPost] = useState<Latest | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    void latestPost().then((latest) => {
      const now = Date.now();
      if (cancelled || !latest || nairobiDay(Date.parse(latest.date)) !== nairobiDay(now)) return;
      setPost(latest);
      timer = window.setTimeout(() => setPost(null), untilNairobiMidnight(now));
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!post) return null;
  const kind = post.categories[0]?.name;
  return (
    <Link
      to="/news/$slug"
      params={{ slug: post.slug }}
      className={
        "group items-center gap-3 rounded-full bg-background/95 py-2 pr-4 pl-2 text-sm text-foreground shadow-lg ring-1 ring-black/5 backdrop-blur transition-colors hover:bg-background " +
        (variant === "overlay"
          ? "absolute top-6 left-6 z-20 hidden max-w-md sm:flex lg:left-12"
          : "mt-6 flex max-w-full sm:hidden")
      }
    >
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-primary-foreground uppercase">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground/80 motion-reduce:hidden" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-foreground" />
        </span>
        New today
      </span>
      <span className="min-w-0 truncate">
        {kind ? <span className="text-muted-foreground">{kind}: </span> : null}
        <span className="font-semibold">{post.title}</span>
      </span>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
