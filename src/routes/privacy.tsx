import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, infoPageMeta } from "@/components/site/InfoPage";
import { infoDocs } from "@/components/info/docs";
import PrivacyBody from "@/components/info/PrivacyBody";

// Kept as a standalone page for direct links, search engines and the
// script-free 404 page; on the site itself, links to it open a pop-up.
const doc = infoDocs["privacy"];

export const Route = createFileRoute("/privacy")({
  head: () => infoPageMeta(doc.title, doc.description, doc.path, doc.draft),
  component: () => (
    <InfoPage title={doc.title} intro={doc.intro} updated={doc.updated} draft={doc.draft}>
      <PrivacyBody />
    </InfoPage>
  ),
});
