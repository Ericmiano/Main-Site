import { useEffect } from "react";
import { MOTION_OK, prefersReducedMotion, whenMotionReady, type GsapKit } from "@/lib/gsap";

const RULES = "[data-rule-line]";
const PARALLAX = "[data-parallax]";
const DRAWINGS = ".arch-drawing";

/** React attaches its fiber to a DOM node once it has hydrated (or rendered) it. */
const isHydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber$"));

const belowFold = (el: Element) => el.getBoundingClientRect().top >= window.innerHeight;

/**
 * Site-wide GSAP enhancements, mounted once in the root layout. All of them
 * are tied to the scroll position rather than fired on a timer, and text is
 * never animated: motion is kept for lines and photographs.
 *
 * - Section rules (`[data-rule-line]`, SectionRule) draw across, left to
 *   right, as their section comes up the screen.
 * - Architectural line drawings (`.arch-drawing`) draw themselves in step
 *   with the scroll, through the CSS variable `--draw`.
 * - `[data-parallax="40"]` images drift gently over their container's scroll.
 *
 * Content is complete without it. Only elements that are still below the
 * fold when GSAP starts are ever hidden, so nothing on screen jumps. GSAP
 * loads on the reader's first interaction (whenMotionReady); reduced-motion
 * visitors never load it, and turning the setting on mid-visit reverts it all
 * (gsap.matchMedia). New route content is picked up by a MutationObserver.
 */
export function MotionLayer() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let alive = true;
    let revert: (() => void) | undefined;

    void whenMotionReady().then((kit) => {
      if (!alive) return;
      const mm = kit.gsap.matchMedia();
      mm.add(MOTION_OK, () => startEnhancing(kit));
      revert = () => mm.revert();
    });

    return () => {
      alive = false;
      revert?.();
    };
  }, []);

  return null;
}

/** Enhances the page now and as routes change; returns the teardown. */
function startEnhancing({ gsap, ScrollTrigger }: GsapKit) {
  let timer: number | undefined;
  const cleanups = new Map<Element, () => void>();

  const enhance = () => {
    // Forget elements a route change has removed.
    for (const [el, undo] of cleanups) {
      if (!el.isConnected) {
        undo();
        cleanups.delete(el);
      }
    }

    let pending = false;
    const ready = (el: Element) => {
      if (cleanups.has(el)) return false;
      // Route sections hydrate in stages; changing server HTML React hasn't
      // claimed yet causes a hydration mismatch. Wait until it has.
      if (!isHydrated(el)) {
        pending = true;
        return false;
      }
      return true;
    };

    for (const line of document.querySelectorAll<HTMLElement>(RULES)) {
      if (!ready(line)) continue;
      // Already on screen: leave it drawn rather than make it flicker.
      if (!belowFold(line)) {
        cleanups.set(line, () => {});
        continue;
      }
      const tween = gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          // clamp(): rules near the foot of the page still finish drawing.
          scrollTrigger: {
            trigger: line,
            start: "clamp(top 96%)",
            end: "clamp(top 62%)",
            scrub: 0.4,
          },
        },
      );
      cleanups.set(line, () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(line, { clearProps: "transform" });
      });
    }

    for (const drawing of document.querySelectorAll<SVGElement>(DRAWINGS)) {
      if (!ready(drawing)) continue;
      // Drawings in the first screen draw themselves on load in CSS
      // (.arch-drawing-intro); only those further down follow the scroll.
      if (!belowFold(drawing)) {
        cleanups.set(drawing, () => {});
        continue;
      }
      const progress = { draw: 0 };
      const apply = () => drawing.style.setProperty("--draw", String(progress.draw));
      const tween = gsap.to(progress, {
        draw: 1,
        ease: "none",
        onUpdate: apply,
        scrollTrigger: {
          trigger: drawing,
          start: "clamp(top 92%)",
          end: "clamp(center 45%)",
          scrub: 0.5,
        },
      });
      apply();
      cleanups.set(drawing, () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        drawing.style.removeProperty("--draw");
      });
    }

    for (const img of document.querySelectorAll<HTMLElement>(PARALLAX)) {
      if (!ready(img)) continue;
      // Half the authored strength: a drift you sense rather than watch.
      const strength = (Number(img.dataset["parallax"]) || 24) / 2;
      // The element's static CSS offset (its no-JS resting place) would
      // stack with GSAP's transform, so drop it while the tween drives it.
      img.style.translate = "none";
      const tween = gsap.fromTo(
        img,
        { y: -strength * 2 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement ?? img,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
      cleanups.set(img, () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        img.style.translate = "";
      });
    }

    ScrollTrigger.refresh();
    // Hydration doesn't change the DOM, so the observer won't see it finish.
    if (pending) {
      window.clearTimeout(timer);
      timer = window.setTimeout(enhance, 250);
    }
  };

  enhance();
  // Lazy photos and embeds lengthen the page after the triggers are measured;
  // re-measure when the page's height changes so late triggers still fire.
  let lastHeight = document.body.scrollHeight;
  let refreshTimer: number | undefined;
  const resize = new ResizeObserver(() => {
    const height = document.body.scrollHeight;
    if (Math.abs(height - lastHeight) < 40) return;
    lastHeight = height;
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  resize.observe(document.body);
  // Route changes and lazily rendered sections add new content.
  const observer = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(enhance, 120);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    resize.disconnect();
    window.clearTimeout(timer);
    window.clearTimeout(refreshTimer);
    for (const undo of cleanups.values()) undo();
    cleanups.clear();
  };
}
