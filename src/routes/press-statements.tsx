import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { pressStatementsDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Press Statements | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK's official statements to the press on matters affecting the built environment.";

export const Route = createFileRoute("/press-statements")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/press-statements` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/press-statements` }],
  }),
  component: PressStatementsPage,
});

function PressStatementsPage() {
  return (
    <ReportArchivePage
      eyebrow="Resource Centre"
      title="Press Statements"
      description={DESCRIPTION}
      documents={pressStatementsDocuments}
    />
  );
}
