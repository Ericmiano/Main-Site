import * as React from "react";

/** Small drift for an element as it scrolls through the viewport — attach the
 * returned ref to the element and apply the offset via a translateY transform.
 * Returns a static 0 for prefers-reduced-motion, so those users get no motion. */
export function useScrollParallax<T extends HTMLElement = HTMLElement>(strength = 24) {
  const ref = React.useRef<T | null>(null);
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number | null = null;
    const update = () => {
      frame = null;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Progress from -1 (just entered the bottom) to 1 (just left the top),
      // 0 when the element's center lines up with the viewport's center.
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      setOffset(progress * strength);
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
  }, [strength]);

  return { ref, offset };
}
