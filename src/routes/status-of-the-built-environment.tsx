import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { statusOfTheBuiltEnvironmentDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Status of the Built Environment Report | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK's annual analysis of trends, challenges and professional opportunities in Kenya's construction and urban development sector.";

export const Route = createFileRoute("/status-of-the-built-environment")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/status-of-the-built-environment` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/status-of-the-built-environment` }],
  }),
  component: StatusOfTheBuiltEnvironmentPage,
});

function StatusOfTheBuiltEnvironmentPage() {
  return (
    <ReportArchivePage
      eyebrow="Reports"
      title="Status of the Built Environment Report"
      description={DESCRIPTION}
      documents={statusOfTheBuiltEnvironmentDocuments}
    />
  );
}
