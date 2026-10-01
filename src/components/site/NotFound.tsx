import { Link } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import logoMark from "@/assets/aak-logo-mark.webp";

// Plain links only: on cPanel this renders as static HTML with no scripts.
const destinations = [
  { to: "/events", label: "Events", hint: "What's on at AAK" },
  { to: "/membership", label: "Membership", hint: "Join, renew and fees" },
  { to: "/resources", label: "Resource centre", hint: "Reports and documents" },
  { to: "/faqs", label: "FAQs", hint: "Quick answers" },
  { to: "/contact", label: "Contact", hint: "Reach the secretariat" },
] as const;

/** Shared "page not found" screen: the router's fallback and the static /404 page. */
export function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-6 py-10 lg:px-12">
        <Link to="/" className="flex w-fit items-center gap-3" aria-label="AAK home">
          <img src={logoMark} alt="" width={40} height={40} className="h-10 w-10" />
          <span className="font-display text-xl font-bold tracking-[0.16em] text-foreground">
            AAK
          </span>
        </Link>

        <div className="my-auto grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <div>
            <p className="meta-label border-t border-border pt-5 text-foreground/70">
              Error 404 &middot; Page not found
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-balance text-foreground sm:text-7xl">
              This page isn&rsquo;t here.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              It may have moved when the AAK website was rebuilt, or the address may be mistyped.
              Try one of these instead, or start from the homepage.
            </p>
            <Link to="/" className="group btn-primary mt-8">
              Go to the homepage
            </Link>
          </div>

          <ul className="border-t border-border">
            {destinations.map((d) => (
              <li key={d.to} className="border-b border-border">
                <Link
                  to={d.to}
                  className="group flex items-center justify-between gap-4 py-4 text-foreground"
                >
                  <span>
                    <span className="type-title block">{d.label}</span>
                    <span className="text-sm text-muted-foreground">{d.hint}</span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
