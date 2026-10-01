import { useEffect, useRef, useState } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { SectionRule } from "@/components/site/SectionRule";
import { socialLinks } from "@/data/site";
import { YOUTUBE_LATEST_EMBED } from "@/lib/social-feeds";

/**
 * "Latest from AAK": the newest YouTube video and links to AAK's social
 * accounts. The video loads shortly before the section scrolls into view.
 */
export function LatestPosts() {
  const section = useRef<HTMLElement>(null);
  const [load, setLoad] = useState(false);

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

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
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
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {socialLinks
                .filter((l) => l.label !== "YouTube")
                .map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
