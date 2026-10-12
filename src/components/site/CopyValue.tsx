import { useState } from "react";
import { IconCheck as Check, IconCopy as Copy } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/** A labelled value (an M-Pesa Paybill or account) that copies on tap. */
export function CopyValue({
  label,
  value,
  dark,
  onRed,
}: {
  label: string;
  value: string;
  dark?: boolean;
  /** On the brand-red surface: near-white text that keeps AA contrast. */
  onRed?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the value stays visible to type.
    }
  };
  return (
    <div>
      <p
        className={cn(
          "meta-label",
          onRed
            ? "text-primary-foreground/90"
            : dark
              ? "text-background/60"
              : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <button type="button" onClick={copy} className="group mt-1 inline-flex items-center gap-2.5">
        <span className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
          {value}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold transition-opacity",
            onRed
              ? "text-primary-foreground/90"
              : dark
                ? "text-background/70"
                : "text-muted-foreground",
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          {/* The spoken name keeps the visible words first: "988 567 Copy paybill". */}
          <span className="sr-only">{label.toLowerCase()}</span>
        </span>
      </button>
    </div>
  );
}
