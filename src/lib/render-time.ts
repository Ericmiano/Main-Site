/**
 * The moment the page was rendered: the build time for the prebuilt pages
 * (recorded on <html data-render-time> by __root), now for anything rendered
 * later. Time-dependent lists (which events are still ahead) use it so the
 * browser's first render matches the prebuilt HTML; anything that has ended
 * since is hidden by TIMED_HIDE_SCRIPT, not by re-filtering the list.
 */
export function renderTime(): number {
  if (typeof document === "undefined") return Date.now();
  const recorded = Number(document.documentElement.dataset["renderTime"]);
  return Number.isFinite(recorded) && recorded > 0 ? recorded : Date.now();
}
