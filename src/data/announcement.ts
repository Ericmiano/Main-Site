import { conventionMagazine2026 } from "@/data/site";

/**
 * A site-wide announcement: a thin bar above every page's header, and a
 * "New" link in the homepage hero. Both disappear by themselves at `until`.
 * That's checked in the visitor's browser (ANNOUNCEMENT_SCRIPT, in the page
 * head), so a build uploaded before then still hides them on time, with no
 * flash. Visitors can also dismiss the bar. Set to null when there's nothing
 * to announce; a new `id` shows the bar again to people who dismissed the
 * last one.
 */
export interface Announcement {
  id: string;
  /** Bar text, e.g. "AAK Annual Convention 2026 Magazine". */
  text: string;
  /** Hero link text: short. */
  short: string;
  /** Call to action after the bar text. */
  action: string;
  href: string;
  /** Hidden from this moment (ISO date-time with timezone). */
  until: string;
}

export const announcement: Announcement | null = {
  id: "convention-magazine-2026",
  text: conventionMagazine2026.title,
  short: "Convention Magazine 2026",
  action: "Read it",
  href: conventionMagazine2026.href,
  // Shown up to the end of 14 November 2026, Nairobi time.
  until: "2026-11-15T00:00:00+03:00",
};

export const DISMISS_KEY = (id: string) => `aak-announcement-dismissed:${id}`;

/** Runs in <head> before anything is drawn: marks <html> so CSS hides the
 * announcement once it has expired (bar and hero link) or been dismissed
 * (bar only); see [data-announcement] in styles.css. It also handles the
 * bar's close button, so that works even before the page's scripts load. */
export const ANNOUNCEMENT_SCRIPT = announcement
  ? `(function(){try{var h=document.documentElement;if(Date.now()>=${Date.parse(announcement.until)}){h.setAttribute("data-announce-expired","")}else if(localStorage.getItem(${JSON.stringify(DISMISS_KEY(announcement.id))})){h.setAttribute("data-announce-dismissed","")}document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("[data-announce-dismiss]")){h.setAttribute("data-announce-dismissed","");try{localStorage.setItem(${JSON.stringify(DISMISS_KEY(announcement.id))},"1")}catch(x){}}})}catch(e){}})()`
  : null;
