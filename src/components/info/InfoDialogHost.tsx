import { useEffect, useRef, useState, type ComponentType } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconX as X } from "@tabler/icons-react";
import { infoDocByPath, infoDocs, type InfoDocKey } from "@/components/info/docs";
import { DraftNotice } from "@/components/site/InfoPage";

/**
 * Opens FAQs, Accessibility, Privacy, Terms and Cookies as a pop-up instead
 * of navigating. Any same-site link to one of those paths is intercepted
 * (footer, map note, links between the notices), so the links stay plain
 * `<a href>`s: modified clicks, no-JS visitors and the static 404 page still
 * reach the standalone pages.
 */
export function InfoDialogHost() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState<InfoDocKey | null>(null);
  const [Body, setBody] = useState<ComponentType | null>(null);
  // Set when a link in the pop-up leads elsewhere on the site: the pop-up
  // closes and the page changes, so focus shouldn't jump back to the link
  // that opened it (that would scroll the new page to the footer).
  const leaving = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) {
        return;
      }
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const next = infoDocByPath(url.pathname);
      if (!next) {
        // Any other page on the site, linked from inside the pop-up (e.g.
        // "the events page" in an FAQ answer): close it and let the router
        // navigate, rather than leave it covering the new page.
        if (link.closest("[data-info-dialog]")) {
          leaving.current = true;
          setOpen(false);
        }
        return;
      }
      // Capture phase, so this runs before the router's own link handler,
      // which then sees defaultPrevented and leaves the page alone.
      event.preventDefault();
      setKey(next);
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!key) return;
    let alive = true;
    setBody(null);
    void infoDocs[key].load().then((mod) => {
      if (alive) setBody(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, [key]);

  const doc = key ? infoDocs[key] : null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          data-info-dialog
          onCloseAutoFocus={(event) => {
            if (!leaving.current) return;
            leaving.current = false;
            event.preventDefault();
          }}
          className="fixed top-1/2 left-1/2 z-[60] flex max-h-[88svh] w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-background shadow-2xl outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {doc ? (
            <>
              <header className="border-b border-border px-6 pt-6 pb-5 pr-16 sm:px-8 sm:pt-8">
                <p className="meta-label text-muted-foreground">Last updated {doc.updated}</p>
                <DialogPrimitive.Title className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                  {doc.title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {doc.intro}
                </DialogPrimitive.Description>
              </header>
              <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
                {doc.draft ? <DraftNotice className="mb-8" /> : null}
                {Body ? (
                  <div className="info-prose">
                    <Body />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground" role="status">
                    Loading&hellip;
                  </p>
                )}
              </div>
            </>
          ) : null}
          <DialogPrimitive.Close
            className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
