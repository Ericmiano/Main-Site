import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  IconArrowUpRight,
  IconBuildingSkyscraper,
  IconUser,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import { registerSnapshot } from "@/data/member-register-snapshot";
import type { MemberStats as Stats, MemberStatsSource } from "@/lib/member-stats";
import { cn } from "@/lib/utils";

const REFRESH_MS = 5 * 60_000;
const DIRECTORY_URL = "https://members.aak.or.ke/directory";

type Icon = ComponentType<{ className?: string; stroke?: number; "aria-hidden"?: boolean }>;
type Data = Stats & { source?: MemberStatsSource };

// Static figures, like BORAQS: the strip is in view from first paint, so a
// count-up would re-render every frame while the page is still loading.
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The member register as a slim band of headline figures, after the
 * BORAQS register strip. With `sticky`, it parks under the header from
 * md up (phones keep it in the flow so it doesn't eat the screen).
 *
 * It renders the baked-in snapshot straight away, so there's no layout
 * jump, then refreshes from /api/member-stats (the portal feed or the
 * host's snapshot file). Hidden only if the endpoint says there's no data.
 */
export function MemberStats({ sticky = false }: { sticky?: boolean }) {
  const [stats, setStats] = useState<Data | null>(
    registerSnapshot ? { ...registerSnapshot, source: "snapshot" } : null,
  );
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/member-stats");
        const data = (await res.json()) as Data & { available?: boolean };
        if (!alive) return;
        if (data.available === false) setStats(null);
        else if (res.ok) setStats(data);
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

  // Tell other sticky elements how much room the strip takes once stuck.
  const shown = stats !== null;
  useEffect(() => {
    const el = ref.current;
    if (!sticky || !el) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      const stuck = getComputedStyle(el).position === "sticky";
      root.style.setProperty("--register-h", `${stuck ? el.offsetHeight : 0}px`);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--register-h");
    };
  }, [sticky, shown]);

  if (!stats) return null;

  const live = stats.source === "live";
  const updated = new Date(stats.updatedAt).toLocaleString(
    "en-GB",
    live
      ? { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
      : { day: "numeric", month: "short", year: "numeric" },
  );

  const items: { label: string; value: number; icon: Icon }[] = [
    { label: "Registered members", value: stats.totals.members, icon: IconUsers },
    { label: "In good standing", value: stats.totals.inGoodStanding, icon: IconUserCheck },
    ...stats.byCategory.map((c) => ({
      label: `${capitalise(c.category)} members`,
      value: c.members,
      icon: /corporate|firm/i.test(c.category) ? IconBuildingSkyscraper : IconUser,
    })),
    // Firms only when categories don't already cover them.
    ...(!stats.byCategory.length && stats.totals.firms !== undefined
      ? [{ label: "Member firms", value: stats.totals.firms, icon: IconBuildingSkyscraper }]
      : []),
  ];

  return (
    <section
      ref={ref}
      id="register-strip"
      aria-label="Member register"
      className={cn(
        "border-b border-border bg-background",
        sticky && "z-40 md:sticky md:top-[var(--header-h,0px)]",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-3 md:flex-row md:items-center md:gap-8 lg:px-12">
        <p className="meta-label flex shrink-0 items-center gap-2 text-[0.6875rem] text-foreground/70 md:flex-col md:items-start md:gap-0.5">
          <span className="flex items-center gap-2">
            {live ? (
              <span aria-hidden="true" className="pulse-dot h-1.5 w-1.5 rounded-full bg-sustain" />
            ) : null}
            Member register
          </span>
          <span className="font-normal normal-case tracking-normal text-muted-foreground">
            <span aria-hidden="true" className="md:hidden">
              &middot;{" "}
            </span>
            {live ? `Live · updated ${updated}` : `As of ${updated}`}
          </span>
        </p>

        <ul
          className={cn(
            "grid flex-1 gap-x-3 md:divide-x md:divide-border",
            items.length > 3 ? "grid-cols-4" : "grid-cols-3",
          )}
        >
          {items.map(({ label, value, icon: ItemIcon }) => (
            <li key={label} className="flex items-center gap-3 md:px-5 md:first:pl-0">
              <ItemIcon
                className="hidden h-6 w-6 shrink-0 text-foreground/55 xl:block"
                stroke={1.5}
                aria-hidden
              />
              <p className="flex flex-col">
                <span className="font-display text-lg font-semibold tabular-nums text-foreground md:text-xl">
                  {value.toLocaleString("en-GB")}
                </span>
                <span className="text-[0.6875rem] leading-tight text-muted-foreground md:text-xs">
                  {label}
                </span>
              </p>
            </li>
          ))}
        </ul>

        <a
          href={DIRECTORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-quiet hidden shrink-0 items-center gap-1 text-sm lg:inline-flex"
        >
          Find a member
          <IconArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
