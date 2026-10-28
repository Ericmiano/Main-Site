/**
 * Occasion themes: Kenya's public holidays (Public Holidays Act, Cap. 110),
 * plus Ramadan and the Christmas and New Year season. While one is on, every
 * page carries its strip under the main bar, and the homepage its greeting
 * and decoration (components/site/Occasion.tsx, styles.css "Occasion themes").
 *
 * OCCASION_SCRIPT picks the occasion in the visitor's browser, on Nairobi
 * dates, before the page is drawn, so the static site needs no rebuild when
 * one starts or ends. Add ?occasion=<id> to any address to preview one
 * (?occasion=none for none).
 *
 * Fixed days repeat every year and Easter is worked out for each year. The
 * Islamic dates follow the sighting of the moon, so MOON_DATES holds the
 * expected ones: move them to the dates announced for Kenya when they are.
 */

export type OccasionId =
  | "new-year"
  | "ramadan"
  | "eid-al-fitr"
  | "easter"
  | "labour-day"
  | "eid-al-adha"
  | "madaraka-day"
  | "mazingira-day"
  | "mashujaa-day"
  | "jamhuri-day"
  | "christmas";

/** The decoration: Kenyan flag, Christmas lights, crescent and stars,
 * confetti, leaves, or a warm sunrise glow. */
export type OccasionMotif = "flag" | "lights" | "crescent" | "confetti" | "leaves" | "dawn";

export interface Occasion {
  id: OccasionId;
  greeting: string;
  motif: OccasionMotif;
}

export const OCCASIONS: Occasion[] = [
  { id: "new-year", greeting: "Happy New Year", motif: "confetti" },
  { id: "ramadan", greeting: "Ramadan Kareem", motif: "crescent" },
  { id: "eid-al-fitr", greeting: "Eid Mubarak", motif: "crescent" },
  { id: "easter", greeting: "Happy Easter", motif: "dawn" },
  { id: "labour-day", greeting: "Happy Labour Day", motif: "dawn" },
  { id: "eid-al-adha", greeting: "Eid Mubarak", motif: "crescent" },
  { id: "madaraka-day", greeting: "Happy Madaraka Day", motif: "flag" },
  { id: "mazingira-day", greeting: "Happy Mazingira Day", motif: "leaves" },
  { id: "mashujaa-day", greeting: "Happy Mashujaa Day", motif: "flag" },
  { id: "jamhuri-day", greeting: "Happy Jamhuri Day", motif: "flag" },
  { id: "christmas", greeting: "Merry Christmas", motif: "lights" },
];

/** Occasions sharing a motif, as a space-separated list for data-occasion-for. */
export const occasionsWith = (motif: OccasionMotif) =>
  OCCASIONS.filter((o) => o.motif === motif)
    .map((o) => o.id)
    .join(" ");

/** Nairobi calendar days, first to last, inclusive. */
interface OccasionDates {
  id: OccasionId;
  from: string;
  to: string;
}

/**
 * Expected dates; the moon decides. Ramadan 2027 from about 8 February, Eid
 * al-Fitr on 9 or 10 March, Eid al-Adha on 16 or 17 May; Ramadan 2028 from
 * about 28 January, Eid al-Fitr about 27 February. Eid al-Adha 2028: add
 * once expected dates are published.
 */
const MOON_DATES: OccasionDates[] = [
  { id: "ramadan", from: "2027-02-08", to: "2027-03-08" },
  { id: "eid-al-fitr", from: "2027-03-09", to: "2027-03-11" },
  { id: "eid-al-adha", from: "2027-05-16", to: "2027-05-18" },
  { id: "ramadan", from: "2028-01-28", to: "2028-02-26" },
  { id: "eid-al-fitr", from: "2028-02-27", to: "2028-02-29" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const day = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

/** Easter Sunday (Gregorian), by the anonymous computus. */
function easterSunday(y: number): [number, number] {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const date = ((h + l - 7 * m + 114) % 31) + 1;
  return [month, date];
}

/** A day `offset` days from y-m-d, as yyyy-mm-dd. */
function shift(y: number, m: number, d: number, offset: number) {
  const t = new Date(Date.UTC(y, m - 1, d + offset));
  return day(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

/** The dates that come round every year. */
function yearDates(y: number): OccasionDates[] {
  const [em, ed] = easterSunday(y);
  return [
    { id: "new-year", from: day(y - 1, 12, 31), to: day(y, 1, 2) },
    // Good Friday to Easter Monday.
    { id: "easter", from: shift(y, em, ed, -2), to: shift(y, em, ed, 1) },
    { id: "labour-day", from: day(y, 5, 1), to: day(y, 5, 1) },
    { id: "madaraka-day", from: day(y, 6, 1), to: day(y, 6, 1) },
    { id: "mazingira-day", from: day(y, 10, 10), to: day(y, 10, 10) },
    { id: "mashujaa-day", from: day(y, 10, 20), to: day(y, 10, 20) },
    { id: "jamhuri-day", from: day(y, 12, 12), to: day(y, 12, 12) },
    // The Christmas season, to the 26 December holiday.
    { id: "christmas", from: day(y, 12, 20), to: day(y, 12, 26) },
  ];
}

const NAIROBI_MIDNIGHT = (iso: string) => Date.parse(`${iso}T00:00:00+03:00`);
const DAY_MS = 86_400_000;

/** [id, start, end) in epoch ms for this year and the next four, so an
 * upload keeps its themes for years; later entries win where they overlap. */
export function occasionTimes(fromYear = new Date().getFullYear()) {
  const dates = [
    ...Array.from({ length: 5 }, (_, i) => yearDates(fromYear + i)).flat(),
    ...MOON_DATES,
  ];
  return dates.map(
    ({ id, from, to }) => [id, NAIROBI_MIDNIGHT(from), NAIROBI_MIDNIGHT(to) + DAY_MS] as const,
  );
}

/**
 * Runs in <head> before anything is drawn: marks <html data-occasion="id">
 * for the occasion now on (or the ?occasion= preview), and shows that
 * occasion's elements ([data-occasion-for~="id"], hidden by default in
 * styles.css). If the page stays open, it changes over on the hour the next
 * occasion starts or this one ends.
 */
export const OCCASION_SCRIPT = (() => {
  const times = occasionTimes();
  const ids = OCCASIONS.map((o) => o.id);
  return `(function(){try{var w=${JSON.stringify(times)},ids=${JSON.stringify(ids)},d=document,h=d.documentElement,s=null,q=/[?&]occasion=([a-z-]+)/.exec(location.search);function now(){var n=Date.now(),id="";for(var i=0;i<w.length;i++)if(n>=w[i][1]&&n<w[i][2])id=w[i][0];return id}function set(id){if(ids.indexOf(id)<0)id="";if(id)h.setAttribute("data-occasion",id);else h.removeAttribute("data-occasion");if(s)s.remove();s=null;if(id){s=d.createElement("style");s.appendChild(d.createTextNode('[data-occasion-for~="'+id+'"]{display:flex!important}'));d.head.appendChild(s)}}if(q){set(q[1]);return}set(now());(function next(){var n=Date.now(),t=Infinity;for(var i=0;i<w.length;i++){if(w[i][1]>n&&w[i][1]<t)t=w[i][1];if(w[i][2]>n&&w[i][2]<t)t=w[i][2]}if(t-n<2147483647)setTimeout(function(){set(now());next()},t-n+50)})()}catch(x){}})()`;
})();
