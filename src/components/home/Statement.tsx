import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

const FROM = ["We", "shape", "the", "places", "where", "life", "happens."];
const TO = ["Across", "every", "discipline", "of", "the", "built", "environment."];

const TYPE =
  "font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl";

/** A word that fades, drifts and blurs across its slice [a, b] of the
 * track's scroll progress. The maths lives in CSS (`.morph-word` in
 * styles.css), driven by the `--p` variable the track writes on scroll. */
function Word({
  range: [a, b],
  direction,
  children,
}: {
  range: [number, number];
  direction: "in" | "out";
  children: string;
}) {
  return (
    <span
      className="morph-word"
      data-dir={direction}
      style={{ "--a": a, "--b": b } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** One full copy of the morphing sentence; rendered twice (dark and light)
 * so the hand-off to the light Chapters section is a theme-safe crossfade. */
function Scene({ className }: { className: string }) {
  return (
    <div className={cn("flex h-full items-center", className)}>
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className={cn("grid max-w-5xl [&>*]:col-start-1 [&>*]:row-start-1", TYPE)}>
          <p>
            {FROM.map((word, i) => (
              <Word key={word + i} range={[0.2 + i * 0.03, 0.36 + i * 0.03]} direction="out">
                {word}
              </Word>
            ))}
          </p>
          <p>
            {TO.map((word, i) => (
              <Word key={word + i} range={[0.48 + i * 0.035, 0.62 + i * 0.035]} direction="in">
                {word}
              </Word>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatementMorph() {
  const track = useRef<HTMLElement>(null);

  // Scroll progress through the track, 0 when its top meets the viewport's
  // top and 1 when its bottom meets the viewport's bottom.
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    let frame: number | null = null;
    let last = -1;
    const update = () => {
      frame = null;
      const rect = node.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      // Offscreen the value pins at 0 or 1; skip the style write then.
      if (p === last) return;
      last = p;
      node.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={track} aria-label="AAK statement" className="relative h-[160vh] lg:h-[180vh]">
      <p className="sr-only">
        We shape the places where life happens, across every discipline of the built environment.
      </p>
      <div aria-hidden="true" className="sticky top-0 h-svh overflow-hidden">
        <Scene className="bg-ink-deep text-background" />
        <div className="morph-light absolute inset-0">
          <Scene className="bg-background text-foreground" />
        </div>
      </div>
    </section>
  );
}

export function Statement() {
  // The server can't know the setting, so the first client render must match
  // its morph markup; swap to the static version once mounted.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return (
      <section aria-label="AAK statement" className="bg-ink-deep py-32 lg:py-48">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <Reveal>
            <p className={cn("max-w-4xl text-balance text-background", TYPE)}>
              We shape the places where life happens.
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  return <StatementMorph />;
}
