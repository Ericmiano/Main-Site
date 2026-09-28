import { cn } from "@/lib/utils";

const tones = {
  light: { rule: "border-border", label: "text-muted-foreground", index: "text-foreground/45" },
  dark: { rule: "border-background/15", label: "text-background/60", index: "text-background/45" },
  // On the brand-red surface the red index would disappear.
  primary: {
    rule: "border-primary-foreground/25",
    label: "text-primary-foreground/80",
    index: "text-primary-foreground",
  },
};

/** A thin numbered rule marking the start of a homepage section — the
 * editorial/architectural structural motif ("01 ─── LABEL") used in place
 * of a plain eyebrow line, on light, dark and brand-red sections. */
export function SectionRule({
  index,
  label,
  tone = "light",
}: {
  index: string;
  label: string;
  tone?: keyof typeof tones;
}) {
  const t = tones[tone];
  return (
    <div
      data-section-index={index}
      data-section-label={label}
      className={cn("flex items-center justify-between border-t pt-6", t.rule)}
    >
      <span className={cn("meta-label", t.label)}>{label}</span>
      <span className={cn("meta-label", t.index)}>{index}</span>
    </div>
  );
}
