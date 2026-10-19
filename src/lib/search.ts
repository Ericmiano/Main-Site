/**
 * Site search: ranks entries by how well they match, across every category.
 *
 * Each entry's text is split into words once, into one vocabulary for the
 * whole index. A query word matches a vocabulary word exactly, as a prefix
 * ("conv" → convention), or within a typo or two ("convension"), and AAK's
 * acronyms and common phrasings expand to what they stand for ("sbe" →
 * status built environment). A word in the title counts most, then in the
 * keywords, the description and the body text. Results must match every
 * query word; if nothing does, the best partial matches are shown instead.
 */

export interface Searchable {
  title: string;
  description: string;
  /** Extra words that should find this entry but aren't shown. */
  keywords?: string;
  /** Longer text (page body, FAQ answer) searched and quoted in excerpts. */
  body?: string;
  /** Small score adjustment, e.g. upcoming events up, past ones down. */
  boost?: number;
}

export interface SearchHit<T extends Searchable> {
  entry: T;
  score: number;
  /** Query words (and their expansions) found, for highlighting. */
  terms: string[];
  /** A sentence from the body around the match, when the match is there. */
  excerpt?: string | undefined;
}

const STOPWORDS = new Set(
  "a an and are as at be by can do does for from how i in is it me my of on or the to what when where which who why with you your".split(
    " ",
  ),
);

/** Acronyms and everyday words people search with, and what they mean here. */
const SYNONYMS: Record<string, string[]> = {
  aak: ["architectural", "association", "kenya"],
  sbe: ["status", "built", "environment"],
  utc: ["urban", "thinkers", "campus"],
  gac: ["grow", "classroom"],
  jum: ["je", "una", "mjengo"],
  dmbf: ["bursary", "fund"],
  bursary: ["bursary", "fund"],
  cpd: ["cpd", "continuing", "professional", "development"],
  qs: ["quantity", "surveyors"],
  edc: ["environmental", "design", "consultants"],
  cpm: ["construction", "project", "managers"],
  nca: ["national", "construction", "authority"],
  nbc: ["building", "code"],
  boraqs: ["architects", "quantity", "surveyors"],
  fee: ["fees", "subscription", "membership"],
  fees: ["fee", "subscription", "membership"],
  cost: ["fee", "fees", "subscription"],
  price: ["fee", "fees", "subscription"],
  pay: ["payment", "pay", "paybill"],
  payment: ["pay", "paybill"],
  join: ["membership", "apply", "register"],
  apply: ["membership", "apply", "join"],
  signup: ["membership", "apply", "join"],
  register: ["membership", "apply", "register"],
  renew: ["renew", "pay", "membership"],
  login: ["log", "sign", "portal"],
  certificate: ["certificate", "verification", "validate"],
  verify: ["certificate", "verification", "validate"],
  validate: ["certificate", "verification", "validate"],
  jobs: ["job", "portal", "careers"],
  job: ["jobs", "portal", "careers"],
  contact: ["contact", "phone", "email", "secretariat"],
  phone: ["contact", "phone", "call"],
  email: ["contact", "email"],
  photos: ["album", "photos", "gallery", "media"],
  pictures: ["album", "photos", "gallery", "media"],
  gallery: ["album", "photos", "media"],
  report: ["report", "reports"],
  reports: ["report", "reports"],
  law: ["act", "regulations", "legislation"],
  laws: ["act", "regulations", "legislation"],
  magazine: ["magazine", "buildpress"],
  convention: ["convention"],
  awards: ["awards", "excellence"],
  president: ["president"],
  ceo: ["chief", "executive", "officer"],
  fellows: ["fellow", "fellows", "college"],
  fellow: ["fellow", "fellows", "college"],
  student: ["student", "students"],
  students: ["student", "students"],
  collapse: ["collapse", "unsafe", "mulika"],
  unsafe: ["unsafe", "mulika", "collapse"],
};

export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const words = (s: string) => normalize(s).split(" ").filter(Boolean);

/** Edit distance, giving up once it passes `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(
        prev[j]! + 1,
        cur[j - 1]! + 1,
        prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      cur.push(v);
      if (v < best) best = v;
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length]!;
}

// Field weights: where a word is found matters more than how.
const FIELDS = ["title", "keywords", "description", "body"] as const;
type Field = (typeof FIELDS)[number];
const FIELD_WEIGHT: Record<Field, number> = { title: 10, keywords: 6, description: 4, body: 2 };
// How a query word matched a word in the entry.
const EXACT = 1;
const PREFIX = 0.75;
const FUZZY = 0.55;

export interface SearchEngine<T extends Searchable> {
  search(query: string, limit?: number): SearchHit<T>[];
}

export function createSearch<T extends Searchable>(entries: T[]): SearchEngine<T> {
  // word -> entry index -> best field weight for that word
  const vocab = new Map<string, Map<number, number>>();
  const titles = entries.map((e) => normalize(e.title));
  entries.forEach((entry, i) => {
    for (const field of FIELDS) {
      const text = entry[field];
      if (!text) continue;
      for (const w of words(text)) {
        let postings = vocab.get(w);
        if (!postings) vocab.set(w, (postings = new Map()));
        if ((postings.get(i) ?? 0) < FIELD_WEIGHT[field]) postings.set(i, FIELD_WEIGHT[field]);
      }
    }
  });
  const vocabulary = [...vocab.keys()];
  const titleWords = titles.map((t) => new Set(t.split(" ")));

  /** Entry index -> best score for one query word, and the words it matched. */
  function matchWord(q: string): { scores: Map<number, number>; matched: string[] } {
    const scores = new Map<number, number>();
    const matched: string[] = [];
    const maxTypos = q.length >= 8 ? 2 : q.length >= 4 ? 1 : 0;
    for (const w of vocabulary) {
      let quality = 0;
      if (w === q) quality = EXACT;
      else if (q.length >= 2 && w.startsWith(q)) quality = PREFIX;
      else if (
        maxTypos &&
        Math.abs(w.length - q.length) <= maxTypos &&
        editDistance(q, w, maxTypos) <= maxTypos
      )
        quality = FUZZY;
      if (!quality) continue;
      matched.push(w);
      for (const [i, weight] of vocab.get(w)!) {
        const s = weight * quality;
        if (s > (scores.get(i) ?? 0)) scores.set(i, s);
      }
    }
    return { scores, matched };
  }

  return {
    search(query, limit = 50) {
      const qWords = words(query).filter((w) => !STOPWORDS.has(w) || words(query).length === 1);
      if (!qWords.length) return [];
      const phrase = normalize(query);

      // Each query word scores entries through itself and its expansions.
      const perWord = qWords.map((q) => {
        const own = matchWord(q);
        const combined = new Map(own.scores);
        const terms = [...own.matched];
        for (const alt of SYNONYMS[q] ?? []) {
          if (alt === q) continue;
          const m = matchWord(alt);
          terms.push(...m.matched);
          // An expansion counts a little less than the word itself.
          for (const [i, s] of m.scores) combined.set(i, Math.max(combined.get(i) ?? 0, s * 0.8));
        }
        return { scores: combined, terms };
      });

      // An acronym whose whole phrase is in a title ("sbe" → "Status of the
      // Built Environment …") is what the reader meant.
      const phrases = qWords
        .map((q) => SYNONYMS[q])
        .filter((exp): exp is string[] => !!exp && exp.length >= 2);

      const rank = (requireAll: boolean) => {
        const totals = new Map<number, number>();
        const hits = new Map<number, number>();
        for (const { scores } of perWord) {
          for (const [i, s] of scores) {
            totals.set(i, (totals.get(i) ?? 0) + s);
            hits.set(i, (hits.get(i) ?? 0) + 1);
          }
        }
        const out: { i: number; score: number }[] = [];
        for (const [i, total] of totals) {
          const found = hits.get(i)!;
          if (requireAll && found < perWord.length) continue;
          let score = total * (found / perWord.length);
          const title = titles[i]!;
          if (title === phrase) score += 25;
          else if (title.startsWith(phrase)) score += 12;
          else if (phrase.length > 2 && title.includes(phrase)) score += 6;
          for (const exp of phrases) if (exp.every((w) => titleWords[i]!.has(w))) score += 10;
          score += entries[i]!.boost ?? 0;
          out.push({ i, score });
        }
        return out.sort((a, b) => b.score - a.score);
      };

      let ranked = rank(true);
      if (!ranked.length) ranked = rank(false);
      const terms = [...new Set(perWord.flatMap((p) => p.terms))].sort(
        (a, b) => b.length - a.length,
      );

      return ranked.slice(0, limit).map(({ i, score }) => {
        const entry = entries[i]!;
        const shown = normalize(`${entry.title} ${entry.description}`);
        const inShown = terms.some((t) => new RegExp(`\\b${t}`).test(shown));
        return {
          entry,
          score,
          terms,
          ...(!inShown && entry.body ? { excerpt: excerpt(entry.body, terms) } : {}),
        };
      });
    },
  };
}

/** About 160 characters of `text` around the first matching word. */
export function excerpt(text: string, terms: string[]): string | undefined {
  const re = termsRegex(terms);
  if (!re) return undefined;
  const m = re.exec(text);
  if (!m) return undefined;
  const start = Math.max(0, m.index - 60);
  const end = Math.min(text.length, m.index + 100);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/** Case-insensitive pattern for any of the terms at the start of a word. */
export function termsRegex(terms: string[]): RegExp | null {
  const parts = terms
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return parts.length ? new RegExp(`\\b(${parts.join("|")})`, "i") : null;
}

/** Splits text into plain and highlighted parts for rendering. */
export function highlightParts(text: string, terms: string[]): { text: string; hit: boolean }[] {
  const re = termsRegex(terms);
  if (!re) return [{ text, hit: false }];
  const global = new RegExp(re.source, "gi");
  const parts: { text: string; hit: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(global)) {
    if (m.index! > last) parts.push({ text: text.slice(last, m.index), hit: false });
    parts.push({ text: m[0], hit: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), hit: false });
  return parts;
}
