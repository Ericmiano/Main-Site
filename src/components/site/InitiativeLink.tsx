import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { Initiative } from "@/data/site";

/** Links to an initiative: its own site in a new tab when it has one
 * (`externalUrl`), otherwise its page on this site. */
export function InitiativeLink({
  initiative,
  className,
  onClick,
  children,
}: {
  initiative: Initiative;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (initiative.externalUrl) {
    return (
      <a
        href={initiative.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      to="/initiatives/$slug"
      params={{ slug: initiative.slug }}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
