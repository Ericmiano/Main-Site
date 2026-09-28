<?php
/** Feature firm showcase (src/components/home/FeaturedFirm.tsx). */
$firm = data('site', 'featuredFirm');
?>
<section aria-labelledby="featured-firm-title" class="bg-ink-deep py-24 text-background lg:py-32">
  <div class="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16 lg:px-12">
    <div <?= reveal('lg:self-center') ?>>
      <p class="meta-label flex items-center justify-between border-t border-background/15 pt-6 text-background/60">
        <span>Feature firm &middot; Showcase</span>
        <span class="text-[oklch(0.75_0.13_38.5)]">Member firm</span>
      </p>
      <h2 id="featured-firm-title" class="type-section mt-8"><?= e($firm['name']) ?></h2>
      <p class="mt-5 max-w-md text-base leading-relaxed text-background/75"><?= e($firm['intro']) ?></p>
      <figure class="mt-8 max-w-sm">
        <img src="<?= e($firm['photo']['src']) ?>" alt="<?= e($firm['photo']['alt']) ?>" loading="lazy" class="aspect-4/3 w-full object-cover object-top">
        <figcaption class="meta-label mt-3 text-background/55"><?= e($firm['photo']['caption']) ?></figcaption>
      </figure>
    </div>

    <ul class="grid gap-3 sm:grid-cols-2">
      <?php foreach ($firm['projects'] as $i => $project): ?>
        <li class="<?= $i === 0 ? 'sm:col-span-2' : '' ?>">
          <div <?= reveal('h-full', $i * 70) ?>>
            <?php if ($i === 0): ?><div class="wipe h-full"><?php endif; ?>
            <figure class="group relative h-full overflow-hidden bg-background/5">
              <img src="<?= e($project['image']) ?>" alt="<?= e($project['name']) ?>" loading="lazy" class="<?= e(cx('photo-grade w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105', $i === 0 ? 'aspect-video' : 'aspect-4/3')) ?>">
              <figcaption class="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-deep/85 to-transparent p-5 pt-16 text-background">
                <p class="font-display text-xl font-semibold"><?= e($project['name']) ?></p>
                <p class="meta-label mt-2 text-background/75"><?= e(implode(' · ', array_column($project['facts'], 'value'))) ?></p>
              </figcaption>
            </figure>
            <?php if ($i === 0): ?></div><?php endif; ?>
          </div>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
