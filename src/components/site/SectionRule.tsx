import { cn } from "@/lib/utils";

/** A thin numbered rule marking the start of a homepage section — the
 * editorial/architectural structural motif ("01 ─── LABEL") used in place
 * of a plain eyebrow line, on both light and dark sections. */
export function SectionRule({
  index,
  label,
  tone = "light",
}: {
  index: string;
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t pt-6",
        tone === "dark" ? "border-background/15" : "border-border",
      )}
    >
      <span
        className={cn(
          "meta-label",
          tone === "dark" ? "text-background/60" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      <span className="meta-label text-primary">{index}</span>
    </div>
  );
}
