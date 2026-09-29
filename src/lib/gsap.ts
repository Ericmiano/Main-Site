import type { gsap as GsapCore } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextType } from "gsap/SplitText";

export interface GsapKit {
  gsap: typeof GsapCore;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
}

let kit: Promise<GsapKit> | null = null;

/**
 * GSAP + ScrollTrigger + SplitText, loaded on first use rather than in the
 * main bundle: every animation here is an enhancement over content that is
 * already visible, so the page never waits for it.
 */
export function loadGsap(): Promise<GsapKit> {
  kit ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/SplitText"),
  ]).then(([core, st, split]) => {
    core.gsap.registerPlugin(st.ScrollTrigger, split.SplitText);
    return { gsap: core.gsap, ScrollTrigger: st.ScrollTrigger, SplitText: split.SplitText };
  });
  return kit;
}

export const prefersReducedMotion = () =>
  typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
