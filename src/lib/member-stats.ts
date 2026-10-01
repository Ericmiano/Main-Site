import { z } from "zod";

/**
 * Contract for the member register's statistics feed. The members portal
 * (members.aak.or.ke) is expected to serve this JSON; the site never invents
 * numbers — with no feed configured, the stats section simply doesn't render.
 */
export const memberStatsSchema = z.object({
  updatedAt: z.string().datetime({ offset: true }),
  totals: z.object({
    members: z.number().int().nonnegative(),
    inGoodStanding: z.number().int().nonnegative(),
    firms: z.number().int().nonnegative().optional(),
  }),
  byChapter: z
    .array(
      z.object({
        chapter: z.string().min(1),
        members: z.number().int().nonnegative(),
        inGoodStanding: z.number().int().nonnegative(),
        firms: z.number().int().nonnegative().optional(),
      }),
    )
    .default([]),
  byCategory: z
    .array(z.object({ category: z.string().min(1), members: z.number().int().nonnegative() }))
    .default([]),
});

export type MemberStats = z.infer<typeof memberStatsSchema>;

export type MemberStatsSource = "live" | "snapshot";

// Placeholder chapters that exist in the portal's data but aren't real
// chapters ("TEST CHAPTER", "TEST EMAIL", "LS").
const isTestChapter = (name: string) => /test|^ls$/i.test(name.trim());

const clean = (data: MemberStats): MemberStats => ({
  ...data,
  byChapter: data.byChapter.filter((row) => !isTestChapter(row.chapter)),
});

const TTL_MS = 5 * 60_000;
let cache: { at: number; data: MemberStats } | null = null;

async function fetchFeed(url: string): Promise<MemberStats> {
  const token = process.env["MEMBER_STATS_TOKEN"];
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Member stats feed responded ${res.status}`);
  return clean(memberStatsSchema.parse(await res.json()));
}

/**
 * The live portal feed when configured (cached per Worker isolate; on a
 * failed refresh, the last good copy). Otherwise, or if the feed has never
 * answered, the hand-entered snapshot. Null when neither exists.
 */
export async function getMemberStats(): Promise<{
  source: MemberStatsSource;
  data: MemberStats;
} | null> {
  const url = process.env["MEMBER_STATS_URL"];
  if (url) {
    if (cache && Date.now() - cache.at < TTL_MS) return { source: "live", data: cache.data };
    try {
      const data = await fetchFeed(url);
      cache = { at: Date.now(), data };
      return { source: "live", data };
    } catch (error) {
      console.error("member-stats:", error);
      if (cache) return { source: "live", data: cache.data };
    }
  }
  const { registerSnapshot } = await import("@/data/member-register-snapshot");
  return registerSnapshot
    ? { source: "snapshot", data: clean(memberStatsSchema.parse(registerSnapshot)) }
    : null;
}
