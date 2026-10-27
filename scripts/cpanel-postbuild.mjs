// Post-processing for the cPanel (static Apache) build.
//
// Apache serves /404.html for any missing address. The prerendered /404 page
// carries the app's hydration state for "/404", which fails the router's
// consistency check when shown at a different URL, so the 404 page is
// published as plain HTML: same markup and styles, no app scripts. Its snake
// game gets a small script of its own instead (/snake-404.js).
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { build } from "rolldown";

await build({
  input: "src/not-found-snake-static.ts",
  resolve: { alias: { "@": path.resolve("src") } },
  // Only the game engine is used; the React component beside it isn't.
  treeshake: { moduleSideEffects: false },
  output: { file: "dist/client/snake-404.js", format: "esm", minify: true },
  logLevel: "warn",
});

const src = "dist/client/404/index.html";
const html = readFileSync(src, "utf8")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/gi, "")
  .replace("</body>", '<script type="module" src="/snake-404.js"></script></body>');

writeFileSync("dist/client/404.html", html);
const game = readFileSync("dist/client/snake-404.js").length;
console.log(
  `cpanel-postbuild: wrote dist/client/404.html (${html.length} bytes, app scripts stripped) and snake-404.js (${game} bytes)`,
);
