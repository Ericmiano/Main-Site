import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage, infoPageMeta } from "@/components/site/InfoPage";

export const Route = createFileRoute("/accessibility")({
  head: () =>
    infoPageMeta(
      "Accessibility",
      "AAK's commitment to an accessible website, how it has been tested, known limitations, and how to report an access problem.",
      "/accessibility",
      false,
    ),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <InfoPage
      title="Accessibility"
      intro="We want everyone to be able to use this website, including people who use assistive technology, a keyboard or a small screen."
      updated="28 September 2026"
    >
      <h2>Our commitment</h2>
      <p>
        The Architectural Association of Kenya aims for this website to meet the Web Content
        Accessibility Guidelines (WCAG) 2.1 at level AA, and to fix access problems when they are
        reported.
      </p>

      <h2>How the site has been tested</h2>
      <p>
        On 28 September 2026 the main pages, including the homepage, membership, events, awards,
        initiatives, chapters, contact, store, resources and FAQs, were tested at desktop and phone
        sizes with automated WCAG 2.1 AA checks. Issues found, mainly text that was too faint to
        read comfortably, were fixed, and the checks now pass.
      </p>
      <p>Automated checks find only some kinds of problem, so the site has also been built to:</p>
      <ul>
        <li>work with a keyboard, with a visible focus outline on links and buttons;</li>
        <li>keep keyboard focus inside the mobile menu while it is open;</li>
        <li>
          respect your device&rsquo;s &ldquo;reduce motion&rdquo; setting, turning off moving
          carousels and scroll animations;
        </li>
        <li>pause moving carousels while you hover over, touch or tab into them;</li>
        <li>give images text descriptions and use headings to structure each page.</li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>
          <strong>PDF documents.</strong> Many reports and older documents are scanned or were not
          produced as accessible PDFs, so screen readers may not be able to read them. We can
          provide the content in another format on request.
        </li>
        <li>
          <strong>Video.</strong> The Mabokoni Primary School site-visit film doesn&rsquo;t have
          captions. Videos embedded from YouTube rely on YouTube&rsquo;s captions where available.
        </li>
        <li>
          <strong>Other AAK services.</strong> The members portal, AAK Sacco, BuildHub, the Annual
          Convention and Nairobi Biennale websites are separate systems and aren&rsquo;t covered by
          this statement.
        </li>
      </ul>

      <h2>Report a problem or ask for another format</h2>
      <p>
        If you find something on this website hard to use, or need a document in a different format,
        please tell us. Say which page or document it is and what went wrong.
      </p>
      <ul>
        <li>
          Email: <a href="mailto:aak@aak.or.ke?subject=Website%20accessibility">aak@aak.or.ke</a>
        </li>
        <li>Phone or WhatsApp: 0721 691 337</li>
        <li>
          In person: Blue Violets Plaza, 6th Floor, Room 605, Kindaruma Rd, off Ngong Rd, Nairobi.
          See the <Link to="/contact">contact page</Link> for office hours.
        </li>
      </ul>
    </InfoPage>
  );
}
