<?php
/**
 * Shared photo lightbox (src/components/site/Lightbox.tsx) as a native
 * <dialog>: focus trapping, Esc and the backdrop come from the browser.
 * site.js fills it from the clicked [data-lightbox-item] and pages through
 * its [data-lightbox-group] with the arrows, arrow keys or a swipe.
 * Include once per page that has lightbox items.
 */
if (!empty($GLOBALS['lightbox_rendered'])) {
    return;
}
$GLOBALS['lightbox_rendered'] = true;
?>
<dialog data-lightbox aria-labelledby="lightbox-title" class="m-0 h-full max-h-none w-full max-w-none bg-transparent p-4 backdrop:bg-foreground/90 sm:p-8">
  <div class="flex h-full items-center justify-center">
    <div class="relative flex w-full max-w-3xl items-center gap-2 sm:gap-4">
      <button type="button" data-lightbox-prev aria-label="Previous" class="hidden h-11 w-11 shrink-0 items-center justify-center border border-border bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"><?= icon('ChevronLeft', 'h-5 w-5') ?></button>
      <!-- Photo-set mode (Grow A Classroom): image, caption and a counter. -->
      <figure data-lightbox-photo hidden class="max-h-[85vh] w-full overflow-y-auto border border-border bg-background">
        <img data-lightbox-photo-img src="" alt="" class="max-h-[75vh] w-full bg-ink-deep object-contain">
        <figcaption class="flex items-baseline justify-between gap-4 px-5 py-4 text-sm text-muted-foreground">
          <span data-lightbox-photo-caption></span>
          <span data-lightbox-photo-count class="meta-label shrink-0"></span>
        </figcaption>
      </figure>
      <!-- Media mode (homepage archive): image, plate label, title, caption, link. -->
      <div data-lightbox-media class="max-h-[85vh] w-full overflow-y-auto border border-border bg-background">
        <img data-lightbox-img src="" alt="" class="max-h-[60vh] w-full bg-secondary object-cover">
        <div class="flex flex-col gap-3 px-6 py-6 sm:px-8 sm:py-7">
          <span data-lightbox-meta-out class="meta-label text-muted-foreground"></span>
          <h3 id="lightbox-title" data-lightbox-title-out class="font-display text-xl font-semibold leading-snug text-foreground"></h3>
          <p data-lightbox-caption-out class="text-sm leading-relaxed text-muted-foreground"></p>
          <a data-lightbox-link href="#" target="_blank" rel="noopener noreferrer" hidden class="group mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <span data-lightbox-link-label>View</span><?= icon('ArrowUpRight', 'h-4 w-4 text-primary') ?>
          </a>
        </div>
      </div>
      <button type="button" data-lightbox-next aria-label="Next" class="hidden h-11 w-11 shrink-0 items-center justify-center border border-border bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"><?= icon('ChevronRight', 'h-5 w-5') ?></button>
      <button type="button" data-lightbox-close aria-label="Close" class="absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:-right-2"><?= icon('X', 'h-5 w-5') ?></button>
    </div>
  </div>
</dialog>
