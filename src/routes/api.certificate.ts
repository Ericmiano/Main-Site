import { createFileRoute } from "@tanstack/react-router";

/** Certificate lookups are answered by the cPanel host (public/api/certificate.php),
 * where the private registers live. Workers can't run PHP, so the Cloudflare
 * build asks the live endpoint and passes its answer on. */
const LIVE_ENDPOINT = "https://aak.or.ke/api/certificate";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });

export const Route = createFileRoute("/api/certificate")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const res = await fetch(LIVE_ENDPOINT + new URL(request.url).search, {
            headers: { accept: "application/json" },
            signal: AbortSignal.timeout(8000),
          });
          const data: unknown = await res.json();
          return json(data, res.status);
        } catch {
          return json({ status: "unavailable" }, 503);
        }
      },
    },
  },
});
