import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, infoPageMeta } from "@/components/site/InfoPage";
import { infoDocs } from "@/components/info/docs";
import CookiesBody from "@/components/info/CookiesBody";

// Kept as a standalone page for direct links, search engines and the
// script-free 404 page; on the site itself, links to it open a pop-up.
const doc = infoDocs["cookies"];

export const Route = createFileRoute("/cookies")({
  head: () => infoPageMeta(doc.title, doc.description, doc.path, doc.draft),
  component: () => (
    <InfoPage title={doc.title} intro={doc.intro} updated={doc.updated} draft={doc.draft}>
      <CookiesBody />
    </InfoPage>
  ),
});
