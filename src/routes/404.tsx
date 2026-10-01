import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "@/components/site/NotFound";

// Exported as /404/index.html for Apache's ErrorDocument on cPanel.
export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page not found | Architectural Association of Kenya" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFound,
});
