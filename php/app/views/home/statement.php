<?php
/**
 * Scroll-driven statement morph (src/components/home/Statement.tsx). site.js
 * writes the track's scroll progress to --p; .morph-word in design.css does
 * the rest. Reduced-motion visitors get the static sentence (site.js swaps
 * in the <template>).
 */
$from = ['We', 'shape', 'the', 'places', 'where', 'life', 'happens.'];
$to = ['Across', 'every', 'discipline', 'of', 'the', 'built', 'environment.'];
$type = 'font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl';

$scene = function (string $class) use ($from, $to, $type): void { ?>
  <div class="<?= e(cx('flex h-full items-center', $class)) ?>">
    <div class="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
      <div class="<?= e(cx('grid max-w-5xl [&>*]:col-start-1 [&>*]:row-start-1', $type)) ?>">
        <p><?php foreach ($from as $i => $word): ?><span class="morph-word" data-dir="out" style="--a: <?= 0.2 + $i * 0.03 ?>; --b: <?= 0.36 + $i * 0.03 ?>"><?= e($word) ?></span><?php endforeach; ?></p>
        <p><?php foreach ($to as $i => $word): ?><span class="morph-word" data-dir="in" style="--a: <?= 0.48 + $i * 0.035 ?>; --b: <?= 0.62 + $i * 0.035 ?>"><?= e($word) ?></span><?php endforeach; ?></p>
      </div>
    </div>
  </div>
<?php };
?>
<section data-statement aria-label="AAK statement" class="relative h-[160vh] lg:h-[180vh]">
  <p class="sr-only">We shape the places where life happens, across every discipline of the built environment.</p>
  <div aria-hidden="true" class="sticky top-0 h-svh overflow-hidden">
    <?php $scene('bg-ink-deep text-background'); ?>
    <div class="morph-light absolute inset-0"><?php $scene('bg-background text-foreground'); ?></div>
  </div>
</section>
<template data-statement-static>
  <section aria-label="AAK statement" class="bg-ink-deep py-32 lg:py-48">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <div <?= reveal() ?>>
        <p class="<?= e(cx('max-w-4xl text-balance text-background', $type)) ?>">We shape the places where life happens.</p>
      </div>
    </div>
  </section>
</template>
