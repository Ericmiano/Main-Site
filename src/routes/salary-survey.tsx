import { createFileRoute } from "@tanstack/react-router";
import { ReportArchivePage } from "@/components/site/ReportArchive";
import { salarySurveyDocuments } from "@/data/report-archives";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Salary Survey | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK's periodic survey of remuneration across the built and natural environment professions, covering eight professions at four career stages, from students and interns through to senior professionals.";

export const Route = createFileRoute("/salary-survey")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/salary-survey` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/salary-survey` }],
  }),
  component: SalarySurveyPage,
});

function SalarySurveyPage() {
  return (
    <ReportArchivePage
      eyebrow="Reports"
      title="Salary Survey"
      description={DESCRIPTION}
      documents={salarySurveyDocuments}
    />
  );
}
