import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  /** Also draw this element in via a left-to-right scaleX, e.g. for a
   * horizontal rule under a section heading. */
  ruleDraw?: boolean;
  /** Uncover top-down with a clip-path wipe, for photographs. */
  wipe?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  ruleDraw = false,
  wipe = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // "static": rendered visible, as the server sends it, so content shows on
  // first paint without waiting for JavaScript. Only elements that start
  // below the fold are hidden ("armed") after hydration and faded in when
  // they scroll into view; anything already on screen just stays put.
  const [phase, setPhase] = useState<"static" | "armed" | "shown">("static");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    setPhase("armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPhase("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 80px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const animated = phase !== "static";
  const shown = phase === "shown";

  return (
    <Tag
      ref={ref}
      style={animated ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        animated && "reveal",
        shown && "reveal-in",
        animated && ruleDraw && "rule-draw",
        ruleDraw && shown && "rule-draw-in",
        className,
      )}
    >
      {wipe ? (
        // The clip lives on an inner wrapper: a fully clipped observed element
        // never counts as intersecting, so the wipe would never start.
        <div className={cn("h-full", animated && "wipe", shown && "wipe-in")}>{children}</div>
      ) : (
        children
      )}
    </Tag>
  );
}
