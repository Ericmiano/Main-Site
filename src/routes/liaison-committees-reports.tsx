import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { liaisonCommitteesReportsDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Liaison Committees Reports | Architectural Association of Kenya";
const DESCRIPTION = "Reports from AAK's liaison committees with regulators and partner bodies.";

export const Route = createFileRoute("/liaison-committees-reports")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/liaison-committees-reports` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/liaison-committees-reports` }],
  }),
  component: LiaisonCommitteesReportsPage,
});

function LiaisonCommitteesReportsPage() {
  return (
    <ReportArchivePage
      eyebrow="Reports"
      title="Liaison Committees Reports"
      description={DESCRIPTION}
      documents={liaisonCommitteesReportsDocuments}
    />
  );
}
