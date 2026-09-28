<?php
/** Awards & Honours (src/routes/awards.tsx): latest winners lead the page. */
$page['title'] = 'Awards & Honours | ' . SITE_NAME;
$page['description'] = "The AAK-Basco DuraCoat Awards of Excellence in Architecture: categories, jury, evaluation criteria, and the 2024 cycle's winning projects.";
$page['image'] = SITE_URL . '/img/aak-duracoat-awards-of-excellence-2026.webp';
$trail = [['Awards & Honours', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld($trail),
    ['@type' => 'Event', 'name' => 'AAK-Basco DuraCoat Awards of Excellence in Architecture', 'description' => $page['description'], 'organizer' => ['@id' => SITE_URL . '/#organization']],
]]);

// Winners, then runners-up, then honourable mentions; source order within each.
$order = ['Winner', '1st Runner-up', 'Runner-up', '2nd Runner-up'];
$rank = function (string $result) use ($order): int {
    $i = array_search($result, $order, true);
    return $i === false ? count($order) : $i;
};
$winners = data('site', 'awardWinners2024');
$keyed = array_map(null, $winners, array_keys($winners));
usort($keyed, function ($a, $b) use ($rank) {
    return [$rank($a[0]['result']), $a[1]] <=> [$rank($b[0]['result']), $b[1]];
});
$winners = array_column($keyed, 0);

$evaluation = [
    ['45%', 'Design, Innovation, Technologies, Originality and Creativity'],
    ['20%', 'Contextual Appropriateness: Cultural, Environmental, Physical, Social'],
    ['15%', 'Sustainability: Design, Process, Lifetime Use and Durability'],
    ['10%', 'Socio-Economic Impact'],
    ['10%', 'Creative Use of Materials'],
];
$eligible = ['The Architectural Association of Kenya (AAK)', 'Rwanda Institute of Architects (RIA)', 'Uganda Society of Architects (USA)', 'Architectural Association of Tanzania (AAT)'];
$whyEnter = [
    ['Technical rigor', 'Every project is evaluated by a jury of esteemed international and local peers.'],
    ['Sustainable design', 'A dedicated category for climate resilience and resource-efficient practice.'],
    ['Market distinction', 'Winners gain national recognition and set the benchmark for professional excellence.'],
];
$jury = [
    ['Arch. Mphethi Morojele', 'South Africa Institute of Architects (SAIA)'],
    ['Arch. Flora Runumi', 'Uganda Society of Architects (USA)'],
    ['Prof. Paul Maringa', 'Architectural Association of Kenya (AAK)'],
    ['Arch. Nikos Fintikakis', 'International Union of Architects (UIA)'],
];
$format = [
    'Maximum 8 A2 sheets in high resolution, PDF or JPEG. Clarity, quality and completeness are assessed at shortlisting.',
    '1 A2 portrait sheet explaining the overall design concept.',
    'Up to 2 A2 sheets: ground floor plan (1:100) with topographical data, access, roadways, landscaping and walkways, plus an upper or typical level plan (1:100).',
    'Up to 4 A2 sheets: cross and longitudinal sections (1:100) with levels and materials, plus 2 detailed elevations (1:100).',
    '1 A2 sheet of 3D visualisations (perspectives, isometric, axonometric or sectional).',
    'All drawings annotated with key design elements and principles.',
    'Compiled into a single hi-resolution PDF, uploaded via the submission portal.',
    'Participating organisations receive one dinner ticket to the Awards Ceremony.',
];
?>
<main>
  <?= page_intro($trail, 'Recognising professional mastery', 'AAK-Basco DuraCoat Awards of Excellence in Architecture', '<p class="mt-5 text-base leading-relaxed text-muted-foreground">Hosted by the Architects Chapter, the Awards celebrate outstanding architectural achievement across Kenya and East Africa, recognising architects and project teams for innovation, creativity and excellence. Submitted projects must have been built and completed within the last five years (2020-2025), in any part of the world, by members of a participating association.</p>', 'Trophy', 'max-w-2xl') ?>

  <section aria-labelledby="winners-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Latest Awards of Excellence · 2024', 'Winning projects', ['id' => 'winners-title']) ?>
      <ul class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach ($winners as $i => $w): ?>
          <li>
            <div <?= reveal('h-full', ($i % 3) * 60) ?>>
              <a href="<?= e($w['pdfHref']) ?>" target="_blank" rel="noopener noreferrer" class="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                <div class="overflow-hidden bg-secondary">
                  <img src="<?= e($w['image']) ?>" alt="<?= e($w['project']) ?>" loading="lazy" class="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105">
                </div>
                <div class="flex flex-1 flex-col justify-between gap-3 p-5">
                  <div>
                    <span class="meta-label text-muted-foreground"><?= e($w['category']) ?></span>
                    <h3 class="mt-2 font-display text-base font-semibold leading-snug text-foreground"><?= e($w['project']) ?></h3>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs text-muted-foreground"><?= e($w['result']) ?></span>
                    <?= icon('ArrowUpRight', 'h-4 w-4 shrink-0 text-primary') ?>
                  </div>
                </div>
              </a>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="why-enter-title" class="border-t border-border py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Regional recognition', 'Showcase your contribution to the urban future', ['id' => 'why-enter-title', 'description' => "The AAK Awards of Excellence is the region's most prestigious honours programme, recognising outstanding achievement by professionals across all eight chapters of the association."]) ?>
      <ul class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <?php foreach ($whyEnter as $i => [$title, $body]): ?>
          <li>
            <div <?= reveal('h-full', $i * 80) ?>>
              <div class="h-full rounded-2xl border border-border p-6">
                <h3 class="font-display text-lg font-semibold text-foreground"><?= e($title) ?></h3>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><?= e($body) ?></p>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="categories-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Nine categories', 'What&#039;s judged', ['id' => 'categories-title', 'description' => 'Open to members of the AAK, the Rwanda Institute of Architects, the Uganda Society of Architects and the Architectural Association of Tanzania.']) ?>
      <ul class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach (data('site', 'awardCategories') as $i => $category): ?>
          <li>
            <div <?= reveal('h-full', ($i % 3) * 60) ?>>
              <div class="h-full rounded-xl border border-border bg-card p-5">
                <span class="font-display text-sm font-semibold text-foreground"><?= e($category['name']) ?></span>
                <p class="mt-2 text-xs leading-relaxed text-muted-foreground"><?= e($category['description']) ?></p>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="evaluation-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('How entries are judged', 'Evaluation criteria', ['id' => 'evaluation-title']) ?>
      <ul class="mt-14 space-y-3">
        <?php foreach ($evaluation as $i => [$weight, $text]): ?>
          <li>
            <div <?= reveal('', $i * 60) ?>>
              <div class="flex items-center gap-5 rounded-xl border border-border p-5">
                <span class="font-display text-2xl font-semibold tabular-nums text-primary"><?= e($weight) ?></span>
                <p class="text-sm leading-relaxed text-foreground"><?= e($text) ?></p>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="jury-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Panel', 'Jury members', ['id' => 'jury-title']) ?>
      <ul class="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <?php foreach ($jury as $i => [$name, $org]): ?>
          <li>
            <div <?= reveal('', $i * 70) ?>>
              <div class="rounded-xl bg-card p-5">
                <p class="font-display text-sm font-semibold text-foreground"><?= e($name) ?></p>
                <p class="mt-1 text-xs text-muted-foreground"><?= e($org) ?></p>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="cycle-2026-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('2026 cycle', 'Eligibility and submission format', ['id' => 'cycle-2026-title', 'description' => "This cycle's submission window has closed. The details below are kept as reference for the next call for entries."]) ?>
      <div class="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div <?= reveal() ?>>
          <h3 class="meta-label text-muted-foreground">Eligible associations</h3>
          <ul class="mt-4 space-y-2">
            <?php foreach ($eligible as $org): ?><li class="text-sm text-foreground"><?= e($org) ?></li><?php endforeach; ?>
          </ul>
          <h3 class="meta-label mt-10 text-muted-foreground">Key dates and fees</h3>
          <dl class="mt-4 grid grid-cols-3 gap-4">
            <?php foreach ([['Submission deadline', '18 March 2026'], ['Fee per project', 'KES 5,500 · Paybill 988567'], ['Awards ceremony', '26 March 2026']] as [$dt, $dd]): ?>
              <div>
                <dt class="text-[11px] text-muted-foreground"><?= e($dt) ?></dt>
                <dd class="mt-1 font-display text-sm font-semibold text-foreground"><?= e($dd) ?></dd>
              </div>
            <?php endforeach; ?>
          </dl>
        </div>
        <div <?= reveal('', 80) ?>>
          <h3 class="meta-label text-muted-foreground">Submission format</h3>
          <ul class="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <?php foreach ($format as $item): ?><li><?= e($item) ?></li><?php endforeach; ?>
          </ul>
        </div>
      </div>
      <div <?= reveal('mt-10 rounded-2xl border border-border bg-card p-7', 120) ?>>
        <h3 class="font-display text-lg font-semibold text-foreground">Terms</h3>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><span class="font-semibold text-foreground">Consent:</span> by submitting materials, entrants give AAK permission to store and publish all images and information for promotional, CPD and educational use, physical and on the web. It is the entrant's responsibility to obtain all necessary consents from other stakeholders, including project owners, prior to submission.</p>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><span class="font-semibold text-foreground">Exhibition:</span> submitted projects are shown to the public at an exhibition at the ADD Building, University of Nairobi, the dinner venue, or such other places as the planning team deems fit.</p>
      </div>
    </div>
  </section>

  <section class="border-t border-border py-16 text-center lg:py-20">
    <div class="mx-auto max-w-xl px-6 lg:px-12">
      <h2 class="font-display text-2xl font-semibold tracking-tight text-foreground">Enter the next cycle</h2>
      <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Submissions open periodically through the AAK secretariat. Check the events calendar or contact the Architects Chapter for the next entry window, or view the 2026 cycle's submission portal for reference.</p>
      <div class="mt-7 flex flex-wrap items-center justify-center gap-4">
        <a href="https://forms.office.com/r/3tVqjPinXp" target="_blank" rel="noopener noreferrer" class="group btn-primary">2026 submission portal <?= icon('ArrowUpRight') ?></a>
      </div>
    </div>
  </section>
</main>
