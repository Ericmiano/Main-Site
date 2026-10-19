import {
  IconArrowUpRight as ArrowUpRight,
  IconBolt as Bolt,
  IconCalendarEvent as CalendarEvent,
  IconFileTypePdf as FilePdf,
  IconHelpCircle as Help,
  IconId as Id,
  IconLayoutGrid as Grid,
  IconPhoto as Photo,
  IconTrophy as Trophy,
  IconUser as User,
  IconUsersGroup as Users,
  IconWorld as World,
  type Icon,
} from "@tabler/icons-react";

import type { SearchEntry } from "@/data/search-index";
import { highlightParts } from "@/lib/search";
import { cn } from "@/lib/utils";

const ICONS: Record<SearchEntry["category"], Icon> = {
  "Quick link": Bolt,
  Page: World,
  Event: CalendarEvent,
  Initiative: Grid,
  Chapter: Users,
  Membership: Id,
  FAQ: Help,
  Person: User,
  Award: Trophy,
  Album: Photo,
  Document: FilePdf,
};

export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  return (
    <>
      {highlightParts(text, terms).map((part, i) =>
        part.hit ? (
          <mark key={i} className="rounded-sm bg-primary/12 px-0.5 font-semibold text-foreground">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

/** A result: icon, title, what it is, and where the query matched. */
export function ResultBody({
  entry,
  terms = [],
  excerpt,
  wrap = false,
}: {
  entry: SearchEntry;
  terms?: string[] | undefined;
  excerpt?: string | undefined;
  /** Let the description wrap (the search page) instead of truncating. */
  wrap?: boolean;
}) {
  const ItemIcon = ICONS[entry.category];
  return (
    <>
      <ItemIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn("font-medium text-foreground", !wrap && "truncate")}>
          <Highlight text={entry.title} terms={terms} />
        </span>
        <span
          className={cn(
            "text-xs text-muted-foreground in-data-[selected=true]:text-foreground/85",
            !wrap && "truncate",
          )}
        >
          {excerpt ? (
            <Highlight text={excerpt} terms={terms} />
          ) : (
            <Highlight text={entry.description} terms={terms} />
          )}
        </span>
        <span className="meta-label text-[0.6875rem] text-muted-foreground in-data-[selected=true]:text-foreground/85">
          {entry.category === "Quick link" ? "Quick link" : entry.category}
          {entry.meta ? ` · ${entry.meta}` : ""}
        </span>
      </span>
      {entry.external ? (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-muted-foreground"
          aria-label="Opens in a new tab"
        />
      ) : null}
    </>
  );
}
