import type { Snake404Options } from "@/components/ui/snake-404";

/**
 * The 404 page's snake game, shared by the app's NotFound screen and the
 * cPanel build's plain-HTML /404.html, which starts the game with its own
 * small script (src/not-found-snake-static.ts, see scripts/cpanel-postbuild.mjs).
 */
export const NOT_FOUND_SNAKE: Snake404Options = {
  code: "404",
  // AAK red (--aak-red).
  color: "#B71727",
  cellSize: 14,
  // The idle demo's pace; a player starts slower and speeds up (levels).
  speed: 10,
  levels: true,
  // Short words, so they still fit the game on a phone.
  levelWords: ["AAK", "CPD", "CAD"],
  theme: "light",
};
