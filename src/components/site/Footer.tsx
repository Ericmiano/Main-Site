import { Link } from "@tanstack/react-router";
import { chapters } from "@/data/site";
import logoMark from "@/assets/aak-logo-mark.png";

const associationLinks = [
  { label: "About Us", to: "/about" as const },
  { label: "Programmes", to: "/programs" as const },
  { label: "Corporate Social Responsibility", to: "/csr" as const },
  { label: "Membership", to: "/membership" as const },
  { label: "The team", to: "/team" as const },
  { label: "Contact us", to: "/contact" as const },
];

const resourceLinks = [
  { label: "Events", to: "/events" as const },
  { label: "Resource Centre", to: "/resources" as const },
  // Arbitration: on hold while the system behind it is still being built. Re-add once ready.
  // { label: "Arbitration", to: "/arbitration" as const },
  { label: "Awards & Honours", to: "/awards" as const },
  { label: "Student affiliates", to: "/students" as const },
  { label: "Store", to: "/store" as const },
];

// Same-page anchor into the homepage, not a route of its own — kept as a
// plain link rather than the typed `resourceLinks` above.
const anchorLinks = [{ label: "Initiatives", href: "/#initiatives" }];

const externalQuickLinks = [
  { label: "Members Directory", href: "https://members.aak.or.ke/directory" },
  { label: "Validate Certificate", href: "https://members.aak.or.ke/validate" },
];

export function Footer() {
  return (
    <footer className="bg-ink-deep text-background">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logoMark}
                alt=""
                className="h-10 w-10 object-contain"
                width={40}
                height={40}
              />
              <p className="font-display text-2xl font-bold tracking-[0.16em]">AAK</p>
            </div>
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Chapters
            </h3>
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Association
            </h3>
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Resources
            </h3>
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Follow
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-background/85">
              <li>
                <a
                  className="link-underline transition-colors hover:text-background"
                  href="https://x.com/Arch_KE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  className="link-underline transition-colors hover:text-background"
                  href="https://ke.linkedin.com/company/architectural-association-of-kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="link-underline transition-colors hover:text-background"
                  href="https://www.facebook.com/ArchKE/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  className="link-underline transition-colors hover:text-background"
                  href="https://www.instagram.com/arch_ke/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="link-underline transition-colors hover:text-background"
                  href="https://www.youtube.com/@architecturalassociationof854"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  className="link-underline transition-colors hover:text-background"
                  href="https://www.tiktok.com/@aak_kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-background/15 pt-8 text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Architectural Association of Kenya. All rights reserved.
          </p>
          <p>Building a safe, sustainable and well-planned Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
