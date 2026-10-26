#!/usr/bin/env node
/**
 * Updates the homepage's X posts (src/data/x-posts.json) from links to AAK's
 * posts, fetching each post's text, date and photos from X's public embed
 * data. Finding AAK's newest posts automatically needs X's paid API, so the
 * links are pasted in; everything after that is done here.
 *
 *   npm run x-posts -- <link> <link> <link> <link>
 *   npm run x-posts -- --dry-run <links>      (show what would change)
 *   npm run x-posts < embed-codes.txt         (X's "Embed post" code works too)
 *
 * Links, bare post ids and pasted embed code are all accepted; posts are
 * listed newest first whatever order they come in. The site shows four.
 *
 * Text is the post's own, as X provides it. X's data has only the opening of
 * a long post, so unless pasted embed code holds the full wording (it often
 * does; it's used when it's longer), those end in "…" and the card links to
 * the full post. Alt
 * text is the author's own where they set it on X; otherwise alt text
 * already written for that post is kept, or a plain description is used and
 * the run lists the photos that could do with a better one.
 *
 * Photos are saved to public/img/x/ as 800px WebP; ones no longer used are
 * removed. The site only changes once it's rebuilt and uploaded.
 */
import { readFile, writeFile, readdir, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/x-posts.json");
const IMG_DIR = path.join(ROOT, "public/img/x");
const ACCOUNT = "Arch_KE";
const SHOWN = 4;
const WIDTH = 800;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
let input = args.filter((a) => a !== "--dry-run").join("\n");
if (!input.trim() && !process.stdin.isTTY) {
  for await (const chunk of process.stdin) input += chunk;
}

// Post ids from links (x.com or twitter.com /status/<id>) or bare ids.
const ids = [
  ...new Set(
    [...input.matchAll(/\/status(?:es)?\/(\d{10,25})|(?:^|[\s,])(\d{15,25})(?=$|[\s,])/g)].map(
      (m) => m[1] ?? m[2],
    ),
  ),
];
if (!ids.length) {
  console.error(
    "Give the links to AAK's latest X posts, e.g.\n  npm run x-posts -- https://x.com/Arch_KE/status/2109596309128642922 ...",
  );
  process.exit(1);
}

/** X's public embed data for one post (the same data its embeds use). */
async function fetchPost(id) {
  const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
  const url = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token}&lang=en`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url);
    if (res.ok) {
      const body = await res.text();
      if (body.trim()) return JSON.parse(body);
    }
    if (attempt === 3) throw new Error(`X returned ${res.status} for post ${id}`);
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'" };
const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39|apos);/g, (_, e) => ENTITIES[e]);

/** The post's own words: links shown as written, the photo link and line
 * breaks dropped, and "…" where X has cut a long post short. */
function postText(post) {
  const chars = [...post.text];
  const [start, end] = post.display_text_range ?? [0, chars.length];
  let text = chars.slice(start, end).join("");
  for (const u of post.entities?.urls ?? []) {
    text = text.replaceAll(u.url, u.display_url ?? u.expanded_url ?? u.url);
  }
  text = decode(text)
    .replace(/https:\/\/t\.co\/\w+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (post.note_tweet) text += "…";
  return text;
}

/** Text from pasted "Embed post" code, by post id. X's embed generator
 * sometimes gives a long post's full wording, which its data cuts short. */
const embedTexts = new Map();
for (const [, quote] of input.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g)) {
  const id = quote.match(/\/status(?:es)?\/(\d{10,25})/)?.[1];
  const para = quote.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1];
  if (!id || !para) continue;
  const text = decode(
    para
      .replace(/<br\s*\/?>/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/&mdash;/g, "—")
      .replace(/&hellip;/g, "…"),
  )
    .replace(/pic\.(twitter|x)\.com\/\w+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text) embedTexts.set(id, text);
}
// Links in that wording are X's t.co short links: show where they go, as X
// does (aak.or.ke/initiatives/...), or drop any that can't be followed.
for (const [id, text] of embedTexts) {
  let out = text;
  for (const link of new Set(text.match(/https:\/\/t\.co\/\w+/g) ?? [])) {
    const to = await fetch(link, { redirect: "manual" })
      .then((r) => r.headers.get("location"))
      .catch(() => null);
    out = out.replaceAll(link, to ? to.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : "");
  }
  embedTexts.set(id, out.replace(/\s+/g, " ").trim());
}

/** The fuller of the two: X's data, or the pasted embed code's text. */
function bestText(id, post) {
  const fromData = postText(post);
  const fromEmbed = embedTexts.get(id);
  if (!fromEmbed) return fromData;
  const stem = fromData.replace(/…$/, "");
  return fromEmbed.length > stem.length && fromEmbed.startsWith(stem.slice(0, 40))
    ? fromEmbed
    : fromData;
}

const displayDate = (iso) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(new Date(iso));

const current = JSON.parse(await readFile(DATA, "utf8"));
const keptAlts = new Map(
  current.flatMap((p) => p.images.map((img, i) => [`${p.id}-${i}`, img.alt])),
);

const posts = [];
const needsAlt = [];
for (const id of ids) {
  const post = await fetchPost(id);
  const author = post.user?.screen_name;
  if (author && author.toLowerCase() !== ACCOUNT.toLowerCase()) {
    throw new Error(`Post ${id} is by @${author}, not @${ACCOUNT}.`);
  }
  const date = displayDate(post.created_at);
  const media = post.mediaDetails ?? [];
  const video = media.some((m) => m.type === "video" || m.type === "animated_gif");
  const images = [];
  for (const [i, m] of media.entries()) {
    const file = `${id}-${i + 1}.webp`;
    let width = m.original_info?.width ?? WIDTH;
    let height = m.original_info?.height ?? WIDTH;
    if (!dryRun) {
      const src = `${m.media_url_https}?format=jpg&name=large`;
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Couldn't download ${src} (${res.status})`);
      await mkdir(IMG_DIR, { recursive: true });
      const out = await sharp(Buffer.from(await res.arrayBuffer()))
        .rotate()
        .resize({ width: WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(IMG_DIR, file));
      ({ width, height } = out);
    } else if (width > WIDTH) {
      height = Math.round((height * WIDTH) / width);
      width = WIDTH;
    }
    const own = m.ext_alt_text?.trim();
    const kept = keptAlts.get(`${id}-${i}`);
    const plain =
      media.length > 1
        ? `Photo ${i + 1} of ${media.length} from AAK's X post of ${date}`
        : `${video ? "Still from the video" : "Image"} in AAK's X post of ${date}`;
    if (!own && !kept) needsAlt.push(`${file}: ${plain}`);
    images.push({ src: `/img/x/${file}`, width, height, alt: own || kept || plain });
  }
  posts.push({
    id,
    created: post.created_at,
    entry: { id, date, text: bestText(id, post), images, ...(video ? { video: true } : {}) },
  });
}

posts.sort((a, b) => b.created.localeCompare(a.created));
const next = posts.map((p) => p.entry);

for (const p of next) {
  console.log(`\n${p.date} · ${p.id}${p.video ? " · video" : ""}\n  ${p.text}`);
  for (const img of p.images) console.log(`  [${img.width}x${img.height}] ${img.alt}`);
}
if (next.length !== SHOWN) {
  console.warn(
    `\nNote: the homepage is laid out for ${SHOWN} posts; this list has ${next.length}.`,
  );
}

if (dryRun) {
  console.log("\nDry run: nothing was changed.");
  process.exit(0);
}

await writeFile(DATA, JSON.stringify(next, null, 2) + "\n");

// Remove photos of posts that have left the list.
const used = new Set(next.flatMap((p) => p.images.map((img) => path.basename(img.src))));
for (const file of await readdir(IMG_DIR)) {
  if (/^\d+-\d+\.webp$/.test(file) && !used.has(file)) await unlink(path.join(IMG_DIR, file));
}

console.log(`\nUpdated ${path.relative(ROOT, DATA)} with ${next.length} posts.`);
if (needsAlt.length) {
  console.log(
    '\nThese photos have no alt text on X, so they got a plain description. For a better one, edit its "alt" in src/data/x-posts.json:',
  );
  for (const line of needsAlt) console.log(`  ${line}`);
}
console.log("\nRebuild (npm run build:cpanel) and upload for the change to go live.");
