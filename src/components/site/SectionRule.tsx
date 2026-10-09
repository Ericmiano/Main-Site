import { cn } from "@/lib/utils";

const tones = {
  // foreground/70 clears 4.5:1 on both the paper and earth surfaces.
  light: { rule: "bg-border", label: "text-foreground/70", index: "text-foreground/70" },
  dark: { rule: "bg-background/15", label: "text-background/65", index: "text-background/65" },
  // On the brand-red surface the red index would disappear.
  primary: {
    rule: "bg-primary-foreground/25",
    label: "text-primary-foreground",
    index: "text-primary-foreground",
  },
};

/** A thin numbered rule marking the start of a homepage section — the
 * editorial/architectural structural motif ("01 ─── LABEL") used in place
 * of a plain eyebrow line, on light, dark and brand-red sections. The rule
 * is its own element (`data-rule-line`) so MotionLayer can draw it across,
 * scrubbed to the scroll, as the section arrives. */
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
      className="relative flex items-center justify-between pt-6"
    >
      <span
        aria-hidden="true"
        data-rule-line
        className={cn("absolute inset-x-0 top-0 h-px origin-left", t.rule)}
      />
      <span className={cn("meta-label", t.label)}>{label}</span>
      <span className={cn("meta-label", t.index)}>{index}</span>
    </div>
  );
}
