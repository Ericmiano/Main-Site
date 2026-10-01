import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { agmReportsDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "AGM Reports | Architectural Association of Kenya";
const DESCRIPTION = "Annual General Meeting reports, published each year following the AAK AGM.";

export const Route = createFileRoute("/agm-reports")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/agm-reports` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/agm-reports` }],
  }),
  component: AgmReportsPage,
});

function AgmReportsPage() {
  return (
    <ReportArchivePage
      eyebrow="Reports"
      title="AGM Reports"
      description={DESCRIPTION}
      documents={agmReportsDocuments}
    />
  );
}
