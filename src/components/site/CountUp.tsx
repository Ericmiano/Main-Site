import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, whenMotionReady } from "@/lib/gsap";

interface CountUpProps {
  /** Final value to count up to. */
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  /** Set false to skip the thousands separator — years shouldn't get one. */
  grouped?: boolean;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function CountUp({
  value,
  duration = 1400,
  className,
  prefix = "",
  suffix = "",
  grouped = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Start at the real value, not 0 — SSR output and no-JS clients must see
  // the true figure, not a placeholder zero. The count-up (below) briefly
  // counts back up to this same value.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    let alive = true;
    let stop: (() => void) | undefined;

    // On screen at load: count straight away with a tiny rAF loop, so GSAP
    // isn't pulled into the page's startup just for this.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const start = performance.now();
      let frame = 0;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setDisplay(Math.round(value * easeOutExpo(progress)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }

    // Further down: GSAP counts it up as it scrolls into view, on the same
    // expo-out curve as the site's other entrances.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void whenMotionReady().then(({ gsap }) => {
          if (!alive) return;
          const count = { n: 0 };
          const tween = gsap.to(count, {
            n: value,
            duration: duration / 1000,
            ease: "expo.out",
            onUpdate: () => setDisplay(Math.round(count.n)),
          });
          stop = () => tween.kill();
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      alive = false;
      observer.disconnect();
      stop?.();
      setDisplay(value);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {grouped ? display.toLocaleString() : display}
      {suffix}
    </span>
  );
}
