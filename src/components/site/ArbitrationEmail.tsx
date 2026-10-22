import { useState } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { arbitrationRequestMailto, arbitrationRequestWebmail } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The arbitration request email: the visitor's mail app first, then Gmail,
 * Outlook on the web, or the whole email copied, for anyone without a mail app
 * (a mailto link does nothing there). Each carries the cc and the checklist.
 */
export function ArbitrationEmail({
  label,
  center,
  className,
}: {
  label: string;
  center?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(arbitrationRequestWebmail.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", center ? "items-center" : "items-start", className)}>
      <a href={arbitrationRequestMailto} className="group btn-primary">
        {label}
        <ArrowUpRight className="h-4 w-4" />
      </a>
      <p className="text-sm text-muted-foreground">
        No email app?{" "}
        <a
          href={arbitrationRequestWebmail.gmail}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-foreground"
        >
          Open in Gmail
        </a>
        {" · "}
        <a
          href={arbitrationRequestWebmail.outlook}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-foreground"
        >
          Outlook on the web
        </a>
        {" · "}
        <button type="button" onClick={copy} className="link-underline text-foreground">
          {copied ? "Copied" : "Copy the email"}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Email copied to the clipboard" : ""}
        </span>
      </p>
    </div>
  );
}
