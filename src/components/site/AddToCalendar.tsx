import { IconCalendarPlus as CalendarPlus } from "@tabler/icons-react";
import type { SiteEvent } from "@/data/site";

const SITE_URL = "https://aak.or.ke";

const icsDate = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");
const icsText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** Events are all-day, so DTEND is the day after the last day (exclusive). */
function buildIcs(event: SiteEvent) {
  const start = new Date(`${event.isoDate}T00:00:00Z`);
  const last = new Date(`${event.endIsoDate ?? event.isoDate}T00:00:00Z`);
  const end = new Date(last.getTime() + 86_400_000);
  const url = `${SITE_URL}/events/${event.slug}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Architectural Association of Kenya//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@aak.or.ke`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(end)}`,
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
