import { cn } from "@/lib/utils";

const tones = {
  // foreground/70 clears 4.5:1 on both the paper and earth surfaces.
  light: { rule: "border-border", label: "text-foreground/70", index: "text-foreground/70" },
  dark: { rule: "border-background/15", label: "text-background/65", index: "text-background/65" },
  // On the brand-red surface the red index would disappear.
  primary: {
    rule: "border-primary-foreground/25",
    label: "text-primary-foreground",
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
