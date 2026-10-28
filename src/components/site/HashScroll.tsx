import { useEffect } from "react";
import { useLocation, useRouter } from "@tanstack/react-router";

/**
 * Takes the reader to the section named in the address (/team#secretariat-title,
 * /#latest, a search result's section…) on any page. The router opens new
 * pages at the top, so this jumps on once the page is drawn, and once more
 * after late layout settles. Jumps rather than glides: a long smooth scroll
 * gets cut short.
 */
export function HashScroll() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const hash = useLocation({ select: (location) => location.hash });
  const router = useRouter();
  useEffect(() => {
    if (!hash) return;
    const jump = () =>
      document
        .getElementById(decodeURIComponent(hash))
        ?.scrollIntoView({ block: "start", behavior: "instant" });
    const frame = requestAnimationFrame(jump);
    const settle = window.setTimeout(jump, 350);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [pathname, hash]);

  // A link to the page already open (Contact us in the footer while on
  // /contact) would leave the reader where they are: the router "navigates"
  // to the same page and puts the scroll position back. Go to the top of the
  // page instead, once the router is done (or after a moment, if the router
  // took no part). Jumps: a glide gets undone near the top as the header
  // grows back, and on the homepage by the scroll animations re-measuring
  // the page after the menu closes.
  useEffect(() => {
    let fallback = 0;
    const toTop = () => {
      window.clearTimeout(fallback);
      fallback = 0;
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.hash ||
        url.pathname.replace(/\/$/, "") !== window.location.pathname.replace(/\/$/, "") ||
        url.search !== window.location.search
      ) {
        return;
      }
      window.clearTimeout(fallback);
      fallback = window.setTimeout(toTop, 400);
    };
    const stop = router.subscribe("onRendered", () => {
      if (fallback) toTop();
    });
    document.addEventListener("click", onClick);
    return () => {
      stop();
      window.clearTimeout(fallback);
      document.removeEventListener("click", onClick);
    };
  }, [router]);
  return null;
}
