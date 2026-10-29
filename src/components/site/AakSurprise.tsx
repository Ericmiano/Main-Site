import { useEffect } from "react";
import logoMark from "@/assets/aak-logo-mark.webp";
import { prefersReducedMotion } from "@/lib/gsap";

const WORD = "aak";
const PIECES = 40;
const TAPS = 3;
const TAP_WINDOW_MS = 1200;

/** One falling piece: a miniature of the AAK emblem. */
function piece(size: number) {
  const img = document.createElement("img");
  img.src = logoMark;
  img.alt = "";
  img.width = size;
  img.height = size;
  Object.assign(img.style, {
    position: "absolute",
    top: "0",
    left: "0",
    willChange: "transform",
    filter: "drop-shadow(0 2px 3px rgb(0 0 0 / 0.18))",
  });
  return img;
}

/** The emblem, loaded once, so no piece starts out blank. */
let emblem: Promise<void> | null = null;
const emblemReady = () =>
  (emblem ??= new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = logoMark;
  }));

let running = false;

/** A shower of little AAK emblems down the screen, tidied away when it lands. */
async function shower() {
  if (running || prefersReducedMotion()) return;
  running = true;
  await emblemReady();
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
  const falls = Array.from({ length: PIECES }, () => {
    const size = 22 + Math.random() * 26;
    const el = piece(size);
    layer.appendChild(el);
    const x = Math.random() * width - size / 2;
    const drift = (Math.random() - 0.5) * 220;
    // A gentle turn: a logo whirling fast reads as a glitch.
    const spin = (Math.random() < 0.5 ? -1 : 1) * (40 + Math.random() * 200);
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
 * ([data-aak-surprise]), showers little AAK emblems down the screen. Nothing at
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
        void shower();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("[data-aak-surprise]"))
        return;
      const now = Date.now();
      taps = [...taps.filter((t) => now - t < TAP_WINDOW_MS), now];
      if (taps.length >= TAPS) {
        taps = [];
        void shower();
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
