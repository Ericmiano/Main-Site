import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { opinionEditorialsDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Opinion Editorials | Architectural Association of Kenya";
const DESCRIPTION = "Op-eds and commentary from AAK leadership and members on industry issues.";

export const Route = createFileRoute("/opinion-editorials")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/opinion-editorials` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/opinion-editorials` }],
  }),
  component: OpinionEditorialsPage,
});

function OpinionEditorialsPage() {
  return (
    <ReportArchivePage
      eyebrow="Resource Centre"
      title="Opinion Editorials"
      description={DESCRIPTION}
      documents={opinionEditorialsDocuments}
    />
  );
}
