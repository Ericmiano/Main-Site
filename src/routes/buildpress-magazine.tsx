import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { buildpressMagazineDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "BuildPress Magazine | Architectural Association of Kenya";
const DESCRIPTION = "AAK's magazine covering the profession, chapters and industry issues.";

export const Route = createFileRoute("/buildpress-magazine")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/buildpress-magazine` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/buildpress-magazine` }],
  }),
  component: BuildpressMagazinePage,
});

function BuildpressMagazinePage() {
  return (
    <ReportArchivePage
      eyebrow="Reports"
      title="BuildPress Magazine"
      description={DESCRIPTION}
      documents={buildpressMagazineDocuments}
    />
  );
}
