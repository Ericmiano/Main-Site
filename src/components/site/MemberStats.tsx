import { useEffect, useState } from "react";
import { CountUp } from "@/components/site/CountUp";
import { chapters } from "@/data/site";
import type { MemberStats as Stats } from "@/lib/member-stats";
import { cn } from "@/lib/utils";

const REFRESH_MS = 5 * 60_000;

// Order the feed's chapters like the rest of the site; unknown names go last.
const order = (name: string) => {
  const i = chapters.findIndex((c) => c.name.toLowerCase() === name.trim().toLowerCase());
  return i === -1 ? chapters.length : i;
};

/** "The register": live member counts from the members portal. Renders
 * nothing until the feed is configured and has answered. */
export function MemberStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/member-stats");
        if (!res.ok) return;
        const data = (await res.json()) as Stats & { available?: boolean };
        if (alive && data.available !== false) setStats(data);
      } catch {
        // Keep whatever we last showed.
      }
    };
    void load();
    const timer = window.setInterval(load, REFRESH_MS);
    const onVisible = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!stats) return null;

  const rows = [...stats.byChapter].sort((a, b) => order(a.chapter) - order(b.chapter));
  const updated = new Date(stats.updatedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      aria-labelledby="register-title"
      className={cn("bg-ink-deep py-20 text-background lg:py-24", className)}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-background/15 pt-6">
          <div>
            <p className="meta-label flex items-center gap-2 text-background/60">
              <span aria-hidden="true" className="pulse-dot h-1.5 w-1.5 rounded-full bg-sustain" />
              Live from the member register
            </p>
            <h2
              id="register-title"
              className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              The register
            </h2>
          </div>
          <p className="meta-label text-background/50">Updated {updated}</p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px bg-background/10 lg:grid-cols-4">
          <Figure label="Members" value={stats.totals.members} />
          <Figure label="In good standing" value={stats.totals.inGoodStanding} />
          {stats.totals.firms !== undefined ? (
            <Figure label="Member firms" value={stats.totals.firms} />
          ) : null}
          {stats.byCategory.length ? (
            <div className="bg-ink-deep p-6 lg:p-8">
              <dt className="meta-label text-background/55">By category</dt>
              <dd className="mt-4 space-y-1.5 text-sm">
                {stats.byCategory.map((c) => (
                  <p key={c.category} className="flex justify-between gap-4">
                    <span className="text-background/75">{c.category}</span>
                    <span className="font-semibold tabular-nums">
                      {c.members.toLocaleString("en-GB")}
                    </span>
                  </p>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>

        {rows.length ? (
          <dl className="mt-px grid grid-cols-2 gap-px bg-background/10 sm:grid-cols-4">
            {rows.map((row) => (
              <div key={row.chapter} className="bg-ink-deep p-6">
                <dt className="text-sm text-background/75">{row.chapter}</dt>
                <dd className="mt-2 font-display text-3xl font-semibold tabular-nums">
                  <CountUp value={row.members} grouped />
                </dd>
                <p className="mt-1 text-xs text-background/55">
                  {row.inGoodStanding.toLocaleString("en-GB")} in good standing
                </p>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-ink-deep p-6 lg:p-8">
      <dt className="meta-label text-background/55">{label}</dt>
      <dd className="mt-3 font-display text-4xl font-semibold tabular-nums sm:text-5xl">
        <CountUp value={value} grouped />
      </dd>
    </div>
  );
}
