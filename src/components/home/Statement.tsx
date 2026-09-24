import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

const FROM = ["We", "shape", "the", "places", "where", "life", "happens."];
const TO = ["Across", "every", "discipline", "of", "the", "built", "environment."];

const TYPE =
  "font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl";

function Word({
  progress,
  range,
  direction,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  direction: "in" | "out";
  children: string;
}) {
  const out = direction === "out";
  const opacity = useTransform(progress, range, out ? [1, 0] : [0, 1]);
  const y = useTransform(progress, range, out ? ["0em", "-0.35em"] : ["0.35em", "0em"]);
  const filter = useTransform(
    progress,
    range,
    out ? ["blur(0px)", "blur(10px)"] : ["blur(10px)", "blur(0px)"],
  );
  return (
    <motion.span style={{ opacity, y, filter }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

/** One full copy of the morphing sentence; rendered twice (dark and light)
 * so the hand-off to the light Chapters section is a theme-safe crossfade. */
function Scene({ progress, className }: { progress: MotionValue<number>; className: string }) {
  return (
    <div className={cn("flex h-full items-center", className)}>
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className={cn("grid max-w-5xl [&>*]:col-start-1 [&>*]:row-start-1", TYPE)}>
          <p>
            {FROM.map((word, i) => (
              <Word
                key={word + i}
                progress={progress}
                range={[0.2 + i * 0.03, 0.36 + i * 0.03]}
                direction="out"
              >
                {word}
              </Word>
            ))}
          </p>
          <p>
            {TO.map((word, i) => (
              <Word
                key={word + i}
                progress={progress}
                range={[0.48 + i * 0.035, 0.62 + i * 0.035]}
                direction="in"
              >
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
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  // A function transform opts out of motion's native ScrollTimeline
  // acceleration, which ignores this sticky track's offsets for opacity/filter.
  const progress = useTransform(scrollYProgress, (v) => v);
  const lightOpacity = useTransform(progress, [0.86, 1], [0, 1]);

  return (
    <section ref={track} aria-label="AAK statement" className="relative h-[200vh] lg:h-[240vh]">
      <p className="sr-only">
        We shape the places where life happens, across every discipline of the built environment.
      </p>
      <div aria-hidden="true" className="sticky top-0 h-svh overflow-hidden">
        <Scene progress={progress} className="bg-ink-deep text-background" />
        <motion.div style={{ opacity: lightOpacity }} className="absolute inset-0">
          <Scene progress={progress} className="bg-background text-foreground" />
        </motion.div>
      </div>
    </section>
  );
}

export function Statement() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
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
