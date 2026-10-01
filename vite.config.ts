// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `npm run build:cpanel` exports every page as static HTML for Apache/cPanel
// hosting (no Node.js there); the default build still targets Cloudflare.
const cpanel = process.argv.includes("cpanel") || process.env["BUILD_TARGET"] === "cpanel";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(cpanel
      ? {
          prerender: {
            enabled: true,
            crawlLinks: true,
            autoSubfolderIndex: true,
            failOnError: true,
            // Only render pages. The crawler would otherwise fetch linked PDFs
            // through the renderer and write them back corrupted. Arbitration
            // is on hold, so it isn't exported either.
            filter: ({ path }: { path: string }) =>
              path === "/sitemap.xml" ||
              (!/\.[a-z0-9]+$/i.test(path) && path !== "/arbitration"),
          },
          pages: [{ path: "/sitemap.xml" }],
        }
      : {}),
  },
  // Nitro's server bundle isn't needed for a static export; TanStack Start's
  // own prerenderer writes the HTML to dist/client, which is what gets uploaded.
  ...(cpanel ? { nitro: false as const } : {}),
  vite: {
    server: {
      // Allow access via the Cloudflare quick tunnel used for temporary prototype previews.
      allowedHosts: [".trycloudflare.com"],
    },
  },
});
