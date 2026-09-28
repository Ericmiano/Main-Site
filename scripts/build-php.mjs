// Builds the PHP site's generated files in place:
//   php/app/data/*.json         content + icons exported from src/
//   php/public/assets/img/*     images the React build imports from src/assets
//   php/public/assets/css/site.css  Tailwind, scanning the PHP templates
// Run `npm run build:php`; package for cPanel with `npm run package:php`.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });

run("node", ["scripts/export-php-data.mjs"]);
run("node", ["scripts/export-php-icons.mjs"]);

const imgOut = join(root, "php", "public", "assets", "img");
mkdirSync(imgOut, { recursive: true });
for (const file of readdirSync(join(root, "src", "assets"))) {
  if (/\.webp$/i.test(file)) copyFileSync(join(root, "src", "assets", file), join(imgOut, file));
}

run("npx", ["@tailwindcss/cli", "-i", "php/css/site.css", "-o", "php/public/assets/css/site.css", "--minify"]);
console.log("PHP site built.");
