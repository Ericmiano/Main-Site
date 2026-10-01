import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * Auto-advances a horizontally scrolling list one item at a time and loops
 * back to the start after the last item. Holds still while the visitor is
 * hovering, touching or keyboard-focused inside it, while it's off screen or
 * the tab is hidden, and never runs for
 * prefers-reduced-motion. Does nothing when the list doesn't overflow
 * (e.g. when it becomes a grid at larger breakpoints).
 *
 * `seamless`: the list's children are two identical copies of the items. The
 * rail then keeps moving forward forever, silently jumping back one copy's
 * width when it reaches the second copy, instead of rewinding to the start.
 */
export function useAutoRail<T extends HTMLElement>(
  ref: RefObject<T | null>,
  intervalMs = 4500,
  { seamless = false }: { seamless?: boolean } = {},
) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const busy = useRef({ hover: false, focus: false, touch: false, hidden: false, offscreen: true });

  const step = useCallback(
    (direction: 1 | -1) => {
      const el = ref.current;
      if (!el || el.scrollWidth <= el.clientWidth + 4) return;
      const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
      const max = el.scrollWidth - el.clientWidth;
      const items = [...el.children] as HTMLElement[];
      const origin = items[0]?.offsetLeft ?? 0;
      const lefts = items.map((item) => item.offsetLeft - origin);

      if (seamless) {
        const period = lefts[items.length / 2] ?? 0;
        if (period > 0) {
          // Instant jump between identical positions, then the smooth step.
          if (direction === 1 && el.scrollLeft >= period - 4)
            el.scrollTo({ left: el.scrollLeft - period, behavior: "auto" });
          if (direction === -1 && el.scrollLeft <= 4)
            el.scrollTo({ left: el.scrollLeft + period, behavior: "auto" });
          const at = el.scrollLeft;
          const target =
            direction === 1
              ? lefts.find((l) => l > at + 4)
              : [...lefts].reverse().find((l) => l < at - 4);
          el.scrollTo({ left: Math.max(0, Math.min(target ?? 0, max)), behavior });
          return;
        }
      }

      if (direction === 1) {
        if (el.scrollLeft >= max - 4) return el.scrollTo({ left: 0, behavior });
        const next = lefts.find((l) => l > el.scrollLeft + 4);
        el.scrollTo({ left: Math.min(next ?? max, max), behavior });
      } else {
        if (el.scrollLeft <= 4) return el.scrollTo({ left: max, behavior });
        const prev = [...lefts].reverse().find((l) => l < el.scrollLeft - 4);
        el.scrollTo({ left: Math.max(prev ?? 0, 0), behavior });
      }
    },
    [ref, reducedMotion, seamless],
  );

  // A visitor swiping into the second copy is moved back to the same card in
  // the first copy once scrolling settles, so they never reach an end.
  useEffect(() => {
    const el = ref.current;
    if (!el || !seamless) return;
    let settle: number | undefined;
    const normalise = () => {
      const items = [...el.children] as HTMLElement[];
      const mid = items[items.length / 2];
      const period = mid ? mid.offsetLeft - (items[0]?.offsetLeft ?? 0) : 0;
      if (period > 0 && el.scrollLeft >= period - 2)
        el.scrollTo({ left: el.scrollLeft - period, behavior: "auto" });
    };
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(normalise, 180);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settle);
      el.removeEventListener("scroll", onScroll);
    };
  }, [ref, seamless]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const b = busy.current;
    let touchTimer: number | undefined;

    const onEnter = () => (b.hover = true);
    const onLeave = () => (b.hover = false);
    const onFocusIn = () => (b.focus = true);
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node | null)) b.focus = false;
    };
    const onTouchStart = () => {
      b.touch = true;
      window.clearTimeout(touchTimer);
    };
    // Give a swiping visitor time to look before the rail moves again.
    const onTouchEnd = () => {
      window.clearTimeout(touchTimer);
      touchTimer = window.setTimeout(() => (b.touch = false), 6000);
    };
    const onVisibility = () => (b.hidden = document.visibilityState !== "visible");
    const io = new IntersectionObserver(([entry]) => (b.offscreen = !entry?.isIntersecting), {
      threshold: 0.4,
    });

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    io.observe(el);
    return () => {
      window.clearTimeout(touchTimer);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [ref]);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      const b = busy.current;
      if (b.hover || b.focus || b.touch || b.hidden || b.offscreen) return;
      step(1);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [reducedMotion, intervalMs, step]);

  return { next: () => step(1), prev: () => step(-1) };
}
