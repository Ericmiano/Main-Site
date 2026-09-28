import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage, infoPageMeta, LEGAL_PAGES_APPROVED } from "@/components/site/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () =>
    infoPageMeta(
      "Privacy notice",
      "What personal information the AAK website collects, what it is used for, and how to contact the Association about it.",
      "/privacy",
      !LEGAL_PAGES_APPROVED,
    ),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy notice"
      intro="What personal information this website collects, what it's used for, and how to reach us about it."
      updated="28 September 2026"
      draft={!LEGAL_PAGES_APPROVED}
    >
      <h2>Who we are</h2>
      <p>
        This website is run by the Architectural Association of Kenya (AAK), Blue Violets Plaza, 6th
        Floor, Room 605, Kindaruma Rd, off Ngong Rd, P.O. Box 44258-00100, Nairobi. You can reach us
        at <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a> or on 0721 691 337.
      </p>

      <h2>What this website collects</h2>
      <p>
        The website has no forms, accounts or sign-ups, and it does not use analytics or advertising
        trackers. Like any website, the server that hosts it records standard technical information
        when pages are requested, such as your IP address, browser type, the page requested and the
        time. These logs are used only to run and secure the site.
      </p>

      <h2>When you contact us</h2>
      <p>
        If you email, call or message us on WhatsApp, including to order from the{" "}
        <Link to="/store">store</Link>, we use the details you send (such as your name, phone number
        or email address and your message) to respond to you and to fulfil your request. Messages
        sent on WhatsApp are also subject to WhatsApp&rsquo;s own privacy policy.
      </p>

      <h2>Donations</h2>
      <p>
        Donations to Grow A Classroom are made by M-Pesa Paybill, outside this website. M-Pesa is
        run by Safaricom, which shares the payment details AAK needs to record your donation.
      </p>

      <h2>Services on other AAK websites</h2>
      <p>
        Membership applications and renewals, payments, the members directory, certificate
        validation, event registration and the job portal are provided on the AAK members portal at{" "}
        <a href="https://members.aak.or.ke/" target="_blank" rel="noopener noreferrer">
          members.aak.or.ke
        </a>
        . Information you give there is handled by that system, not by this website. The same
        applies to the AAK Sacco, BuildHub, AAK Annual Convention and Nairobi Biennale websites.
      </p>

      <h2>Embedded content</h2>
      <ul>
        <li>
          <strong>Videos</strong> are embedded from YouTube in its privacy-enhanced mode. YouTube
          receives information about you only when you play a video.
        </li>
        <li>
          <strong>The map</strong> on the <Link to="/contact">contact page</Link> loads from Google
          Maps only if you choose &ldquo;Show map&rdquo;.
        </li>
      </ul>
      <p>
        See the <Link to="/cookies">cookie notice</Link> for more on how these services use cookies.
      </p>

      <h2>Your rights</h2>
      <p>
        Under Kenya&rsquo;s Data Protection Act, 2019, you can ask AAK to access, correct or delete
        personal information we hold about you, or object to how we use it. Contact us at{" "}
        <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a>. If you&rsquo;re not satisfied with our
        response, you can complain to the Office of the Data Protection Commissioner.
      </p>

      <h2>Changes to this notice</h2>
      <p>
        We&rsquo;ll update this notice if the website changes how it handles personal information,
        for example if we add analytics. The date at the top shows when it was last updated.
      </p>
    </InfoPage>
  );
}
