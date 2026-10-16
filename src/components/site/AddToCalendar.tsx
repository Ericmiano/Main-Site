import { IconCalendarPlus as CalendarPlus } from "@tabler/icons-react";
import type { SiteEvent } from "@/data/site";

const SITE_URL = "https://aak.or.ke";

const icsDate = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");
const icsText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

const icsTime = (d: Date) => `${d.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;

/** All-day events end the day after their last day (DTEND is exclusive);
 * events with times (isoDate "…T12:00:00+03:00") use them. */
function buildIcs(event: SiteEvent) {
  const timed = event.isoDate.includes("T");
  const start = new Date(timed ? event.isoDate : `${event.isoDate}T00:00:00Z`);
  const last = event.endIsoDate ?? event.isoDate;
  const end = timed
    ? new Date(last.includes("T") ? last : event.isoDate)
    : new Date(new Date(`${last}T00:00:00Z`).getTime() + 86_400_000);
  const url = `${SITE_URL}/events/${event.slug}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Architectural Association of Kenya//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@aak.or.ke`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    timed ? `DTSTART:${icsTime(start)}` : `DTSTART;VALUE=DATE:${icsDate(start)}`,
    timed ? `DTEND:${icsTime(end)}` : `DTEND;VALUE=DATE:${icsDate(end)}`,
    `SUMMARY:${icsText(event.title)}`,
    `LOCATION:${icsText(event.venue)}`,
    `DESCRIPTION:${icsText(`${event.summary}\n\n${url}`)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function AddToCalendar({ event, className }: { event: SiteEvent; className?: string }) {
  const download = () => {
    const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${event.slug}.ics`;
    a.click();
    URL.revokeObjectURL(href);
  };

  return (
    <button type="button" onClick={download} className={className}>
      <CalendarPlus className="h-4 w-4" aria-hidden="true" />
      Add to calendar
    </button>
  );
}
