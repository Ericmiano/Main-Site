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
      <div className="max-w-2xl">
        <div
          className={cn(
            "flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] text-primary",
            bold ? "font-extrabold" : "font-semibold",
          )}
        >
          {index ? (
            <span aria-hidden="true" className="font-accent italic text-muted-foreground">
              {index}
            </span>
          ) : (
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
          )}
          <span>{eyebrow}</span>
        </div>
        <h2
          className={cn(
            "mt-4 font-display text-4xl leading-[0.98] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl",
            bold ? "font-bold" : "font-semibold",
          )}
        >
          {title}
        </h2>
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
