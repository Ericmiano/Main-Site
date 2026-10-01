import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { generalDownloadsDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "General Downloads | Architectural Association of Kenya";
const DESCRIPTION = "Forms, guides and other documents for members and the public.";

export const Route = createFileRoute("/general-downloads")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/general-downloads` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/general-downloads` }],
  }),
  component: GeneralDownloadsPage,
});

function GeneralDownloadsPage() {
  return (
    <ReportArchivePage
      eyebrow="Resource Centre"
      title="General Downloads"
      description={DESCRIPTION}
      documents={generalDownloadsDocuments}
    />
  );
}
