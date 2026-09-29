import { useEffect } from "react";
import { MOTION_OK, prefersReducedMotion, whenMotionReady, type GsapKit } from "@/lib/gsap";

const HEADINGS = "main h2.type-section";
const PARALLAX = "[data-parallax]";
const STAGGER = "[data-stagger]";

/** React attaches its fiber to a DOM node once it has hydrated (or rendered) it. */
const isHydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber$"));

const belowFold = (el: Element) => el.getBoundingClientRect().top >= window.innerHeight;

/**
 * Site-wide GSAP enhancements, mounted once in the root layout:
 *
 * - Section headings (`h2.type-section`) rise into view line by line from a
 *   mask as they scroll in.
 * - `[data-parallax="40"]` images drift over their container's scroll,
 *   scrubbed to the scroll position.
 * - The children of a `[data-stagger]` list (card grids) come in row by row:
 *   ScrollTrigger.batch groups the cards that enter together and staggers
 *   them, instead of each card fading in on its own.
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
function startEnhancing({ gsap, ScrollTrigger, SplitText }: GsapKit) {
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

    for (const heading of document.querySelectorAll<HTMLElement>(HEADINGS)) {
      if (!ready(heading)) continue;
      // On screen already (or above it): animating would make it jump.
      if (!belowFold(heading)) {
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
      if (!ready(img)) continue;
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

    for (const list of document.querySelectorAll<HTMLElement>(STAGGER)) {
      if (!ready(list)) continue;
      const items = [...list.children].filter(belowFold) as HTMLElement[];
      if (!items.length) {
        cleanups.set(list, () => {});
        continue;
      }
      gsap.set(items, { autoAlpha: 0, y: 32 });
      const triggers = ScrollTrigger.batch(items, {
        start: "top 94%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });
      cleanups.set(list, () => {
        for (const trigger of triggers) trigger.kill();
        gsap.set(items, { clearProps: "opacity,visibility,transform" });
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
  // Route changes and lazily rendered sections add new content.
  const observer = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(enhance, 120);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    window.clearTimeout(timer);
    for (const undo of cleanups.values()) undo();
    cleanups.clear();
  };
}
