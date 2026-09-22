import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconX as X,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (direction: -1 | 1) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Lightbox({
  open,
  onOpenChange,
  onNavigate,
  title,
  children,
  className,
}: LightboxProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              onNavigate(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              onNavigate(1);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none sm:p-8"
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <div className="relative flex w-full max-w-3xl items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center border border-border bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              className={cn(
                "max-h-[85vh] w-full overflow-y-auto border border-border bg-background duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                className,
              )}
            >
              {children}
            </div>

            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center border border-border bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between sm:hidden">
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center border border-border bg-background/90 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="inline-flex h-10 w-10 items-center justify-center border border-border bg-background/90 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <DialogPrimitive.Close
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-border bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
