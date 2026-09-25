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
      }),
    )
    .default([]),
  byCategory: z
    .array(z.object({ category: z.string().min(1), members: z.number().int().nonnegative() }))
    .default([]),
});

export type MemberStats = z.infer<typeof memberStatsSchema>;

const TTL_MS = 5 * 60_000;
let cache: { at: number; data: MemberStats } | null = null;

/** Fetches the register feed, cached per Worker isolate. Returns null when no
 * feed is configured; on a failed refresh, serves the last good copy. */
export async function getMemberStats(): Promise<MemberStats | null> {
  const url = process.env["MEMBER_STATS_URL"];
  if (!url) return null;
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  try {
    const token = process.env["MEMBER_STATS_TOKEN"];
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Member stats feed responded ${res.status}`);
    const data = memberStatsSchema.parse(await res.json());
    cache = { at: Date.now(), data };
    return data;
  } catch (error) {
    console.error("member-stats:", error);
    return cache?.data ?? null;
  }
}
