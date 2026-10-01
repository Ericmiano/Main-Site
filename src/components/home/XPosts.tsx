import { useEffect, useRef, useState } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { X_POSTS, xPostUrl, type XPost } from "@/lib/social-feeds";

interface TwitterWidgets {
  widgets: {
    createTweet: (
      id: string,
      el: HTMLElement,
      options?: object,
    ) => Promise<HTMLElement | undefined>;
  };
}
declare global {
  interface Window {
    twttr?: TwitterWidgets;
  }
}

let widgetsScript: Promise<TwitterWidgets> | undefined;

/** X's embed script, added once and only when the posts are about to show. */
function loadWidgets() {
  widgetsScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://platform.x.com/widgets.js";
    script.async = true;
    script.onload = () => (window.twttr ? resolve(window.twttr) : reject(new Error("no twttr")));
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return widgetsScript;
}

/** One post: X's embed once it has loaded, the post's text and link until then. */
function Post({ post, load }: { post: XPost; load: boolean }) {
  const slot = useRef<HTMLDivElement>(null);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    const node = slot.current;
    if (!load || !node) return;
    let cancelled = false;
    loadWidgets()
      .then((twttr) =>
        twttr.widgets.createTweet(post.id, node, {
          dnt: true,
          conversation: "none",
          mediaMaxWidth: 560,
          align: "center",
        }),
      )
      .then((el) => {
        if (!cancelled && el) setEmbedded(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      node.replaceChildren();
    };
  }, [load, post.id]);

  return (
    <li className="min-w-0">
      <div ref={slot} className="[&_.twitter-tweet]:!my-0" />
      {embedded ? null : (
        <a
          href={xPostUrl(post.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-border bg-background p-5 transition-colors hover:border-foreground/40"
        >
          <span className="meta-label text-muted-foreground">@Arch_KE &middot; {post.date}</span>
          <span className="mt-3 block text-sm leading-relaxed text-foreground">{post.text}</span>
          {post.images.length ? (
            <span
              className={`mt-4 grid gap-1 overflow-hidden rounded-xl ${post.images.length > 1 ? "grid-cols-2" : ""}`}
            >
              {post.images.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  decoding="async"
                  className={`w-full bg-secondary object-cover ${post.images.length > 1 ? "aspect-3/4" : ""}`}
                />
              ))}
            </span>
          ) : null}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
            View on X
            <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
        </a>
      )}
    </li>
  );
}

/** AAK's chosen recent X posts (see X_POSTS), embedded once `load` is set. */
export function XPosts({ load, href }: { load: boolean; href?: string | undefined }) {
  return (
    <figure className="mt-12 lg:mt-16">
      <figcaption className="flex items-center justify-between gap-4 border-t border-border pt-5 text-sm">
        <span className="meta-label text-muted-foreground">X &middot; recent posts</span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary"
          >
            Follow on X
            <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
          </a>
        ) : null}
      </figcaption>
      <ul className="mt-6 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
        {X_POSTS.map((post) => (
          <Post key={post.id} post={post} load={load} />
        ))}
      </ul>
    </figure>
  );
}
