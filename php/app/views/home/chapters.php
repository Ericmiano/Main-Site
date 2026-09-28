<?php
/**
 * The eight chapters (src/components/home/Chapters.tsx): a hover index with
 * a swapping photograph on desktop, a compact list on phones and a card
 * grid on tablets. site.js drives the desktop swap via data-chapter-*.
 */
$chapters = data('site', 'chapters');
$pad = function (int $n): string {
    return str_pad((string) $n, 2, '0', STR_PAD_LEFT);
};
$first = $chapters[0];
?>
<section id="chapters" aria-labelledby="chapters-title" class="bg-background py-24 lg:py-32">
  <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
    <div <?= reveal('max-w-2xl') ?>>
      <?= section_rule('05', 'The association') ?>
      <h2 id="chapters-title" class="type-section mt-8 text-foreground">Umbrella association of eight professional chapters.</h2>
      <p class="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">Experts across the built and natural environment disciplines, united behind technical excellence and sustainable development in Kenya.</p>
    </div>

    <div <?= reveal('mt-14') ?>>
      <!-- Desktop: hover index + photograph -->
      <div data-chapter-index class="hidden lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <ol class="border-t border-border">
          <?php foreach ($chapters as $i => $chapter): $on = $i === 0; ?>
            <li class="border-b border-border">
              <a href="/chapters/<?= e($chapter['slug']) ?>" data-chapter-item="<?= $i ?>" data-active="<?= $on ? 'true' : 'false' ?>" class="group flex items-baseline gap-6 py-4">
                <span class="meta-label w-6 shrink-0 text-muted-foreground transition-colors duration-300 group-data-[active=true]:text-primary"><?= $pad($i + 1) ?></span>
                <span class="font-display text-2xl font-semibold tracking-tight text-foreground/60 transition-[color,transform] duration-300 group-data-[active=true]:translate-x-2 group-data-[active=true]:text-foreground xl:text-3xl"><?= e($chapter['name']) ?></span>
                <?= icon('ArrowUpRight', 'ml-auto h-5 w-5 shrink-0 self-center text-primary opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100') ?>
              </a>
            </li>
          <?php endforeach; ?>
        </ol>
        <div class="relative self-stretch overflow-hidden rounded-2xl bg-secondary">
          <?php foreach ($chapters as $i => $chapter): ?>
            <img src="<?= e($chapter['image']) ?>" alt="" loading="lazy" data-chapter-photo="<?= $i ?>" data-active="<?= $i === 0 ? 'true' : 'false' ?>"
                 class="photo-grade absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out data-[active=true]:scale-100 data-[active=true]:opacity-100">
          <?php endforeach; ?>
          <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-deep/85 to-transparent p-8 pt-24">
            <p class="meta-label text-background/70"><span data-chapter-num><?= $pad(1) ?></span> / <?= $pad(count($chapters)) ?></p>
            <p data-chapter-name class="mt-2 font-display text-2xl font-semibold text-background"><?= e($first['name']) ?></p>
            <p data-chapter-tagline class="mt-2 max-w-md text-sm leading-relaxed text-background/80"><?= e($first['tagline']) ?></p>
          </div>
          <script type="application/json" data-chapter-data><?= json_encode(array_map(function ($c) {
              return ['name' => $c['name'], 'tagline' => $c['tagline']];
          }, $chapters), JSON_HEX_TAG | JSON_UNESCAPED_UNICODE) ?></script>
        </div>
      </div>

      <!-- Phones: compact list -->
      <ol class="border-t border-border sm:hidden">
        <?php foreach ($chapters as $i => $chapter): ?>
          <li class="border-b border-border">
            <a href="/chapters/<?= e($chapter['slug']) ?>" class="flex min-h-20 items-center gap-4 py-3">
              <span class="meta-label w-6 shrink-0 text-muted-foreground"><?= $pad($i + 1) ?></span>
              <span class="flex-1 font-display text-lg font-semibold leading-tight text-foreground"><?= e($chapter['name']) ?></span>
              <img src="<?= e($chapter['image']) ?>" alt="" loading="lazy" class="photo-grade h-14 w-14 shrink-0 object-cover">
            </a>
          </li>
        <?php endforeach; ?>
      </ol>

      <!-- Tablets: card grid -->
      <ul class="hidden gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid sm:grid-cols-2 lg:hidden">
        <?php foreach ($chapters as $i => $chapter): ?>
          <li class="bg-card">
            <div <?= reveal('', ($i % 2) * 70) ?>>
              <a href="/chapters/<?= e($chapter['slug']) ?>" class="group block">
                <div class="overflow-hidden bg-secondary">
                  <img src="<?= e($chapter['image']) ?>" alt="<?= e($chapter['name']) ?> chapter of the Architectural Association of Kenya" loading="lazy" class="photo-grade aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105">
                </div>
                <div class="flex items-center justify-between gap-3 px-6 py-5">
                  <h3 class="font-display text-base font-semibold leading-tight text-foreground"><?= e($chapter['name']) ?></h3>
                  <span class="meta-label text-muted-foreground"><?= $pad($i + 1) ?></span>
                </div>
              </a>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</section>
