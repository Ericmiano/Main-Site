import { createFileRoute } from "@tanstack/react-router";
import { getMemberStats } from "@/lib/member-stats";

export const Route = createFileRoute("/api/member-stats")({
  server: {
    handlers: {
      GET: async () => {
        const result = await getMemberStats();
        if (!result) {
          return new Response(JSON.stringify({ available: false }), {
            status: 503,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        }
        return new Response(
          JSON.stringify({ available: true, source: result.source, ...result.data }),
          {
            headers: {
              "content-type": "application/json",
              "cache-control": "public, max-age=60",
            },
          },
        );
      },
    },
  },
});
