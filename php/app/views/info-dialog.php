<?php
/**
 * Pop-up for FAQs, Accessibility, Privacy, Terms and Cookies
 * (src/components/info/InfoDialogHost.tsx). site.js intercepts same-site
 * links to those paths, fetches `<path>?fragment=1` and shows it here; the
 * links stay plain hrefs, so modified clicks and no-JS visitors still get
 * the standalone pages.
 */
$infoPaths = array_column(info_docs(), 'path');
?>
<dialog data-info-dialog data-info-paths="<?= e(implode(' ', $infoPaths)) ?>" aria-labelledby="info-dialog-title"
        class="m-auto max-h-[88svh] w-[min(48rem,calc(100vw-2rem))] max-w-none flex-col overflow-hidden rounded-2xl bg-background p-0 text-foreground shadow-2xl backdrop:bg-foreground/60 backdrop:backdrop-blur-sm open:flex">
  <header class="border-b border-border px-6 pt-6 pr-16 pb-5 sm:px-8 sm:pt-8">
    <p data-info-updated class="meta-label text-muted-foreground"></p>
    <h2 id="info-dialog-title" data-info-title class="mt-3 font-display text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl"></h2>
    <p data-info-intro class="mt-2 text-sm leading-relaxed text-muted-foreground"></p>
  </header>
  <div class="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
    <div data-info-draft hidden><?= draft_notice('mb-8') ?></div>
    <div data-info-body class="info-prose"><p class="text-sm text-muted-foreground" role="status">Loading&hellip;</p></div>
  </div>
  <button type="button" data-info-close aria-label="Close" class="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
    <?= icon('X', 'h-5 w-5') ?>
  </button>
</dialog>
