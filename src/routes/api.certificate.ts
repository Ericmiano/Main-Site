import { createFileRoute } from "@tanstack/react-router";

/** Certificate lookups run on the cPanel host (public/api/certificate.php),
 * where the registers live. The Cloudflare build has no registers, so it
 * reports the service as unavailable rather than "not found". */
export const Route = createFileRoute("/api/certificate")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify({ status: "unavailable" }), {
          status: 503,
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
            "x-robots-tag": "noindex",
          },
        }),
    },
  },
});
