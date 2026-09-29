import type { gsap as GsapCore } from "gsap";
import type { Flip as FlipType } from "gsap/Flip";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextType } from "gsap/SplitText";

export interface GsapKit {
  gsap: typeof GsapCore;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
}

/** Media query every GSAP effect runs under (via gsap.matchMedia), so turning
 * on "reduce motion" reverts them all, even mid-visit. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

let kit: Promise<GsapKit> | null = null;
let loaded: GsapKit | null = null;

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
    loaded = { gsap: core.gsap, ScrollTrigger: st.ScrollTrigger, SplitText: split.SplitText };
    return loaded;
  });
  return kit;
}

/** The kit if it has already loaded, for event handlers that shouldn't wait. */
export const gsapIfLoaded = () => loaded;

let flip: Promise<typeof FlipType> | null = null;
let flipLoaded: typeof FlipType | null = null;

/** Flip (~12KB) only loads on pages that use it: lightboxes and filters. */
export function loadFlip(): Promise<typeof FlipType> {
  flip ??= Promise.all([loadGsap(), import("gsap/Flip")]).then(([{ gsap }, mod]) => {
    gsap.registerPlugin(mod.Flip);
    flipLoaded = mod.Flip;
    return mod.Flip;
  });
  return flip;
}

/** Flip if it has already loaded (see gsapIfLoaded). */
export const flipIfLoaded = () => flipLoaded;

/** Pages with Flip effects call this on mount: Flip arrives with GSAP itself,
 * on the reader's first interaction, so it's ready before the first click. */
export function preloadFlip() {
  if (prefersReducedMotion()) return;
  void whenMotionReady().then(loadFlip);
}

let intent: Promise<GsapKit> | null = null;

/**
 * Resolves with the kit once the reader first interacts (scroll, wheel,
 * touch, key or pointer press) or, failing that, once the page has sat idle
 * for a few seconds. Effects that only matter below the fold wait for this,
 * so GSAP never competes with the page's startup.
 */
export function whenMotionReady(): Promise<GsapKit> {
  intent ??= new Promise<void>((resolve) => {
    const TRIGGERS = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"] as const;
    let idle: number | undefined;
    const fallback = window.setTimeout(() => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go);
      else go();
    }, 6000);
    function go() {
      for (const type of TRIGGERS) window.removeEventListener(type, go);
      window.clearTimeout(fallback);
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      resolve();
    }
    for (const type of TRIGGERS) window.addEventListener(type, go, { passive: true });
  }).then(loadGsap);
  return intent;
}

export const prefersReducedMotion = () =>
  typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
