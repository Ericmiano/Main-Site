import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { billsDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Bills | Architectural Association of Kenya";
const DESCRIPTION =
  "Parliamentary bills tracked by AAK's advocacy team, with the association's submissions where made.";

export const Route = createFileRoute("/bills")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/bills` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/bills` }],
  }),
  component: BillsPage,
});

function BillsPage() {
  return (
    <ReportArchivePage
      eyebrow="Resource Centre"
      title="Bills"
      description={DESCRIPTION}
      documents={billsDocuments}
    />
  );
}
