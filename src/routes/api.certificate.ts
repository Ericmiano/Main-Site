import { createFileRoute } from "@tanstack/react-router";

/** The certificate register is private and read by the cPanel PHP endpoint. */
export const Route = createFileRoute("/api/certificate")({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(null, {
          status: 307,
          headers: {
            location: `/api/certificate.php${new URL(request.url).search}`,
            "cache-control": "no-store",
            "x-robots-tag": "noindex",
          },
        }),
    },
  },
});
