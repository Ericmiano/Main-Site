<?php
/** Origin (src/components/home/Origin.tsx). */
$moments = [
    [1967, 'AAK is established', false],
    [8, 'Professional chapters', false],
    [3, 'Regional branches', false],
    [59, 'Years of excellence', false],
];
?>
<section id="origin" aria-labelledby="origin-title" class="bg-background py-28 lg:py-40">
  <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
    <div <?= reveal() ?>>
      <?= section_rule('01', 'Origin') ?>
      <h2 id="origin-title" class="type-section mt-8 max-w-3xl text-foreground">The people who shape Kenya.</h2>
    </div>
    <div <?= reveal('mt-14 border-t border-border lg:mt-20', 120, true) ?>>
      <dl class="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 sm:grid-cols-4 lg:pt-12">
        <?php foreach ($moments as [$value, $label, $grouped]): ?>
          <div>
            <dt class="sr-only"><?= e($label) ?></dt>
            <dd>
              <span data-countup="<?= $value ?>"<?= $grouped ? ' data-grouped' : '' ?> class="block font-display text-4xl font-semibold tabular-nums text-foreground sm:text-5xl"><?= $value ?></span>
              <span class="meta-label mt-2 block text-muted-foreground"><?= e($label) ?></span>
            </dd>
          </div>
        <?php endforeach; ?>
      </dl>
    </div>
  </div>
</section>
