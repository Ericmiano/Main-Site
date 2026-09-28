// Exports the site's content (src/data/*.ts) to JSON for the PHP site, so
// both builds read one source of truth. Node runs the .ts files directly
// (type stripping); only plain data modules are exported here.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "php", "app", "data");
mkdirSync(outDir, { recursive: true });

const modules = [
  "site",
  "initiatives-detail",
  "grow-a-classroom",
  "report-archives",
  "chapter-councils",
  "arbitrators",
  "member-register-snapshot",
];

for (const name of modules) {
  const mod = await import(pathToFileURL(join(root, "src", "data", `${name}.ts`)).href);
  // Functions (helpers like getSortedEvents) don't serialise; PHP re-implements them.
  const data = Object.fromEntries(
    Object.entries(mod).filter(([, value]) => typeof value !== "function"),
  );
  writeFileSync(join(outDir, `${name}.json`), JSON.stringify(data, null, 1));
  console.log(`${name}.json`, Object.keys(data).join(", "));
}
