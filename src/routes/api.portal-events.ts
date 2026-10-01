import { createFileRoute } from "@tanstack/react-router";
import { portalLinks } from "@/data/site";

/** Number of public events the members portal is listing (the Cloudflare
 * build's twin of public/api/portal-events.php). */
export const Route = createFileRoute("/api/portal-events")({
  server: {
    handlers: {
      GET: async () => {
        let count = 0;
        try {
          const res = await fetch(portalLinks.eventsEmbed, { signal: AbortSignal.timeout(8000) });
          if (res.ok) {
            count = ((await res.text()).match(/class\s*=\s*["'][^"']*\bevent-card\b/gi) ?? [])
              .length;
          }
        } catch {
          // Portal unreachable: report none, so the page simply hides the widget.
        }
        return new Response(JSON.stringify({ count }), {
          headers: { "content-type": "application/json", "cache-control": "public, max-age=300" },
        });
      },
    },
  },
});
