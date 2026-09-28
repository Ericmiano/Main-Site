import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  /** Only pass this when the eyebrow genuinely marks a position in an ordered
   * sequence the reader needs (e.g. a numbered process step). Most sections
   * aren't a sequence, so omit it. */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
  action?: ReactNode;
  /** Bumps eyebrow and title to a heavier weight, for pages that want the section labels to read stronger. */
  bold?: boolean;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
  action,
  bold,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn("flex flex-col gap-7 md:flex-row md:items-end md:justify-between", className)}
    >
      <div className="max-w-2xl flex-1">
        {/* Same thin numbered rule as the homepage's SectionRule. */}
        <div className="flex items-center justify-between border-t border-border pt-5">
          <span
            className={cn(
              "meta-label text-muted-foreground",
              bold && "font-extrabold text-foreground",
            )}
          >
            {eyebrow}
          </span>
          {index ? (
            <span aria-hidden="true" className="meta-label text-muted-foreground">
              {index}
            </span>
          ) : null}
        </div>
        <h2 className={cn("type-section mt-7 text-foreground", bold && "font-bold")}>{title}</h2>
        {description ? (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}
