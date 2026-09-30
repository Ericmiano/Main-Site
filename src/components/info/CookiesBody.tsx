import { Link } from "@tanstack/react-router";

export default function CookiesBody() {
  return (
    <>
      <h2>Cookies set by this website</h2>
      <p>
        None. The website doesn&rsquo;t use analytics, advertising or social-media tracking, and it
        doesn&rsquo;t store anything in your browser. It loads its fonts from its own server rather
        than from a third party.
      </p>
      <p>
        The company that hosts the website may use a strictly necessary security cookie to protect
        the site from abuse. It isn&rsquo;t used to identify or track you.
      </p>

      <h2>Services that load only when you choose</h2>
      <ul>
        <li>
          <strong>YouTube videos</strong> are embedded in YouTube&rsquo;s privacy-enhanced mode.
          YouTube may set cookies once you play a video.
        </li>
        <li>
          <strong>Google Maps</strong> on the <Link to="/contact">contact page</Link> loads only
          when you select &ldquo;Show map&rdquo;. Google may then set cookies.
        </li>
        <li>
          <strong>Facebook</strong> posts in the &ldquo;Latest posts&rdquo; panel (in the footer)
          load only when you open it. Facebook may then set cookies.
        </li>
      </ul>

      <h2>Other AAK websites</h2>
      <p>
        Links to the members portal, AAK Sacco, BuildHub, the AAK Annual Convention and the Nairobi
        Biennale take you to separate websites, which may use cookies of their own.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. This website works fully without
        them.
      </p>

      <h2>If this changes</h2>
      <p>
        If AAK adds analytics or other tools that use cookies, this notice will be updated before
        they&rsquo;re switched on, and we&rsquo;ll ask for your consent where the law requires it.
        See also the <Link to="/privacy">privacy notice</Link>.
      </p>
    </>
  );
}
