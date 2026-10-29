import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const WORD = "aak";
const PIECES = 46;
const TAPS = 3;
const TAP_WINDOW_MS = 1200;

/** One falling piece: an AAK triangle, solid red, solid ink, or outlined. */
function piece(kind: number, size: number) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 20 18");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size * 0.9));
  svg.setAttribute("aria-hidden", "true");
  const tri = document.createElementNS(ns, "polygon");
  tri.setAttribute("points", "10,1 19,17 1,17");
  tri.setAttribute("stroke-linejoin", "round");
  if (kind === 0) tri.setAttribute("fill", "var(--primary)");
  else if (kind === 1) tri.setAttribute("fill", "var(--foreground)");
  else {
    tri.setAttribute("fill", "none");
    tri.setAttribute("stroke", "var(--primary)");
    tri.setAttribute("stroke-width", "2");
  }
  svg.appendChild(tri);
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.willChange = "transform";
  return svg;
}

let running = false;

/** A shower of AAK triangles down the screen, tidied away when it lands. */
function shower() {
  if (running || prefersReducedMotion()) return;
  running = true;
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    zIndex: "70",
    pointerEvents: "none",
    overflow: "hidden",
  });
  document.body.appendChild(layer);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const falls = Array.from({ length: PIECES }, (_, i) => {
    const size = 12 + Math.random() * 22;
    const el = piece(i % 3, size);
    layer.appendChild(el);
    const x = Math.random() * width;
    const drift = (Math.random() - 0.5) * 220;
    const spin = (Math.random() < 0.5 ? -1 : 1) * (240 + Math.random() * 480);
    return el.animate(
      [
        { transform: `translate(${x}px, ${-60 - Math.random() * 120}px) rotate(0deg)`, opacity: 1 },
        {
          transform: `translate(${x + drift}px, ${height + 60}px) rotate(${spin}deg)`,
          opacity: 0.9,
        },
      ],
      {
        duration: 2200 + Math.random() * 1800,
        delay: Math.random() * 700,
        easing: "cubic-bezier(0.25, 0.6, 0.45, 1)",
        fill: "both",
      },
    ).finished;
  });
  void Promise.allSettled(falls).then(() => {
    layer.remove();
    running = false;
  });
}

const typingInto = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/**
 * A small surprise for those who find it: typing A-A-K anywhere on the site
 * (not into a form), or tapping the footer's AAK logo three times quickly
 * ([data-aak-surprise]), showers AAK triangles down the screen. Nothing at
 * all with reduced motion. Mounted once in the root layout.
 */
export function AakSurprise() {
  useEffect(() => {
    let typed = "";
    let taps: number[] = [];
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || typingInto(event.target)) return;
      if (event.key.length !== 1) return;
      typed = (typed + event.key.toLowerCase()).slice(-WORD.length);
      if (typed === WORD) {
        typed = "";
        shower();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("[data-aak-surprise]"))
        return;
      const now = Date.now();
      taps = [...taps.filter((t) => now - t < TAP_WINDOW_MS), now];
      if (taps.length >= TAPS) {
        taps = [];
        shower();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
