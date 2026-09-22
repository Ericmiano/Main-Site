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
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  ruleDraw = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 80px 0px" },
    );
    observer.observe(node);
    // Elements already in the viewport at mount (e.g. above the fold, or a fast
    // programmatic scroll the observer's first callback hasn't landed for yet)
    // shouldn't stay invisible — check synchronously as a fallback.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      observer.disconnect();
    }
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "reveal",
        shown && "reveal-in",
        ruleDraw && "rule-draw",
        ruleDraw && shown && "rule-draw-in",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
