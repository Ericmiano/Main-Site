import type { MemberStats } from "@/lib/member-stats";

/**
 * Hand-entered member counts, used until the members portal feed
 * (MEMBER_STATS_URL) is connected. The register shows these labelled
 * "As of <updatedAt>", never as live.
 *
 * Fill in from the portal's admin reports, then set `updatedAt` to the date
 * the figures were read. Leave as `null` to keep the register hidden.
 * Only real figures: no estimates or placeholders.
 *
 * Example shape:
 * {
 *   updatedAt: "2026-09-30T09:00:00+03:00",
 *   totals: { members: 0, inGoodStanding: 0, firms: 0 },
 *   byChapter: [
 *     { chapter: "Architects", members: 0, inGoodStanding: 0, firms: 0 },
 *     { chapter: "Quantity Surveyors", members: 0, inGoodStanding: 0, firms: 0 },
 *     { chapter: "Town Planners", members: 0, inGoodStanding: 0, firms: 0 },
 *     { chapter: "Engineers", members: 0, inGoodStanding: 0, firms: 0 },
 *     { chapter: "Landscape Architects", members: 0, inGoodStanding: 0, firms: 0 },
 *     { chapter: "Environmental Design Consultants", members: 0, inGoodStanding: 0, firms: 0 },
 *     { chapter: "Construction Project Managers", members: 0, inGoodStanding: 0, firms: 0 },
 *     { chapter: "Interior Designers", members: 0, inGoodStanding: 0, firms: 0 },
 *   ],
 *   byCategory: [],
 * }
 */
export const registerSnapshot: MemberStats | null = null;
