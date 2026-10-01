// Post-processing for the cPanel (static Apache) build.
//
// Apache serves /404.html for any missing address. The prerendered /404 page
// carries the app's hydration state for "/404", which fails the router's
// consistency check when shown at a different URL, so the 404 page is
// published as plain HTML: same markup and styles, no app scripts.
import { readFileSync, writeFileSync } from "node:fs";

const src = "dist/client/404/index.html";
const html = readFileSync(src, "utf8")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/gi, "");

writeFileSync("dist/client/404.html", html);
console.log(`cpanel-postbuild: wrote dist/client/404.html (${html.length} bytes, scripts stripped)`);
