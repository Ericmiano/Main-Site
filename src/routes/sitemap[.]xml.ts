import { createFileRoute } from "@tanstack/react-router";
import { chapters, events, initiatives } from "@/data/site";
import { mediaAlbums } from "@/data/media-archive";
import { initiativeDetails } from "@/data/initiatives-detail";
import { LEGAL_PAGES_APPROVED } from "@/components/site/InfoPage";

const SITE_URL = "https://aak.or.ke";

/** Link-out events that still have a page here, because the site links to it. */
const EVENT_PAGES_LINKED_HERE = new Set(["nairobi-biennale-2026"]);

interface SitemapUrl {
  loc: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
}

function buildUrls(): SitemapUrl[] {
  return [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE_URL}/programs`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/csr`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/team`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/membership`, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE_URL}/contact`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/students`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/store`, changefreq: "monthly", priority: "0.4" },
    { loc: `${SITE_URL}/awards`, changefreq: "monthly", priority: "0.7" },
    { loc: `${SITE_URL}/resources`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/status-of-the-built-environment`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/agm-reports`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/buildpress-magazine`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/bills`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/building-regulations`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/press-statements`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/opinion-editorials`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/salary-survey`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/cpd-rapporteur-reports`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/liaison-committees-reports`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/general-downloads`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/mulika-mjengo-report`, changefreq: "monthly", priority: "0.5" },
    { loc: `${SITE_URL}/events`, changefreq: "weekly", priority: "0.9" },
    { loc: `${SITE_URL}/media`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/faqs`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/accessibility`, changefreq: "yearly", priority: "0.3" },
    // Legal pages are listed only once AAK approves them (they're noindex until then).
    ...(LEGAL_PAGES_APPROVED
      ? (["privacy", "terms", "cookies"] as const).map((page): SitemapUrl => ({
          loc: `${SITE_URL}/${page}`,
          changefreq: "yearly",
          priority: "0.3",
        }))
      : []),
    // Events that link out to their own website have no page in the static
    // export unless something here links to them (the Biennale section does).
    ...events
      .filter((event) => !event.externalSiteHref || EVENT_PAGES_LINKED_HERE.has(event.slug))
      .map((event): SitemapUrl => ({
        loc: `${SITE_URL}/events/${event.slug}`,
        changefreq: "weekly",
        priority: "0.7",
      })),
    ...mediaAlbums.map((album): SitemapUrl => ({
      loc: `${SITE_URL}/media/${album.slug}`,
      changefreq: "yearly",
      priority: "0.5",
    })),
    // Arbitration: on hold while the page is being finished. Re-add once ready.
    // { loc: `${SITE_URL}/arbitration`, changefreq: "monthly", priority: "0.8" },
    ...chapters.map((chapter): SitemapUrl => ({
      loc: `${SITE_URL}/chapters/${chapter.slug}`,
      changefreq: "monthly",
      priority: "0.6",
    })),
    // Likewise initiatives whose cards open another website (Safari Green
    // Building Index); Grow A Classroom has a page of its own here.
    ...initiativeDetails
      .filter((detail) => {
        const card = initiatives.find((i) => i.slug === detail.slug);
        return !card?.externalUrl || detail.slug === "grow-a-classroom";
      })
      .map((initiative): SitemapUrl => ({
        loc: `${SITE_URL}/initiatives/${initiative.slug}`,
        changefreq: "monthly",
        priority: "0.6",
      })),
  ];
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = buildUrls()
          .map(
            (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
          )
          .join("\n");
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
