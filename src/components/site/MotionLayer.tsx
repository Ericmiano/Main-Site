import { useEffect } from "react";
import { loadGsap, prefersReducedMotion, type GsapKit } from "@/lib/gsap";

const HEADINGS = "main h2.type-section";
const PARALLAX = "[data-parallax]";

/** React attaches its fiber to a DOM node once it has hydrated (or rendered) it. */
const isHydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber$"));

/**
 * Site-wide GSAP enhancements, mounted once in the root layout:
 *
 * - Section headings (`h2.type-section`) rise into view line by line from a
 *   mask as they scroll in. Headings already on screen when they appear are
 *   left alone, so nothing visible ever jumps.
 * - `[data-parallax="40"]` images drift over their container's scroll,
 *   scrubbed to the scroll position.
 *
 * Content is complete without it: GSAP loads after hydration, reduced-motion
 * visitors never load it, and new route content is picked up by a
 * MutationObserver as it renders.
 */
export function MotionLayer() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let alive = true;
    let observer: MutationObserver | undefined;
    let timer: number | undefined;
    const cleanups = new Map<Element, () => void>();

    const enhance = ({ gsap, ScrollTrigger, SplitText }: GsapKit) => {
      // Forget elements a route change has removed.
      for (const [el, undo] of cleanups) {
        if (!el.isConnected) {
          undo();
          cleanups.delete(el);
        }
      }

      let pending = false;
      for (const heading of document.querySelectorAll<HTMLElement>(HEADINGS)) {
        if (cleanups.has(heading)) continue;
        // Route sections hydrate in stages; splitting server HTML React hasn't
        // claimed yet causes a hydration mismatch. Wait until it has.
        if (!isHydrated(heading)) {
          pending = true;
          continue;
        }
        // On screen already (or above it): animating would make it jump.
        if (heading.getBoundingClientRect().top < window.innerHeight) {
          cleanups.set(heading, () => {});
          continue;
        }
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true, // re-split when fonts load or the width changes
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: heading, start: "top 90%", once: true },
            }),
        });
        cleanups.set(heading, () => split.revert());
      }

      for (const img of document.querySelectorAll<HTMLElement>(PARALLAX)) {
        if (cleanups.has(img)) continue;
        if (!isHydrated(img)) {
          pending = true;
          continue;
        }
        const strength = Number(img.dataset["parallax"]) || 24;
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
        timer = window.setTimeout(() => alive && enhance({ gsap, ScrollTrigger, SplitText }), 250);
      }
    };

    // Everything here animates content below the fold, so GSAP (~50KB and a
    // few hundred ms of work on a mid-range phone) waits for the reader's
    // first scroll or keypress instead of competing with the page's startup.
    const TRIGGERS = ["scroll", "wheel", "touchstart", "keydown"] as const;
    let idle: number | undefined;
    // No interaction yet: start anyway once the page has settled.
    const fallback = window.setTimeout(() => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start);
      else start();
    }, 6000);
    const start = () => {
      for (const type of TRIGGERS) window.removeEventListener(type, start);
      window.clearTimeout(fallback);
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (!alive) return;
      void loadGsap().then((kit) => {
        if (!alive) return;
        enhance(kit);
        // Route changes and lazily rendered sections add new headings.
        observer = new MutationObserver(() => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => alive && enhance(kit), 120);
        });
        observer.observe(document.body, { childList: true, subtree: true });
      });
    };
    for (const type of TRIGGERS) window.addEventListener(type, start, { passive: true });

    return () => {
      alive = false;
      for (const type of TRIGGERS) window.removeEventListener(type, start);
      window.clearTimeout(fallback);
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      observer?.disconnect();
      window.clearTimeout(timer);
      for (const undo of cleanups.values()) undo();
      cleanups.clear();
    };
  }, []);

  return null;
}
