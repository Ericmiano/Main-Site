import { useCallback, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconArrowUpRight as ArrowUpRight, IconX as X } from "@tabler/icons-react";

import { socialLinks } from "@/data/site";
import { facebookFeedUrl, YOUTUBE_LATEST_EMBED } from "@/lib/social-feeds";
import { cn } from "@/lib/utils";

// Feed addresses live in @/lib/social-feeds (shared with the homepage).
const FEEDS = {
  facebook: {
    label: "Facebook",
    title: "AAK's latest Facebook posts",
    src: (width: number) => facebookFeedUrl(width, 640),
    height: 640,
    note: "Loads from Facebook, which may set cookies.",
  },
  youtube: {
    label: "YouTube",
    title: "AAK's latest YouTube videos",
    src: () => YOUTUBE_LATEST_EMBED,
    height: 0, // 16:9, set by aspect ratio
    note: "Loads from YouTube (privacy-enhanced mode).",
  },
} as const;
type FeedKey = keyof typeof FEEDS;

/**
 * "Latest posts" button and panel. Nothing loads from Facebook or YouTube
 * until the panel is opened (the site sets no third-party cookies before
 * then), and only the selected tab's feed loads.
 */
export function SocialFeed({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FeedKey>("facebook");
  const feed = FEEDS[tab];
  // Width available to the feed, measured once the panel is on screen.
  const [width, setWidth] = useState(0);
  const measure = useCallback((el: HTMLDivElement | null) => {
    if (el) setWidth(Math.round(el.clientWidth));
  }, []);
  const feedWidth = Math.max(180, Math.min(500, width));

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-background/25 px-4 py-2 text-sm font-semibold text-background transition-colors hover:border-background/60 hover:bg-background/10",
          className,
        )}
      >
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        Latest posts
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-[60] flex max-h-[90svh] w-[min(34rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-background shadow-2xl outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <header className="border-b border-border px-5 pt-5 pb-4 pr-14 sm:px-6">
            <DialogPrimitive.Title className="font-display text-xl font-semibold text-foreground">
              Latest from AAK
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
              Recent posts and videos, live from AAK&rsquo;s accounts.
            </DialogPrimitive.Description>
            <div role="tablist" aria-label="Feed" className="mt-4 flex gap-2">
              {(Object.keys(FEEDS) as FeedKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  aria-controls="social-feed-panel"
                  onClick={() => setTab(key)}
                  className={cn(
                    "meta-label rounded-full border px-4 py-2 transition-colors",
                    tab === key
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {FEEDS[key].label}
                </button>
              ))}
            </div>
          </header>

          <div id="social-feed-panel" role="tabpanel" className="overflow-y-auto px-5 py-5 sm:px-6">
            <div ref={measure} />
            {open && width > 0 ? (
              <iframe
                key={tab + feedWidth}
                src={feed.src(feedWidth)}
                title={feed.title}
                loading="lazy"
                className={cn(
                  "w-full rounded-lg border-0 bg-secondary",
                  feed.height ? "" : "aspect-video",
                )}
                style={feed.height ? { height: feed.height } : undefined}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">{feed.note}</p>
          </div>

          <footer className="border-t border-border px-5 py-4 sm:px-6">
            <p className="meta-label text-muted-foreground">Also on</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {socialLinks
                .filter((link) => !["Facebook", "YouTube"].includes(link.label))
                .map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    </a>
                  </li>
                ))}
            </ul>
          </footer>

          <DialogPrimitive.Close
            className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
