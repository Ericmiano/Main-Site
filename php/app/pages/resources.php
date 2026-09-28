<?php
/** Resource Centre (src/routes/resources.tsx). */
$page['title'] = 'Resource Centre | ' . SITE_NAME;
$page['description'] = "AAK's reports, downloads and advocacy documents: the Status of the Built Environment Report, AGM reports, BuildPress Magazine, building regulations and policy submissions.";
$trail = [['Resource Centre', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [breadcrumb_ld($trail)]]);
$categories = [
    ['Bills', "Parliamentary bills tracked by AAK's advocacy team, with the association's submissions where made.", '/bills'],
    ['General Downloads', 'Forms, guides and other documents for members and the public.', '/general-downloads'],
    ['Building Regulations', 'Reference building regulations relevant to practice in Kenya.', '/building-regulations'],
    ['Press Statements', "AAK's official statements to the press on matters affecting the built environment.", '/press-statements'],
    ['Opinion Editorials', 'Op-eds and commentary from AAK leadership and members on industry issues.', '/opinion-editorials'],
    ['BuildPress Magazine', "AAK's magazine covering the profession, chapters and industry issues.", '/buildpress-magazine'],
    ['BuildHub', "AAK's portal for obtaining a building permit or planning approval in Kenya, with step-by-step guidance, timelines and fees by county.", 'https://buildhub.aak.or.ke/'],
    ['Status of the Built Environment Report', "AAK's annual analysis of trends, challenges and professional opportunities in Kenya's construction and urban development sector. Archive runs from 2018 to 2025.", '/status-of-the-built-environment'],
    ['AGM Reports', 'Annual General Meeting reports, published each year following the AAK AGM.', '/agm-reports'],
    ['Salary Survey', "AAK's periodic survey of remuneration across the built and natural environment professions.", '/salary-survey'],
    ['CPD Rapporteur Reports', "Summaries from AAK's Continuing Professional Development sessions.", '/cpd-rapporteur-reports'],
    ['Liaison Committees Reports', "Reports from AAK's liaison committees with regulators and partner bodies.", '/liaison-committees-reports'],
    ['Mulika Mjengo Report', "The core report behind AAK's public safety and hazard-reporting advocacy initiative.", '/mulika-mjengo-report'],
];
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-14 lg:py-20">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= breadcrumb($trail) ?>
      <div <?= reveal('mt-8 max-w-2xl') ?>>
        <h1 class="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">Resource Centre</h1>
        <p class="mt-5 text-base leading-relaxed text-muted-foreground"><?= e($page['description']) ?></p>
      </div>
    </div>
  </section>

  <section aria-labelledby="categories-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="categories-title" class="font-display text-2xl font-semibold tracking-tight text-foreground">Browse by category</h2>
      <ul class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach ($categories as $i => [$title, $body, $href]): $external = is_external($href); ?>
          <li>
            <div <?= reveal('h-full', ($i % 3) * 60) ?>>
              <a href="<?= e($href) ?>"<?= ext_attrs($href) ?> class="group flex h-full flex-col rounded-2xl bg-card p-6 transition-colors hover:bg-card/70">
                <h3 class="font-display text-base font-semibold text-foreground"><?= e($title) ?></h3>
                <p class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground"><?= e($body) ?></p>
                <span class="meta-label mt-4 inline-flex items-center gap-2 text-foreground"><?= $external ? 'Open BuildHub' : 'Browse documents' ?><?= icon('ArrowUpRight', 'h-3.5 w-3.5 text-primary') ?></span>
              </a>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="latest-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="latest-title" class="font-display text-2xl font-semibold tracking-tight text-foreground">Latest downloads</h2>
      <ul class="mt-8 border-t border-border">
        <?php foreach (data('site', 'publications') as $i => $doc): ?>
          <li>
            <div <?= reveal('', $i * 60) ?>>
              <a href="<?= e($doc['href']) ?>" target="_blank" rel="noopener noreferrer" class="group flex flex-col gap-2 border-b border-border py-6 transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div class="flex items-center gap-4">
                  <?= icon('FileText', 'h-5 w-5 shrink-0 text-primary') ?>
                  <h3 class="font-display text-base font-semibold text-foreground"><?= e($doc['title']) ?></h3>
                </div>
                <span class="pl-9 text-xs uppercase tracking-[0.14em] text-muted-foreground sm:pl-0"><?= e($doc['meta']) ?></span>
              </a>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>
</main>
