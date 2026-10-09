import { useEffect, useState } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { portalLinks } from "@/data/site";

/**
 * The members portal's live events list (its embeddable widget), shown only
 * while the portal has public events: /api/portal-events counts them, and with
 * none (or the count unavailable) nothing renders. Until the count arrives the
 * section holds its place, so the events list below doesn't jump down when it
 * appears (it only moves up in the rarer case of no events).
 */
export function PortalEvents() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portal-events")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { count?: unknown } | null) => {
        if (!cancelled) setCount(typeof data?.count === "number" ? data.count : 0);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count !== null && count < 1) return null;

  return (
    <section
      aria-labelledby="portal-events-title"
      className="border-b border-border py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            <p className="meta-label flex items-center gap-2 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Registration open
            </p>
            <h2
              id="portal-events-title"
              className="mt-4 font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl"
            >
              Register on the member portal
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Events currently taking registrations, live from members.aak.or.ke. Select an event to
              see its details and register.
            </p>
          </div>
          <a
            href={portalLinks.events}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
          >
            Open the portal&rsquo;s events page
            <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
          </a>
        </div>
        {count === null ? (
          <div
            aria-hidden="true"
            className="mt-10 h-[640px] w-full animate-pulse rounded-2xl border border-border bg-secondary/40"
          />
        ) : (
          <iframe
            src={portalLinks.eventsEmbed}
            title="Events open for registration on the AAK member portal"
            loading="lazy"
            className="mt-10 h-[640px] w-full rounded-2xl border border-border bg-background"
          />
        )}
      </div>
    </section>
  );
}
