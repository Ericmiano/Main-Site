import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconX as X,
} from "@tabler/icons-react";

import { gsapIfLoaded, prefersReducedMotion, type GsapKit } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (direction: -1 | 1) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  /** The thumbnail of the photo on show, so the photo can grow out of it on
   * open and shrink back into it on close. Called at those moments. */
  origin?: () => Element | null;
}

/**
 * Transform + clip that make the lightbox image sit exactly over `thumb`:
 * scaled uniformly to the thumbnail's width, centred on it, and cropped top
 * and bottom to its height. Tweening from/to these grows the photo out of
 * (or back into) the thumbnail.
 */
function thumbnailPose(img: HTMLElement, thumb: Element) {
  const to = thumb.getBoundingClientRect();
  const from = img.getBoundingClientRect();
  const scale = to.width / from.width;
  const crop = Math.max(0, (from.height * scale - to.height) / 2 / scale);
  return {
    x: to.left + to.width / 2 - (from.left + from.width / 2),
    y: to.top + to.height / 2 - (from.top + from.height / 2),
    scale,
    clipPath: `inset(${crop}px 0px ${crop}px 0px)`,
  };
}

const onScreen = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
};

export function Lightbox({
  open,
  onOpenChange,
  onNavigate,
  title,
  children,
  className,
  origin,
}: LightboxProps) {
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);
  const overlay = React.useRef<HTMLDivElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const closing = React.useRef(false);
  const direction = React.useRef<-1 | 0 | 1>(0);
  // GSAP drives open/close once it has loaded (on the reader's first
  // interaction) and the thumbnail is on screen; otherwise the CSS fade and
  // zoom run as before.
  const [animated, setAnimated] = React.useState(false);

  // Latest props for callbacks that outlive a render (the panel's ref).
  const latest = React.useRef({ origin });
  latest.current = { origin };
  const openRun = React.useRef<{ cancelled: boolean } | null>(null);
  // Where focus goes back to on close: the thumbnail of the photo on show.
  const returnFocus = React.useRef<Element | null>(null);

  const kitFor = (): GsapKit | null =>
    latest.current.origin && !prefersReducedMotion() ? gsapIfLoaded() : null;

  /** Everything around the photo: backdrop, buttons, caption. */
  const surroundings = (box: HTMLElement) => {
    const dialog = box.closest('[role="dialog"]');
    return {
      chrome: [
        overlay.current ?? dialog?.previousElementSibling,
        ...(dialog?.querySelectorAll("button") ?? []),
      ].filter(Boolean) as Element[],
      caption: [...box.querySelectorAll("img ~ *, figcaption")],
    };
  };

  /** Grow the photo out of its thumbnail. Called as the panel mounts, before
   * the first paint (Radix's portal mounts content a commit after `open`). */
  const animateOpen = (box: HTMLDivElement) => {
    const kit = kitFor();
    const thumb = latest.current.origin?.();
    const img = box.querySelector("img");
    if (!kit || !thumb || !img || !onScreen(thumb)) return;
    setAnimated(true);
    const { gsap } = kit;
    const { chrome, caption } = surroundings(box);
    const run = { cancelled: false };
    openRun.current = run;
    // Nothing shows until the photo has a size to measure.
    gsap.set([box, ...chrome], { autoAlpha: 0 });

    const play = () => {
      if (run.cancelled) return;
      gsap.set(box, {
        autoAlpha: 1,
        backgroundColor: "transparent",
        borderColor: "transparent",
        overflow: "visible",
      });
      gsap.set(caption, { autoAlpha: 0 });
      gsap
        .timeline()
        .from(img, {
          ...thumbnailPose(img, thumb),
          duration: 0.75,
          ease: "expo.out",
          clearProps: "transform,clipPath",
        })
        .to(chrome, { autoAlpha: 1, duration: 0.4 }, 0)
        .set(box, { clearProps: "backgroundColor,borderColor,overflow" }, 0.5)
        .to(caption, { autoAlpha: 1, duration: 0.3 }, 0.5);
    };

    if (img.complete && img.naturalWidth > 0) play();
    else {
      // Give the full-size photo a moment; if it's slow, just show it.
      const wait = new Promise((resolve) => window.setTimeout(resolve, 400));
      void Promise.race([img.decode().catch(() => undefined), wait]).then(() => {
        if (run.cancelled) return;
        if (img.naturalWidth > 0) play();
        else gsap.set([box, ...chrome], { autoAlpha: 1 });
      });
    }
  };

  const panelRef = React.useCallback((node: HTMLDivElement | null) => {
    panel.current = node;
    if (openRun.current) openRun.current.cancelled = true;
    openRun.current = null;
    if (node) animateOpen(node);
    // animateOpen reads live values through refs; the ref must stay stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!open) setAnimated(false);
  }, [open]);

  // Paging: the next photo slides in from the side the reader moved toward.
  React.useEffect(() => {
    const dir = direction.current;
    direction.current = 0;
    const kit = open && dir !== 0 && !prefersReducedMotion() ? gsapIfLoaded() : null;
    const img = panel.current?.querySelector("img");
    if (!kit || !img) return;
    kit.gsap.fromTo(
      img,
      { x: 48 * dir, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.out",
        clearProps: "transform,opacity,visibility",
      },
    );
  }, [title, open]);

  const navigate = (dir: -1 | 1) => {
    direction.current = dir;
    onNavigate(dir);
  };

  // Closing shrinks the photo back into its thumbnail, when that's on screen.
  const handleOpenChange = (next: boolean) => {
    if (next || closing.current) return onOpenChange(next);
    returnFocus.current = origin?.()?.closest("button, a") ?? null;
    const kit = kitFor();
    const thumb = origin?.();
    const box = panel.current;
    const img = box?.querySelector("img");
    if (!kit || !thumb || !box || !img || !onScreen(thumb)) return onOpenChange(false);
    closing.current = true;
    const { gsap } = kit;
    const { chrome, caption } = surroundings(box);
    const pose = thumbnailPose(img, thumb);
    gsap
      .timeline({
        onComplete: () => {
          closing.current = false;
          onOpenChange(false);
        },
      })
      .to(caption, { autoAlpha: 0, duration: 0.15 })
      .set(box, { backgroundColor: "transparent", borderColor: "transparent", overflow: "visible" })
      .to(img, { ...pose, duration: 0.55, ease: "expo.inOut" }, 0.1)
      .to(chrome, { autoAlpha: 0, duration: 0.45 }, 0.1);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          ref={overlay}
          className={cn(
            "fixed inset-0 z-50 bg-foreground/90",
            !animated &&
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          ref={content}
          onCloseAutoFocus={(event) => {
            const target = returnFocus.current;
            returnFocus.current = null;
            if (target instanceof HTMLElement && target.isConnected) {
              event.preventDefault();
              target.focus({ preventScroll: true });
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              navigate(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              navigate(1);
            }
          }}
          onTouchStart={(event) => {
            const t = event.touches[0];
            touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            const t = event.changedTouches[0];
            touchStart.current = null;
            if (!start || !t) return;
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            // Only a clearly horizontal swipe pages; vertical drags still scroll the panel.
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none sm:p-8"
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <div className="relative flex w-full max-w-3xl items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center border border-border bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={panelRef}
              data-state={open ? "open" : "closed"}
              className={cn(
                "max-h-[85vh] w-full overflow-y-auto border border-border bg-background",
                !animated &&
                  "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                className,
              )}
            >
              {children}
            </div>

            <button
              type="button"
              onClick={() => navigate(1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center border border-border bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between sm:hidden">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center border border-border bg-background/90 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
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
