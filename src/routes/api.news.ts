import { createFileRoute } from "@tanstack/react-router";

/** News & insights come from the cPanel host (public/api/news.php), which
 * reads the WordPress back office and cleans each post. Workers can't run
 * PHP, so the Cloudflare build asks the live endpoint and passes it on. */
const LIVE_ENDPOINT = "https://aak.or.ke/api/news";

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const res = await fetch(LIVE_ENDPOINT + new URL(request.url).search, {
            headers: { accept: "application/json" },
            signal: AbortSignal.timeout(8000),
          });
          return new Response(JSON.stringify(await res.json()), {
            status: res.status,
            headers: { "content-type": "application/json", "cache-control": "public, max-age=60" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "unavailable" }), {
            status: 503,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        }
      },
    },
  },
});
