import { useEffect, useState, type ComponentType } from "react";
import {
  IconArmchair,
  IconBuildingArch,
  IconBuildingCommunity,
  IconCalculator,
  IconCrane,
  IconHelmet,
  IconLeaf,
  IconMap2,
  IconTrees,
} from "@tabler/icons-react";
import { CountUp } from "@/components/site/CountUp";
import { chapters } from "@/data/site";
import type { MemberStats as Stats, MemberStatsSource } from "@/lib/member-stats";
import { cn } from "@/lib/utils";

const REFRESH_MS = 5 * 60_000;

type Icon = ComponentType<{ className?: string; stroke?: number; "aria-hidden"?: boolean }>;

// Matched on a keyword so small naming differences in the feed still resolve.
const ICONS: [string, Icon][] = [
  ["landscape", IconTrees],
  ["architect", IconBuildingArch],
  ["quantity", IconCalculator],
  ["planner", IconMap2],
  ["engineer", IconHelmet],
  ["environment", IconLeaf],
  ["project", IconCrane],
  ["interior", IconArmchair],
];
const iconFor = (name: string): Icon =>
  ICONS.find(([k]) => name.toLowerCase().includes(k))?.[1] ?? IconBuildingCommunity;

// Order the feed's chapters like the rest of the site; unknown names go last.
const order = (name: string) => {
  const i = chapters.findIndex((c) => c.name.toLowerCase() === name.trim().toLowerCase());
  return i === -1 ? chapters.length : i;
};

const fmt = (n: number) => n.toLocaleString("en-GB");

/** "The Register": live member counts from the members portal, laid out
 * like BORAQS's register. Renders nothing until the feed has answered. */
export function MemberStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<(Stats & { source?: MemberStatsSource }) | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/member-stats");
        if (!res.ok) return;
        const data = (await res.json()) as Stats & {
          available?: boolean;
          source?: MemberStatsSource;
        };
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
  const live = stats.source !== "snapshot";
  const updated = new Date(stats.updatedAt).toLocaleString(
    "en-GB",
    live
      ? { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
      : { day: "numeric", month: "long", year: "numeric" },
  );
  const totals = [
    { label: "Registered members", value: stats.totals.members },
    { label: "In good standing", value: stats.totals.inGoodStanding },
    ...(stats.totals.firms !== undefined
      ? [{ label: "Member firms", value: stats.totals.firms }]
      : []),
  ];

  return (
    <section
      aria-labelledby="register-title"
      className={cn("border-y border-border bg-background py-20 lg:py-28", className)}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <header className="text-center">
          <p className="meta-label inline-flex items-center gap-2 text-muted-foreground">
            {live ? (
              <>
                <span
                  aria-hidden="true"
                  className="pulse-dot h-1.5 w-1.5 rounded-full bg-sustain"
                />
                Live from the member register &middot; updated {updated}
              </>
            ) : (
              <>Member register &middot; as of {updated}</>
            )}
          </p>
          <h2
            id="register-title"
            className="mt-5 font-display text-4xl tracking-tight text-foreground sm:text-5xl"
          >
            <span className="font-accent italic font-normal">The</span>{" "}
            <span className="font-semibold">Register</span>
          </h2>
          <span aria-hidden="true" className="mx-auto mt-5 block h-1 w-14 bg-primary" />
        </header>

        <dl className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center divide-x divide-border">
          {totals.map((t) => (
            <div key={t.label} className="flex flex-col-reverse px-6 py-2 text-center sm:px-10">
              <dt className="mt-1 text-sm text-muted-foreground">{t.label}</dt>
              <dd className="font-display text-3xl font-semibold tabular-nums text-foreground sm:text-4xl">
                <CountUp value={t.value} grouped />
              </dd>
            </div>
          ))}
        </dl>

        {rows.length ? (
          <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
            {rows.map((row) => {
              const Icon = iconFor(row.chapter);
              return (
                <li
                  key={row.chapter}
                  className="flex flex-col items-center bg-background px-4 py-10 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-8 w-8" stroke={1.6} aria-hidden />
                  </span>
                  <p className="mt-5 font-display text-4xl font-semibold tabular-nums text-foreground sm:text-5xl">
                    <CountUp value={row.members} grouped />
                  </p>
                  <p className="mt-2 text-base font-medium text-primary">{row.chapter}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {fmt(row.inGoodStanding)} in good standing
                    {row.firms !== undefined ? <> &middot; {fmt(row.firms)} firms</> : null}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : null}

        {stats.byCategory.length ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            By category:{" "}
            {stats.byCategory.map((c, i) => (
              <span key={c.category}>
                {i ? " · " : ""}
                <span className="font-medium text-foreground">{fmt(c.members)}</span> {c.category}
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </section>
  );
}
