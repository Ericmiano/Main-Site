<?php
/** AAK Leadership (src/routes/team.tsx). */
$page['title'] = 'AAK Leadership | ' . SITE_NAME;
$page['description'] = 'The Executive Committee, Secretariat, chapter councils, regional branch councils and College of Fellows of the Architectural Association of Kenya, 2025/2027 term.';
$trail = [['AAK Leadership', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld($trail),
    [
        '@type' => 'ItemList',
        'name' => 'AAK Chapter Chairpersons 2025/2027',
        'itemListElement' => array_map(function ($lead, $i) {
            return ['@type' => 'ListItem', 'position' => $i + 1, 'item' => ['@type' => 'Person', 'name' => $lead['chair'], 'jobTitle' => 'Chairperson, ' . $lead['chapter']]];
        }, data('site', 'chapterChairs'), array_keys(data('site', 'chapterChairs'))),
    ],
]]);

// Executive Committee titles in rank order (aak.or.ke/about-us/); the
// secretariat list holds them alongside the operational staff.
$executiveTitles = ['President', 'Vice President', 'Honorary Secretary', 'Assistant Secretary', 'Honorary Treasurer', 'Honorary Registrar'];
$secretariat = data('site', 'secretariat');
$executive = [];
foreach ($executiveTitles as $title) {
    foreach ($secretariat as $member) {
        if ($member['title'] === $title) {
            $executive[] = $member;
        }
    }
}
$staff = array_values(array_filter($secretariat, function ($m) use ($executiveTitles) {
    return !in_array($m['title'], $executiveTitles, true);
}));
$councils = data('chapter-councils', 'chapterCouncils');
$branches = data('chapter-councils', 'chapterBranches')['landscape-architects'] ?? [];
$fellows = data('site', 'collegeOfFellows');
sort($fellows, SORT_STRING | SORT_FLAG_CASE);
$fellowsPage = 15;

$initials = function (string $name): string {
    $clean = preg_replace('/^(Arch\.|L\/Arch\.|QS\.|Eng\.|Prof\.?)\s*/i', '', $name);
    $parts = array_slice(preg_split('/\s+/', trim($clean)), 0, 2);
    return strtoupper(implode('', array_map(function ($p) { return mb_substr($p, 0, 1); }, $parts)));
};
$peopleGrid = function (array $people) use ($initials): void { ?>
  <ul class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    <?php foreach ($people as $i => $member): ?>
      <li>
        <div <?= reveal('h-full', ($i % 4) * 60) ?>>
          <div class="flex h-full flex-col items-start gap-4 rounded-2xl border border-border bg-background p-6">
            <?php if (!empty($member['photo'])): ?>
              <img src="<?= e($member['photo']) ?>" alt="" loading="lazy" class="h-14 w-14 shrink-0 rounded-xl object-cover">
            <?php else: ?>
              <span aria-hidden="true" class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-lg font-semibold text-primary-foreground"><?= e($initials($member['name'])) ?></span>
            <?php endif; ?>
            <div>
              <h3 class="font-display text-base font-semibold leading-snug text-foreground"><?= e($member['name']) ?></h3>
              <p class="mt-1 text-sm text-muted-foreground"><?= e($member['title']) ?></p>
            </div>
          </div>
        </div>
      </li>
    <?php endforeach; ?>
  </ul>
<?php };
$roster = function (string $titleHtml, array $members): void { ?>
  <div class="h-full rounded-2xl border border-border bg-background p-6">
    <h3 class="font-display text-lg font-semibold leading-snug text-foreground"><?= $titleHtml ?></h3>
    <dl class="mt-4 divide-y divide-border text-sm">
      <?php foreach ($members as $m): ?>
        <div class="flex flex-col-reverse py-2 sm:flex-row-reverse sm:justify-between sm:gap-4">
          <dt class="text-muted-foreground sm:text-right"><?= e($m['role']) ?></dt>
          <dd class="font-medium text-foreground"><?= e($m['name']) ?></dd>
        </div>
      <?php endforeach; ?>
    </dl>
  </div>
<?php };
?>
<main>
  <?= page_intro($trail, 'Governance · 2025/2027 term', 'AAK Leadership', '<p class="mt-5 text-base leading-relaxed text-muted-foreground">The Executive Committee, the Secretariat that runs AAK day to day, the councils of the eight chapters and three regional branches, and the College of Fellows: the highest honour AAK bestows on its members.</p>') ?>

  <section aria-labelledby="executive-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Office bearers', 'Executive Committee', ['id' => 'executive-title', 'bold' => true, 'description' => "The Association's elected office bearers for the 2025/2027 term."]) ?>
      <?php $peopleGrid($executive); ?>
    </div>
  </section>

  <section aria-labelledby="secretariat-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Operations · Contact', 'Secretariat', ['id' => 'secretariat-title', 'bold' => true, 'description' => 'The AAK Secretariat manages the day-to-day operations of the Association and serves as the primary point of contact for members and stakeholders, coordinating administrative, communication and logistical functions.']) ?>
      <?php $peopleGrid($staff); ?>
    </div>
  </section>

  <section aria-labelledby="chapter-councils-title" class="border-t border-border py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Eight chapters', 'Chapter Councils', ['id' => 'chapter-councils-title', 'bold' => true, 'description' => 'Each chapter is run by its own elected council.']) ?>
      <ul class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach (data('site', 'chapters') as $i => $chapter): ?>
          <li>
            <div <?= reveal('h-full', ($i % 3) * 60) ?>>
              <?php $roster('<a href="/chapters/' . e($chapter['slug']) . '" class="link-quiet">' . e($chapter['name']) . '</a>', $councils[$chapter['slug']] ?? []); ?>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="branches-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Three branches', 'Regional Branch Councils', ['id' => 'branches-title', 'bold' => true]) ?>
      <ul class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach ($branches as $i => $branch): ?>
          <li><div <?= reveal('h-full', $i * 60) ?>><?php $roster(e($branch['name']), $branch['members']); ?></div></li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="fellows-title" class="border-t border-border py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Honour · Service', 'College of Fellows, 2026', [
          'id' => 'fellows-title',
          'bold' => true,
          'description' => 'Fellowship recognises distinguished members who have made significant contributions to the profession and to the association: the highest honour AAK bestows.',
          'action' => '<span class="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">' . icon('Award', 'h-4 w-4 text-primary') . count($fellows) . ' Fellows</span>',
      ]) ?>
      <div <?= reveal('', 100) ?>>
        <ul data-expandable="fellows" class="mt-10 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-5">
          <?php foreach ($fellows as $i => $name): ?>
            <li<?= $i >= $fellowsPage ? ' data-extra hidden' : '' ?> class="border-b border-border py-1.5 text-foreground"><?= e($name) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <?php if (count($fellows) > $fellowsPage): ?>
        <button type="button" data-expand="fellows" aria-expanded="false" data-label-more="Show all <?= count($fellows) ?> Fellows" data-label-less="Show fewer" class="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <span data-expand-label>Show all <?= count($fellows) ?> Fellows</span>
          <?= icon('ChevronDown', 'h-4 w-4 text-primary transition-transform group-aria-expanded:rotate-180') ?>
        </button>
      <?php endif; ?>
    </div>
  </section>
</main>
