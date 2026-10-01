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
// From the members portal admin dashboard (members.aak.or.ke/admin/dashboard),
// read 28 Sept 2026: total 5,513 (5,296 individual, 217 corporate), active 5,503.
// The dashboard has no per-chapter breakdown, so `byChapter` stays empty.
// Keep in step with public/api/member-register-snapshot.json (cPanel).
export const registerSnapshot: MemberStats | null = {
  updatedAt: "2026-09-28T10:46:00+03:00",
  totals: { members: 5513, inGoodStanding: 5503, firms: 217 },
  byChapter: [],
  byCategory: [
    { category: "individual", members: 5296 },
    { category: "corporate", members: 217 },
  ],
};
