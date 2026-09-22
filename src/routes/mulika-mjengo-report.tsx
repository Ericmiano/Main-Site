import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { mulikaMjengoReportDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Mulika Mjengo Report | Architectural Association of Kenya";
const DESCRIPTION =
  "The core report behind AAK's public safety and hazard-reporting advocacy initiative.";

export const Route = createFileRoute("/mulika-mjengo-report")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/mulika-mjengo-report` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/mulika-mjengo-report` }],
  }),
  component: MulikaMjengoReportPage,
});

function MulikaMjengoReportPage() {
  return (
    <ReportArchivePage
      eyebrow="Reports"
      title="Mulika Mjengo Report"
      description={DESCRIPTION}
      documents={mulikaMjengoReportDocuments}
    />
  );
}
