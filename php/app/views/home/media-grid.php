<?php
/**
 * The archive: a rail on phones, a mosaic from sm up, and a lightbox
 * (src/components/home/MediaGrid.tsx). Each plate opens the shared
 * lightbox <dialog>; site.js reads the plate's data-lightbox-* fields.
 */
$media = data('site', 'media');
$plate = function (int $i): string {
    return 'Plate ' . str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT);
};
?>
<section id="media" aria-labelledby="media-title" class="bg-ink-deep py-24 lg:py-32">
  <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
    <div <?= reveal('max-w-2xl') ?>>
      <?= section_rule('06', 'The archive', 'dark') ?>
      <h2 id="media-title" class="type-section mt-8 text-background">Work, events and award-winning projects.</h2>
      <p class="mt-5 max-w-xl text-base leading-relaxed text-background/70">A rolling record of what members are building, the sites we visit and the projects recognised at the Awards of Excellence.</p>
    </div>

    <div data-rail="media" data-lightbox-group="media" class="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
      <?php foreach ($media as $i => $item): $lead = $i === 0; ?>
        <div <?= reveal(cx('w-[82%] shrink-0 snap-start sm:w-auto', $lead ? 'sm:col-span-3 lg:col-span-5' : ''), ($i % 3) * 80) ?>>
          <?php if ($lead): ?><div class="wipe h-full"><?php endif; ?>
          <button type="button" data-lightbox-item
                  data-lightbox-image="<?= e($item['image']) ?>"
                  data-lightbox-title="<?= e($item['title']) ?>"
                  data-lightbox-meta="<?= e($plate($i) . ' / ' . $item['category']) ?>"
                  data-lightbox-caption="<?= e($item['caption'] ?? '') ?>"
                  data-lightbox-href="<?= e($item['href'] ?? '') ?>"
                  data-lightbox-href-label="<?= e($item['hrefLabel'] ?? 'View') ?>"
                  class="group relative flex h-full w-full flex-col overflow-hidden bg-card text-left">
            <div class="overflow-hidden bg-secondary">
              <img src="<?= e($item['image']) ?>" alt="<?= e($item['title']) ?>" loading="lazy" class="<?= e(cx('aspect-4/3 w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105', $lead ? 'sm:aspect-video' : '')) ?>">
            </div>
            <div class="flex flex-1 flex-col justify-end gap-2 px-5 py-5">
              <span class="meta-label text-muted-foreground"><?= e($plate($i)) ?> &nbsp;/&nbsp; <?= e($item['category']) ?></span>
              <h3 class="<?= e(cx('font-display font-semibold leading-snug text-foreground', $lead ? 'text-2xl sm:text-3xl' : 'text-lg')) ?>"><?= e($item['title']) ?></h3>
            </div>
          </button>
          <?php if ($lead): ?></div><?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php require APP_DIR . '/views/lightbox.php'; ?>
