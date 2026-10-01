import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchIndex, type SearchEntry } from "@/data/search-index";

const categoryOrder: SearchEntry["category"][] = [
  "Page",
  "Chapter",
  "Initiative",
  "Event",
  "Document",
];

const categoryLabel: Record<SearchEntry["category"], string> = {
  Page: "Pages",
  Chapter: "Chapters",
  Initiative: "Initiatives",
  Event: "Events",
  Document: "Documents",
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    const map = new Map<SearchEntry["category"], SearchEntry[]>();
    for (const entry of searchIndex) {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return map;
  }, []);

  function handleSelect(entry: SearchEntry) {
    onOpenChange(false);
    if (entry.external) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    } else {
      navigate({ to: entry.href });
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, chapters, initiatives, events and documents…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {categoryOrder.map((category) => {
          const entries = grouped.get(category);
          if (!entries?.length) return null;
          return (
            <CommandGroup key={category} heading={categoryLabel[category]}>
              {entries.map((entry) => (
                <CommandItem
                  key={`${entry.category}-${entry.title}-${entry.href}`}
                  value={`${entry.title} ${entry.description}`}
                  onSelect={() => handleSelect(entry)}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-foreground">{entry.title}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {entry.description}
                    </span>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
