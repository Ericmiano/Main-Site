import { useEffect, useRef, type DependencyList, type RefObject } from "react";
import { MOTION_OK, prefersReducedMotion, whenMotionReady, type GsapKit } from "@/lib/gsap";

/**
 * Runs `setup` once GSAP is ready (after the reader's first interaction; see
 * whenMotionReady), inside a gsap.matchMedia scoped to `scope`. Everything it
 * creates (tweens, ScrollTriggers, SplitTexts) is reverted on unmount, when
 * `deps` change, and whenever the visitor turns on "reduce motion". `setup`
 * may return an extra cleanup for anything GSAP doesn't own (listeners).
 *
 * Only style changes belong here, never structural DOM changes to React
 * markup, so hydration is never at risk.
 */
export function useGsap<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: (kit: GsapKit, el: T) => void | (() => void),
  deps: DependencyList = [],
) {
  // Always call the latest setup without re-running on every render.
  const latest = useRef(setup);
  latest.current = setup;

  useEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;
    let alive = true;
    let revert: (() => void) | undefined;
    void whenMotionReady().then((kit) => {
      if (!alive) return;
      const mm = kit.gsap.matchMedia(el);
      mm.add(MOTION_OK, () => latest.current(kit, el));
      revert = () => mm.revert();
    });
    return () => {
      alive = false;
      revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-supplied deps
  }, deps);
}
