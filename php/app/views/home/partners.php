<?php
/** "Working alongside" marquee (src/components/home/Partners.tsx). */
$partners = data('site', 'partners');
$track = array_merge($partners, $partners);
?>
<section aria-labelledby="partners-title" class="border-y border-border bg-background py-14">
  <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
    <p id="partners-title" class="meta-label text-center text-muted-foreground">Working alongside</p>
  </div>
  <div class="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
    <ul class="marquee flex w-max items-center gap-16">
      <?php foreach ($track as $i => $partner): ?>
        <li class="flex shrink-0 items-center gap-2.5 text-muted-foreground"<?= $i >= count($partners) ? ' aria-hidden="true"' : '' ?>>
          <span class="font-display text-lg font-bold tracking-tight text-foreground/70"><?= e($partner['abbreviation']) ?></span>
          <span class="hidden text-sm sm:inline"><?= e($partner['name']) ?></span>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
