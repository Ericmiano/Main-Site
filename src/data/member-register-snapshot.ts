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
// From the Secretariat, 19 Oct 2026: 5,569 members in the register, of whom
// 2,715 are active, i.e. in good standing (paid up for the year). Corporate
// members: 217, from the members portal admin dashboard as read 28 Sept 2026
// (the latest split available), shown at the user's request.
// Keep in step with public/api/member-register-snapshot.json (cPanel).
export const registerSnapshot: MemberStats | null = {
  updatedAt: "2026-10-19T12:00:00+03:00",
  totals: { members: 5569, inGoodStanding: 2715 },
  byChapter: [],
  byCategory: [{ category: "corporate", members: 217 }],
};
