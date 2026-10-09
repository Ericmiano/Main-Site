import { InfoDialogHost } from "@/components/info/InfoDialogHost";
import { MotionLayer } from "@/components/site/MotionLayer";
import { NotFound } from "@/components/site/NotFound";
import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="group btn-primary justify-center"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const CF_BEACON_TOKEN = import.meta.env["VITE_CF_BEACON_TOKEN"] as string | undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Architectural Association of Kenya" },
      {
        name: "description",
        content:
          "The professional body for Kenya's built and natural environment practitioners since 1967.",
      },
      { property: "og:site_name", content: "Architectural Association of Kenya" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://aak.or.ke/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // Fonts are self-hosted (src/fonts.css); preload the two the first screen uses.
      {
        rel: "preload",
        href: "/fonts/libre-baskerville-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/ibm-plex-sans-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
    ],
    // Cloudflare Web Analytics: set VITE_CF_BEACON_TOKEN at build time to switch it on.
    scripts: CF_BEACON_TOKEN
      ? [
          {
            src: "https://static.cloudflareinsights.com/beacon.min.js",
            defer: true,
            "data-cf-beacon": JSON.stringify({ token: CF_BEACON_TOKEN }),
          },
        ]
      : [],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <InfoDialogHost />
      <MotionLayer />
    </>
  );
}
