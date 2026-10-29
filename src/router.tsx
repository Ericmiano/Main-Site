import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    // No remembered spots: every page opens at the top, after Back, Forward
    // and a reload too (HashScroll does it, jumping rather than gliding; an
    // address that names a section goes to that section).
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
    // Page changes crossfade, and photos with a shared view-transition-name
    // (album covers, initiative photos) carry over to the next page. Browsers
    // without the View Transitions API navigate exactly as before.
    defaultViewTransition: true,
  });

  return router;
};
