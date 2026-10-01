import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { buildingRegulationsDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Building Regulations | Architectural Association of Kenya";
const DESCRIPTION = "Reference building regulations and standards relevant to practice in Kenya.";

export const Route = createFileRoute("/building-regulations")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/building-regulations` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/building-regulations` }],
  }),
  component: BuildingRegulationsPage,
});

function BuildingRegulationsPage() {
  return (
    <ReportArchivePage
      eyebrow="Resource Centre"
      title="Building Regulations"
      description={DESCRIPTION}
      documents={buildingRegulationsDocuments}
    />
  );
}
