import { Link } from "@tanstack/react-router";
import { gacDonation } from "@/data/grow-a-classroom";

export default function TermsBody() {
  return (
    <>
      <h2>About these terms</h2>
      <p>
        This website is run by the Architectural Association of Kenya (AAK). By using it, you agree
        to these terms. If you don&rsquo;t agree, please don&rsquo;t use the site.
      </p>

      <h2>Using the website</h2>
      <p>
        You may use the website for lawful purposes. Please don&rsquo;t attempt to disrupt it,
        access parts of it you aren&rsquo;t meant to, or use it to send harmful or misleading
        content.
      </p>

      <h2>Content and documents</h2>
      <p>
        Unless stated otherwise, the text, images and documents on this website belong to AAK or to
        the people and organisations who created them, such as the architects and entrants whose
        projects appear in awards materials.
      </p>
      <ul>
        <li>
          You may view, download, print and share documents unchanged for personal, educational or
          professional reference, provided you credit the source.
        </li>
        <li>
          Republishing content, adapting it, or using it commercially needs AAK&rsquo;s written
          permission. Email <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a> to ask.
        </li>
      </ul>

      <h2>Accuracy of information</h2>
      <p>
        We publish information in good faith and try to keep it current, but details such as event
        dates, fees and contacts can change. Reports and documents reflect the date they were
        published. Nothing on this website is professional advice for a specific project.
      </p>

      <h2>Links to other websites</h2>
      <p>
        The website links to other services, including the AAK members portal, AAK Sacco, BuildHub,
        the AAK Annual Convention and Nairobi Biennale websites, and third-party sites. Those
        services have their own terms and privacy practices, and AAK isn&rsquo;t responsible for the
        content of third-party websites.
      </p>

      <h2>Store orders</h2>
      <p>
        Items in the <Link to="/store">store</Link> are ordered by messaging the secretariat on
        WhatsApp. Prices shown on the website are a guide; the final price, availability, payment
        and collection or delivery are confirmed with you directly when you order.
      </p>

      <h2>Donations</h2>
      <p>
        Donations to{" "}
        <a href="https://schools.aak.or.ke/" target="_blank" rel="noopener noreferrer">
          Grow A Classroom
        </a>{" "}
        are made by {gacDonation.method} {gacDonation.paybill}, account {gacDonation.account}, and
        support that programme. For confirmation of a donation or any questions, email{" "}
        <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a>.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, AAK isn&rsquo;t liable for loss arising from use of the
        website or reliance on its content, or from the website being temporarily unavailable.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Kenya.</p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms; the date at the top shows the latest version. Questions about
        them can be sent to <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a>. See also the{" "}
        <Link to="/privacy">privacy notice</Link> and <Link to="/cookies">cookie notice</Link>.
      </p>
    </>
  );
}
