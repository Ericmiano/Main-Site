import { IconArrowUpRight as ArrowUpRight, IconX as Close } from "@tabler/icons-react";

import { announcement } from "@/data/announcement";

/** The thin bar above the header (see @/data/announcement). It scrolls away
 * with the page; expiry and dismissal hide it through <html> attributes, and
 * the close button is handled by ANNOUNCEMENT_SCRIPT. */
export function AnnouncementBar() {
  if (!announcement) return null;
  const { text, short, action, href } = announcement;

  return (
    <div
      data-announcement="bar"
      role="region"
      aria-label="Announcement"
      className="border-b border-background/10 bg-ink-deep text-background"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-6 py-2 lg:px-12">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-1 items-center justify-center gap-2.5 text-sm"
        >
          <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-primary-foreground uppercase">
            New
          </span>
          {/* Phones get the short wording so the whole line fits. */}
          <span className="truncate sm:hidden">{short}</span>
          <span className="hidden truncate sm:inline">{text}</span>
          <span className="inline-flex shrink-0 items-center gap-1 font-semibold underline decoration-background/40 underline-offset-4 group-hover:decoration-background">
            {action}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </a>
        <button
          type="button"
          data-announce-dismiss
          aria-label="Dismiss announcement"
          className="-mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-background/70 transition-colors hover:bg-background/10 hover:text-background"
        >
          <Close className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
