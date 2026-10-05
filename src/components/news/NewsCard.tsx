import { Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { formatNewsDate, type NewsPost } from "@/lib/news";
import { cn } from "@/lib/utils";

/** A post in a grid: image (or an AAK-red panel), category, title, excerpt, date. */
export function NewsCard({ post, className }: { post: NewsPost; className?: string }) {
  const category = post.categories[0];
  return (
    <Link
      to="/news/$slug"
      params={{ slug: post.slug }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-foreground/30",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {post.image ? (
          <img
            src={post.image.src}
            alt=""
            width={post.image.width || undefined}
            height={post.image.height || undefined}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-end bg-primary p-5" aria-hidden="true">
            <span className="font-display text-3xl font-semibold leading-none text-primary-foreground/90">
              AAK
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="meta-label flex flex-wrap items-center gap-x-2 text-muted-foreground">
          {category ? <span className="text-primary">{category.name}</span> : null}
          {category ? <span aria-hidden="true">&middot;</span> : null}
          <time dateTime={post.date}>{formatNewsDate(post.date)}</time>
        </p>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-balance text-foreground sm:text-xl">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-foreground">
          Read &middot; {post.readingMinutes} min
          <ArrowUpRight
            className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

/** Placeholder card shown while posts load. */
export function NewsCardSkeleton() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border"
      aria-hidden="true"
    >
      <div className="aspect-[16/10] animate-pulse bg-secondary" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-5/6 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-full animate-pulse rounded bg-secondary" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}
