<?php
/** Corporate Social Responsibility (src/routes/csr.tsx). */
$page['title'] = 'Corporate Social Responsibility | ' . SITE_NAME;
$page['description'] = "AAK's corporate social responsibility programmes: BuildRun, the David Mutiso Bursary Fund and the Grow A Classroom Initiative.";
$page['image'] = SITE_URL . '/img/aak-csr-133-of-151-1200x800-600x400-1.webp';
$trail = [['Corporate Social Responsibility', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld([['CSR', null]]),
    ['@type' => 'AboutPage', 'name' => $page['title'], 'description' => $page['description'], 'url' => SITE_URL . '/csr', 'mainEntity' => ['@id' => SITE_URL . '/#organization']],
]]);
$initiatives = data('site', 'initiatives');
$gac = find_by_slug($initiatives, 'grow-a-classroom');
$programmes = [
    ['BuildRun', "AAK's annual charity run, and the mechanism through which the Association funds its bursary initiative and community projects.", null],
    ['David Mutiso Bursary Fund', 'Support for deserving students pursuing courses in the built and natural environment. Over 100 students have been supported through to graduation to date.', null],
    ['Grow A Classroom Initiative', $gac['description'] ?? '', $gac['externalUrl'] ?? null],
];
?>
<main>
  <?= page_intro($trail, 'Giving back', 'Corporate Social Responsibility', '', 'HeartHandshake', 'max-w-2xl') ?>

  <section aria-labelledby="csr-programmes-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="csr-programmes-title" class="sr-only">CSR programmes</h2>
      <ul class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <?php foreach ($programmes as $i => [$title, $body, $href]): ?>
          <li>
            <div <?= reveal('h-full', $i * 80) ?>>
              <div class="flex h-full flex-col rounded-2xl border border-border p-7">
                <h3 class="font-display text-lg font-semibold leading-snug text-foreground"><?= e($title) ?></h3>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><?= e($body) ?></p>
                <?php if ($href): ?>
                  <a href="<?= e($href) ?>" target="_blank" rel="noopener noreferrer" class="group mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-foreground">Visit the Grow A Classroom site <?= icon('ArrowUpRight', 'h-4 w-4 text-primary') ?></a>
                <?php endif; ?>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>

      <div <?= reveal('mt-10 rounded-2xl bg-secondary/60 p-7 sm:flex sm:items-center sm:justify-between sm:gap-6', 240) ?>>
        <div>
          <h3 class="font-display text-lg font-semibold text-foreground">Support the bursary fund</h3>
          <p class="mt-2 max-w-xl text-sm leading-relaxed text-foreground/75">Donations to the David Mutiso Bursary Fund are made through the AAK store.</p>
        </div>
        <a href="/store" class="group mt-6 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground sm:mt-0">Visit the store <?= icon('ArrowUpRight', 'h-4 w-4 text-primary') ?></a>
      </div>
    </div>
  </section>

  <section aria-labelledby="csr-initiatives-title" class="border-t border-border bg-muted/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Alongside our public-interest work', 'Other programmes members put to work', [
          'id' => 'csr-initiatives-title',
          'description' => "CSR sits alongside AAK's built-environment initiatives, run for the public good by members across all eight chapters.",
      ]) ?>
      <?= initiative_cards(array_filter($initiatives, function ($i) { return $i['slug'] !== 'grow-a-classroom'; })) ?>
    </div>
  </section>
</main>
