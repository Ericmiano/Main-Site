import { createFileRoute } from "@tanstack/react-router";
import { chapters, events } from "@/data/site";
import { initiativeDetails } from "@/data/initiatives-detail";

const SITE_URL = "https://aak.or.ke";

interface SitemapUrl {
  loc: string;
  changefreq: "weekly" | "monthly";
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
    ...events.map((event): SitemapUrl => ({
      loc: `${SITE_URL}/events/${event.slug}`,
      changefreq: "weekly",
      priority: "0.7",
    })),
    // Arbitration: on hold while the system behind it is still being built. Re-add once ready.
    // { loc: `${SITE_URL}/arbitration`, changefreq: "monthly", priority: "0.8" },
    ...chapters.map((chapter): SitemapUrl => ({
      loc: `${SITE_URL}/chapters/${chapter.slug}`,
      changefreq: "monthly",
      priority: "0.6",
    })),
    ...initiativeDetails.map((initiative): SitemapUrl => ({
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
