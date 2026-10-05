import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconArrowLeft as ArrowLeft,
  IconBrandFacebook as Facebook,
  IconBrandLinkedin as Linkedin,
  IconBrandWhatsapp as Whatsapp,
  IconBrandX as BrandX,
  IconCheck as Check,
  IconLink as LinkIcon,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { NewsCard } from "@/components/news/NewsCard";
import {
  fetchNewsList,
  fetchNewsPost,
  formatNewsDate,
  NEWS_ARTICLE_SHELL,
  type Loaded,
  type NewsPost,
} from "@/lib/news";

const SITE_URL = "https://aak.or.ke";
const SUFFIX = " | Architectural Association of Kenya";

/**
 * One article. On cPanel every /news/<slug> address is served from the same
 * prerendered page (news/__article__, via api/news-page.php, which also puts
 * the post's own title and sharing tags in the HTML), so the post is loaded
 * in the browser: by the loader, or by the component where the page was
 * server-rendered without it.
 */
export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) =>
    typeof window === "undefined" || params.slug === NEWS_ARTICLE_SHELL
      ? null
      : fetchNewsPost(params.slug),
  head: ({ loaderData, params }) => {
    const post = loaderData?.state === "ready" ? loaderData.data : null;
    const url = `${SITE_URL}/news/${params.slug}`;
    if (!post) return { meta: [{ title: `News & insights${SUFFIX}` }] };
    return {
      meta: [
        { title: post.title + SUFFIX },
        { name: "description", content: post.excerpt || post.title },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt || post.title },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(post.image ? [{ property: "og:image", content: post.image.src }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  // While the article loads in the browser, show exactly what the prerendered
  // page shows, so React can take over that HTML without redrawing it.
  pendingComponent: ArticleLoading,
  pendingMs: 0,
  component: ArticlePage,
});

function ArticleLoading() {
  return (
    <>
      <Header />
      <main>
        <ArticleSkeleton />
      </main>
      <Footer />
    </>
  );
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const loaded = Route.useLoaderData();
  const [fallback, setFallback] = useState<Loaded<NewsPost> | null>(null);

  // Server-rendered without the post (the Workers build, or the shared page):
  // fetch it here instead.
  useEffect(() => {
    setFallback(null);
    if (loaded || slug === NEWS_ARTICLE_SHELL) return;
    let cancelled = false;
    void fetchNewsPost(slug).then((res) => {
      if (!cancelled) setFallback(res);
    });
    return () => {
      cancelled = true;
    };
  }, [loaded, slug]);

  const result = loaded ?? fallback;
  if (!result) return <ArticleLoading />;

  return (
    <>
      <Header />
      <main>
        {result.state === "ready" ? (
          <Article post={result.data} />
        ) : (
          <section className="py-20 lg:py-28">
            <div className="mx-auto max-w-3xl px-6">
              <PageBreadcrumb trail={[{ label: "News & insights", href: "/news" }]} />
              <h1 className="mt-8 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                {result.state === "not_found"
                  ? "This article isn’t available"
                  : "This article can’t be loaded right now"}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {result.state === "not_found"
                  ? "It may have been moved or unpublished."
                  : "Please try again shortly."}
              </p>
              <Link to="/news" className="btn-primary mt-8">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                All news &amp; insights
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function ArticleSkeleton() {
  return (
    <section className="py-14 lg:py-20" aria-busy="true" aria-label="Loading article">
      <div className="mx-auto max-w-3xl space-y-5 px-6">
        <div className="h-3 w-40 animate-pulse rounded bg-secondary" />
        <div className="h-10 w-full animate-pulse rounded bg-secondary" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-secondary" />
        <div className="mt-8 aspect-[16/9] animate-pulse rounded-2xl bg-secondary" />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-secondary" />
        ))}
      </div>
    </section>
  );
}

function Article({ post }: { post: NewsPost }) {
  const category = post.categories[0];
  const url = `${SITE_URL}/news/${post.slug}`;
  return (
    <>
      <article>
        <header className="border-b border-border bg-secondary/40 py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-6">
            <PageBreadcrumb trail={[{ label: "News & insights", href: "/news" }]} />
            <p className="meta-label mt-8 flex flex-wrap items-center gap-x-2 text-muted-foreground">
              {post.categories.length > 0 ? (
                // One flex item, so the gap doesn't fall before each comma.
                <span>
                  {post.categories.map((c, i) => (
                    <span key={c.slug}>
                      {i > 0 ? ", " : null}
                      <Link
                        to="/news"
                        search={{ category: c.slug } as never}
                        className="text-primary hover:underline"
                      >
                        {c.name}
                      </Link>
                    </span>
                  ))}
                </span>
              ) : null}
              {category ? <span aria-hidden="true">&middot;</span> : null}
              <time dateTime={post.date}>{formatNewsDate(post.date)}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readingMinutes} min read</span>
            </p>
            <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            {post.author ? (
              <p className="mt-5 text-sm text-muted-foreground">
                By <span className="font-semibold text-foreground">{post.author}</span>
              </p>
            ) : null}
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
          {post.image ? (
            <img
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width || undefined}
              height={post.image.height || undefined}
              decoding="async"
              className="mb-10 w-full rounded-2xl bg-secondary object-cover"
            />
          ) : null}
          {/* Cleaned by the server (api/news-lib.php): structure only, no scripts or styling. */}
          <div className="article-prose" dangerouslySetInnerHTML={{ __html: post.content ?? "" }} />
          <ShareLinks url={url} title={post.title} />
        </div>
      </article>
      <MoreNews currentSlug={post.slug} />
    </>
  );
}

function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    {
      label: "X",
      icon: BrandX,
      href: `https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    { label: "WhatsApp", icon: Whatsapp, href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
  ];
  return (
    <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-border pt-8">
      <span className="meta-label mr-1 text-muted-foreground">Share</span>
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/40 hover:text-primary"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
        ) : (
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}

function MoreNews({ currentSlug }: { currentSlug: string }) {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  useEffect(() => {
    let cancelled = false;
    void fetchNewsList(1, "", 4).then((res) => {
      if (!cancelled && res.state === "ready") {
        setPosts(res.data.posts.filter((p) => p.slug !== currentSlug).slice(0, 3));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [currentSlug]);

  if (posts.length === 0) return null;
  return (
    <section
      aria-labelledby="more-news-title"
      className="border-t border-border bg-secondary/40 py-14 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="more-news-title"
            className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
          >
            More news &amp; insights
          </h2>
          <Link to="/news" className="link-quiet text-sm font-semibold text-foreground">
            All posts
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <NewsCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
