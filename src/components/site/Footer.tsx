import { Link } from "@tanstack/react-router";
import { chapters } from "@/data/site";
import logoWhite from "@/assets/aak-logo-white.webp";
import { SocialFeed } from "@/components/site/SocialFeed";
import { portalLinks, socialLinks } from "@/data/site";

const associationLinks = [
  { label: "About Us", to: "/about" as const },
  { label: "Programmes", to: "/programs" as const },
  { label: "Corporate Social Responsibility", to: "/csr" as const },
  { label: "Membership", to: "/membership" as const },
  { label: "AAK Leadership", to: "/team" as const },
  { label: "Nominations to boards", to: "/nominations" as const },
  { label: "Contact us", to: "/contact" as const },
];

const resourceLinks = [
  { label: "Events", to: "/events" as const },
  { label: "Resource Centre", to: "/resources" as const },
  // Arbitration: on hold while the page is being finished. Re-add once ready.
  // { label: "Arbitration", to: "/arbitration" as const },
  { label: "Awards & Honours", to: "/awards" as const },
  { label: "Media archive", to: "/media" as const },
  { label: "Student affiliates", to: "/students" as const },
  { label: "Store", to: "/store" as const },
];

// Same-page anchor into the homepage, not a route of its own — kept as a
// plain link rather than the typed `resourceLinks` above.
const anchorLinks = [{ label: "Initiatives", href: "/#initiatives" }];

const policyLinks = [
  { label: "FAQs", to: "/faqs" as const },
  { label: "Accessibility", to: "/accessibility" as const },
  { label: "Privacy", to: "/privacy" as const },
  { label: "Terms of use", to: "/terms" as const },
  { label: "Cookies", to: "/cookies" as const },
];

const externalQuickLinks = [
  { label: "Members Directory", href: portalLinks.directory },
  { label: "Validate Certificate", href: portalLinks.validate },
  { label: "Pay Membership", href: portalLinks.pay },
  { label: "Job Portal", href: portalLinks.jobs },
];

export function Footer() {
  return (
    <footer className="bg-ink-deep text-background">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <img
              src={logoWhite}
              alt="Architectural Association of Kenya: promoting excellence in the built environment"
              className="h-auto w-44 sm:w-52"
              width={440}
              height={317}
              loading="lazy"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
              The Architectural Association of Kenya has united professionals across the built and
              natural environment since 1967.
            </p>
            <address className="mt-6 space-y-1 text-sm not-italic text-background/60">
              <p>Blue Violets Plaza, 6th Floor, Room 605</p>
              <p>Kindaruma Rd, Off Ngong Rd</p>
              <p>P.O. Box 44258-00100, Nairobi, Kenya</p>
              <p>
                <a
                  className="link-underline transition-colors hover:text-background"
                  href="mailto:aak@aak.or.ke"
                >
                  aak@aak.or.ke
                </a>
              </p>
            </address>
          </div>

          <nav aria-label="Chapters">
            <h3 className="meta-label text-background/50">Chapters</h3>
            <ul className="mt-5 space-y-3 text-sm text-background/85">
              {chapters.map((chapter) => (
                <li key={chapter.name}>
                  <Link
                    className="link-underline transition-colors hover:text-background"
                    to="/chapters/$slug"
                    params={{ slug: chapter.slug }}
                  >
                    {chapter.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Association">
            <h3 className="meta-label text-background/50">Association</h3>
            <ul className="mt-5 space-y-3 text-sm text-background/85">
              {associationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="link-underline transition-colors hover:text-background"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="meta-label text-background/50">Resources</h3>
            <ul className="mt-5 space-y-3 text-sm text-background/85">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="link-underline transition-colors hover:text-background"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {anchorLinks.map((link) => (
                <li key={link.label}>
                  <a
                    className="link-underline transition-colors hover:text-background"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {externalQuickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    className="link-underline transition-colors hover:text-background"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="meta-label text-background/50">Follow</h3>
            <ul className="mt-5 space-y-3 text-sm text-background/85">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className="link-underline transition-colors hover:text-background"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <SocialFeed className="mt-6" />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-background/15 pt-8 text-xs text-background/65 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} Architectural Association of Kenya. All rights reserved.
          </p>
          <nav aria-label="Help and policies">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {policyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="link-underline transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
