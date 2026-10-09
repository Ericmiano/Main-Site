import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Jump, don't glide, to the top of a new page (or its remembered spot).
    // The site-wide smooth scrolling (styles.css) would otherwise animate it,
    // and the new page building underneath could cut that short and leave
    // the reader mid-page. In-page #links still scroll smoothly.
    scrollRestorationBehavior: "instant",
    defaultPreloadStaleTime: 0,
    // Page changes crossfade, and photos with a shared view-transition-name
    // (album covers, initiative photos) carry over to the next page. Browsers
    // without the View Transitions API navigate exactly as before.
    defaultViewTransition: true,
  });

  return router;
};
