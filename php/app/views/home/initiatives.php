<?php
/** AAK Initiatives (src/components/home/Initiatives.tsx), leading with Grow A Classroom. */
$all = data('site', 'initiatives');
$ordered = array_merge(
    array_values(array_filter($all, function ($i) { return $i['slug'] === 'grow-a-classroom'; })),
    array_values(array_filter($all, function ($i) { return $i['slug'] !== 'grow-a-classroom'; }))
);
$featured = array_shift($ordered);
$tone = function (string $tone): string {
    return $tone === 'green' ? 'text-sustain' : 'text-primary';
};
?>
<section id="initiatives" aria-labelledby="initiatives-title" class="bg-paper-earth py-24 lg:py-32">
  <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
    <div <?= reveal('max-w-2xl') ?>>
      <?= section_rule('04', 'Initiatives') ?>
      <h2 id="initiatives-title" class="type-section mt-8 text-foreground">AAK Initiatives</h2>
      <p class="mt-5 max-w-xl text-base leading-relaxed text-foreground/70">Long-running initiatives where our members put professional expertise to work for Kenyan communities.</p>
    </div>

    <div class="mt-14 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div <?= reveal() ?>>
        <div class="wipe h-full">
          <?= initiative_link_open($featured, 'group block') ?>
            <div class="overflow-hidden bg-secondary">
              <img src="<?= e($featured['image']) ?>" alt="<?= e($featured['title']) ?> initiative" loading="lazy" class="photo-grade aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105">
            </div>
            <div class="mt-6 flex items-baseline gap-4">
              <span class="meta-label text-foreground/70">01</span>
              <span class="<?= e(cx('meta-label', $tone($featured['tone']))) ?>"><?= e($featured['eyebrow']) ?> &middot; Kenya</span>
            </div>
            <h3 class="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl"><?= e($featured['title']) ?></h3>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-foreground/70"><?= e($featured['description']) ?></p>
            <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <?= e($featured['cta']) ?>
              <?= icon('ArrowUpRight', 'h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5') ?>
            </span>
          </a>
        </div>
      </div>

      <ol class="border-t border-foreground/15">
        <?php foreach ($ordered as $i => $initiative): ?>
          <li class="border-b border-foreground/15">
            <div <?= reveal('', $i * 60) ?>>
              <?= initiative_link_open($initiative, 'group grid grid-cols-[5.5rem_1fr] items-center gap-5 py-5 sm:grid-cols-[7rem_1fr]') ?>
                <div class="overflow-hidden bg-secondary">
                  <img src="<?= e($initiative['image']) ?>" alt="" loading="lazy" class="photo-grade aspect-4/3 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110">
                </div>
                <div class="min-w-0">
                  <div class="flex items-baseline gap-3">
                    <span class="meta-label text-foreground/70"><?= str_pad((string) ($i + 2), 2, '0', STR_PAD_LEFT) ?></span>
                    <span class="<?= e(cx('meta-label truncate', $tone($initiative['tone']))) ?>"><?= e($initiative['eyebrow']) ?></span>
                  </div>
                  <h3 class="mt-1.5 flex items-center gap-2 font-display text-xl font-semibold leading-snug text-foreground">
                    <?= e($initiative['title']) ?>
                    <?= icon('ArrowUpRight', 'h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100') ?>
                  </h3>
                  <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground/70"><?= e($initiative['description']) ?></p>
                </div>
              </a>
            </div>
          </li>
        <?php endforeach; ?>
      </ol>
    </div>
  </div>
</section>
