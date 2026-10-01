import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { cpdRapporteurReportsDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "CPD Rapporteur Reports | Architectural Association of Kenya";
const DESCRIPTION = "Summaries from AAK's Continuing Professional Development sessions.";

export const Route = createFileRoute("/cpd-rapporteur-reports")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/cpd-rapporteur-reports` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cpd-rapporteur-reports` }],
  }),
  component: CpdRapporteurReportsPage,
});

function CpdRapporteurReportsPage() {
  return (
    <ReportArchivePage
      eyebrow="Reports"
      title="CPD Rapporteur Reports"
      description={DESCRIPTION}
      documents={cpdRapporteurReportsDocuments}
    />
  );
}
