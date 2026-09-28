<?php
/** Awards of Excellence spotlight (src/components/home/Spotlight.tsx). */
$winners = data('site', 'awardWinners2024');
$rank = ['Winner', '1st Runner-up', 'Runner-up', '2nd Runner-up'];
$featured = array_values(array_filter($winners, function ($w) use ($rank) {
    return in_array($w['result'], $rank, true);
}));
// Winners first; usort isn't stable before PHP 8, so sort on (group, position).
$keyed = array_map(null, $featured, array_keys($featured));
usort($keyed, function ($a, $b) {
    return [(int) ($a[0]['result'] !== 'Winner'), $a[1]] <=> [(int) ($b[0]['result'] !== 'Winner'), $b[1]];
});
$featured = array_column($keyed, 0);
$categories = data('site', 'awardCategories');
$slide = 'w-[78%] shrink-0 snap-start sm:w-72 lg:w-80';
?>
<section aria-labelledby="spotlight-title" class="bg-background pt-20 pb-28 lg:pt-28 lg:pb-36">
  <div <?= reveal('mx-auto max-w-[1400px] px-6 lg:px-12') ?>>
    <div class="flex items-end justify-between gap-6 pb-4">
      <p class="meta-label text-muted-foreground">Awards of Excellence &middot; 2024 winners</p>
      <div class="flex gap-2">
        <button type="button" data-rail-prev="spotlight" aria-label="Previous winners" class="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary sm:flex"><?= icon('ArrowLeft') ?></button>
        <button type="button" data-rail-next="spotlight" aria-label="More winners" class="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary sm:flex"><?= icon('ArrowRight') ?></button>
      </div>
    </div>

    <ol data-rail="spotlight" data-rail-interval="3000" data-rail-seamless class="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] lg:mr-[-3rem] lg:ml-0 lg:pl-0 lg:pr-12">
      <?php foreach ([0, 1] as $copy): $hide = $copy ? ' aria-hidden="true" inert' : ''; ?>
        <?php foreach ($featured as $winner): ?>
          <li class="<?= $slide ?>"<?= $hide ?>>
            <a href="<?= e($winner['pdfHref']) ?>" target="_blank" rel="noopener noreferrer" class="group flex h-full flex-col bg-card shadow-xl ring-1 ring-foreground/5">
              <div class="overflow-hidden bg-secondary">
                <img src="<?= e($winner['image']) ?>" alt="<?= e($winner['project'] . ', ' . $winner['category']) ?>" loading="lazy" class="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105">
              </div>
              <div class="flex flex-1 flex-col gap-2 p-5">
                <span class="<?= e(cx('meta-label', $winner['result'] === 'Winner' ? 'text-primary' : 'text-muted-foreground')) ?>"><?= e($winner['result']) ?></span>
                <h3 class="font-display text-lg font-semibold leading-snug text-balance text-foreground"><?= e($winner['project']) ?></h3>
                <p class="mt-auto pt-2 text-xs leading-relaxed text-muted-foreground"><?= e($winner['category']) ?></p>
              </div>
            </a>
          </li>
        <?php endforeach; ?>
        <li class="<?= $slide ?>"<?= $hide ?>>
          <a href="/awards" class="group flex h-full min-h-72 flex-col justify-between bg-ink-deep p-6 text-background shadow-xl">
            <span class="meta-label text-background/60"><?= count($winners) ?> recognised projects</span>
            <span class="font-display text-2xl font-semibold leading-tight">
              See every winner, runner-up and honourable mention
              <?= icon('ArrowUpRight', 'ml-2 inline h-5 w-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5') ?>
            </span>
          </a>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>

  <div class="mx-auto grid max-w-[1400px] gap-14 px-6 pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-12 lg:pt-20">
    <div <?= reveal('max-w-2xl lg:sticky lg:top-[calc(var(--header-h,5rem)+var(--register-h,0px)+2rem)] lg:self-start') ?>>
      <div class="meta-label text-muted-foreground">In the spotlight &middot; Awards of Excellence</div>
      <h2 id="spotlight-title" class="type-section mt-5 text-foreground">
        AAK &ndash; Basco DuraCoat <span class="font-accent italic font-medium">Awards of Excellence</span> in Architecture
      </h2>
      <p class="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
        Hosted by the Architects Chapter, the Awards of Excellence recognise outstanding architectural achievement across Kenya and East Africa. The 2026 cycle covers projects completed between 2020 and 2025 across nine categories, from Best Residential and Commercial to Best Student Project.
      </p>
      <div class="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
        <a href="/awards" class="group btn-primary">See the winning projects <?= icon('ArrowRight') ?></a>
        <a href="/chapters/architects" class="link-quiet text-foreground">About the Architects Chapter</a>
      </div>
    </div>

    <div>
      <div class="flex items-baseline justify-between border-b border-border pb-4">
        <span class="meta-label text-muted-foreground">The categories</span>
        <span class="meta-label text-muted-foreground">Projects completed 2020&ndash;2025</span>
      </div>
      <ol class="grid grid-cols-1 sm:grid-cols-3">
        <?php foreach ($categories as $i => $category): ?>
          <li class="border-b border-border sm:border-r sm:[&:nth-child(3n)]:border-r-0">
            <div <?= reveal('h-full', ($i % 3) * 70) ?>>
              <a href="/awards" class="group flex h-full flex-row items-baseline gap-4 px-0 py-4 transition-colors hover:bg-secondary/60 sm:min-h-40 sm:flex-col sm:justify-between sm:gap-6 sm:p-5">
                <span class="font-display text-sm text-primary"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
                <span class="font-display text-lg font-semibold leading-snug text-balance text-foreground"><?= e(preg_replace('/^Best /', '', $category['name'])) ?></span>
              </a>
            </div>
          </li>
        <?php endforeach; ?>
      </ol>
    </div>
  </div>
</section>
