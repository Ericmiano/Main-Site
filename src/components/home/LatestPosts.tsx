import { useEffect, useRef, useState } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { SectionRule } from "@/components/site/SectionRule";
import { socialLinks } from "@/data/site";
import {
  INSTAGRAM_PROFILE_EMBED,
  instagramEmbedHeight,
  YOUTUBE_LATEST_EMBED,
} from "@/lib/social-feeds";

/**
 * "Latest from AAK": the newest YouTube video, AAK's latest Instagram posts and
 * links to its other accounts. The embeds load shortly before the section
 * scrolls into view, not with the page.
 */
export function LatestPosts() {
  const section = useRef<HTMLElement>(null);
  const igBox = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [igWidth, setIgWidth] = useState(0);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Instagram's embed doesn't resize itself; size its box from the width.
  useEffect(() => {
    const node = igBox.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setIgWidth(node.clientWidth));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const instagram = socialLinks.find((l) => l.label === "Instagram");
  const youtube = socialLinks.find((l) => l.label === "YouTube");

  return (
    <section
      ref={section}
      id="latest"
      aria-labelledby="latest-title"
      className="border-t border-border bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="max-w-2xl">
          <SectionRule index="07" label="Social" />
          <h2 id="latest-title" className="type-section mt-8 text-foreground">
            Latest from AAK.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            The newest posts and videos from AAK&rsquo;s own accounts, as they&rsquo;re published.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-8">
            <figure>
              <div className="aspect-video overflow-hidden rounded-2xl bg-ink-deep">
                {load ? (
                  <iframe
                    src={YOUTUBE_LATEST_EMBED}
                    title="AAK's latest YouTube videos"
                    loading="lazy"
                    className="h-full w-full border-0"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : null}
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm">
                <span className="meta-label text-muted-foreground">
                  YouTube &middot; latest video
                </span>
                {youtube ? (
                  <a
                    href={youtube.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary"
                  >
                    Subscribe
                    <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
                  </a>
                ) : null}
              </figcaption>
            </figure>

            <div className="rounded-2xl border border-border p-6 sm:p-7">
              <p className="meta-label text-muted-foreground">Also on</p>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {socialLinks
                  .filter((l) => l.label !== "YouTube" && l.label !== "Instagram")
                  .map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
                      >
                        {link.label}
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <figure className="w-full max-w-[560px] justify-self-center lg:justify-self-end">
            <div
              ref={igBox}
              className="overflow-hidden rounded-2xl border border-border bg-white"
              style={{ height: igWidth ? instagramEmbedHeight(igWidth) : 480 }}
            >
              {load && igWidth ? (
                <iframe
                  src={INSTAGRAM_PROFILE_EMBED}
                  title="AAK's latest Instagram posts"
                  loading="lazy"
                  scrolling="no"
                  className="h-full w-full border-0"
                />
              ) : null}
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span className="meta-label text-muted-foreground">
                Instagram &middot; latest posts
              </span>
              {instagram ? (
                <a
                  href={instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary"
                >
                  Follow on Instagram
                  <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
                </a>
              ) : null}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
