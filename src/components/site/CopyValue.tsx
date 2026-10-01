import { useState } from "react";
import { IconCheck as Check, IconCopy as Copy } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/** A labelled value (an M-Pesa Paybill or account) that copies on tap. */
export function CopyValue({
  label,
  value,
  dark,
}: {
  label: string;
  value: string;
  dark?: boolean;
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
      <p className={cn("meta-label", dark ? "text-background/60" : "text-muted-foreground")}>
        {label}
      </p>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()} ${value}`}
        className="group mt-1 inline-flex items-center gap-2.5"
      >
        <span className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
          {value}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold transition-opacity",
            dark ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </span>
      </button>
    </div>
  );
}
