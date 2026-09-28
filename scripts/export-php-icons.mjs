// Renders the Tabler icons the site uses to SVG path markup for the PHP
// templates (php/app/lib/icons.php wraps them in an <svg>). Add a name here
// when a template needs a new icon, then re-run `npm run build:php-data`.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as tabler from "@tabler/icons-react";

const names = [
  "AlertTriangle", "ArrowLeft", "ArrowRight", "ArrowUpRight", "Award", "BuildingSkyscraper",
  "Calendar", "CalendarPlus", "CashBanknote", "Check", "ChevronDown", "ChevronLeft",
  "ChevronRight", "ChevronUp", "Circle", "CircleCheck", "Clock", "Copy", "Dots",
  "FileDownload", "FileText", "Gavel", "HeartHandshake", "Mail", "MapPin", "MessageCircle",
  "Minus", "News", "Phone", "Photo", "School", "Search", "ShieldCheck", "Trophy", "User",
  "UserCheck", "Users", "UsersGroup", "X", "BuildingArch", "Calculator", "Map2", "Helmet",
  "Trees", "Leaf", "Crane", "Armchair", "BuildingCommunity",
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = {};
for (const name of names) {
  const Icon = tabler[`Icon${name}`];
  if (!Icon) throw new Error(`No Tabler icon named Icon${name}`);
  const svg = renderToStaticMarkup(createElement(Icon));
  // Keep only the inner shapes; the PHP helper supplies the <svg> wrapper.
  out[name] = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
}
mkdirSync(join(root, "php", "app", "data"), { recursive: true });
writeFileSync(join(root, "php", "app", "data", "icons.json"), JSON.stringify(out));
console.log(`icons.json: ${names.length} icons`);
