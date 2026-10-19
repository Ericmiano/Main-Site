import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

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
  return null;
}
