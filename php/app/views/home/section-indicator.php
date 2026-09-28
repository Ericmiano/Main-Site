<?php
/**
 * Floating "04 / 07 · Initiatives" marker and jump menu, desktop only
 * (src/components/home/SectionIndicator.tsx). site.js builds the list from
 * the page's [data-section-index] rules and keeps it current on scroll.
 */
?>
<nav data-section-indicator aria-label="Page sections" inert class="pointer-events-none fixed bottom-6 left-6 z-40 hidden translate-y-3 opacity-0 transition-[opacity,transform] duration-300 data-[visible=true]:pointer-events-auto data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 lg:block">
  <ol data-section-list hidden class="mb-2 min-w-60 bg-ink-deep/95 py-2 text-background shadow-2xl backdrop-blur-md"></ol>
  <button type="button" data-section-toggle aria-expanded="false" class="group flex items-center gap-3 bg-ink-deep/90 px-4 py-3 text-background shadow-xl backdrop-blur-md transition-colors hover:bg-ink-deep">
    <span data-section-current-index class="meta-label text-[oklch(0.75_0.13_38.5)]"></span>
    <span data-section-total class="meta-label text-background/45"></span>
    <span data-section-current-label class="text-sm font-medium"></span>
    <?= icon('ChevronUp', 'h-4 w-4 rotate-180 transition-transform duration-300 group-aria-expanded:rotate-0') ?>
  </button>
</nav>
