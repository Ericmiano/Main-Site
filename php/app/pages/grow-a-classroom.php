<?php
/** Grow A Classroom (src/routes/initiatives.grow-a-classroom.tsx). */
$gac = data('grow-a-classroom');
$schools = $gac['gacSchools'];
$hero = $schools[0]['highlights'][0];
$counties = count(array_unique(array_column($schools, 'county')));
$pad = function (int $n): string {
    return str_pad((string) $n, 2, '0', STR_PAD_LEFT);
};

$page['title'] = 'Grow A Classroom | ' . SITE_NAME;
$page['description'] = "AAK's Grow A Classroom programme: master plans, landscaping and on-site timber for Kenya's public schools, and the schools it has worked with so far.";
$page['image'] = SITE_URL . $hero['src'];
$trail = [['Initiatives', '/#initiatives'], ['Grow A Classroom', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld([['Grow A Classroom', null]]),
    ['@type' => 'Article', 'headline' => 'Grow A Classroom', 'description' => $page['description'], 'image' => SITE_URL . $hero['src'], 'publisher' => ['@id' => SITE_URL . '/#organization']],
]]);

$copyValue = function (string $label, string $value, bool $dark): string {
    return '<div><p class="' . e(cx('meta-label', $dark ? 'text-background/60' : 'text-muted-foreground')) . '">' . e($label) . '</p>'
        . '<button type="button" data-copy="' . e(preg_replace('/\s/', '', $value)) . '" aria-label="Copy ' . e(strtolower($label) . ' ' . $value) . '" class="group mt-1 inline-flex items-center gap-2.5">'
        . '<span class="font-display text-2xl font-semibold tabular-nums sm:text-3xl">' . e($value) . '</span>'
        . '<span class="' . e(cx('inline-flex items-center gap-1 text-xs font-semibold transition-opacity', $dark ? 'text-background/70' : 'text-muted-foreground')) . '">'
        . '<span data-copy-icon>' . icon('Copy', 'h-4 w-4', 2, true) . '</span><span data-copied-icon hidden>' . icon('Check', 'h-4 w-4') . '</span>'
        . '<span aria-live="polite" data-copy-label>Copy</span></span></button></div>';
};
$donateCard = function (bool $dark) use ($gac, $copyValue): string {
    $d = $gac['gacDonation'];
    return '<div class="' . e(cx('p-6 sm:p-7', $dark ? 'bg-ink-deep/70 text-background backdrop-blur-md' : 'bg-background text-foreground')) . '">'
        . '<p class="' . e(cx('meta-label', $dark ? 'text-[oklch(0.75_0.13_38.5)]' : 'text-muted-foreground')) . '">Donate &middot; ' . e($d['method']) . '</p>'
        . '<div class="mt-4 flex flex-wrap gap-x-10 gap-y-4">' . $copyValue('Paybill', $d['paybill'], $dark) . $copyValue('Account', $d['account'], $dark) . '</div></div>';
};
$strategy = $gac['gacStrategy'];
?>
<main>
  <section class="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-ink-deep">
    <img src="<?= e($hero['src']) ?>" alt="<?= e($hero['alt']) ?>" fetchpriority="high" class="photo-grade absolute inset-0 -z-10 h-full w-full object-cover hero-zoom">
    <div aria-hidden="true" class="absolute inset-0 -z-10 bg-linear-to-t from-ink-deep via-ink-deep/60 to-ink-deep/10"></div>
    <div class="mx-auto grid w-full max-w-[1400px] gap-10 px-6 pt-28 pb-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:px-12 lg:pb-16">
      <div>
        <div class="[&_a]:text-background/70 [&_a:hover]:text-background [&_li]:text-background/70 [&_span]:text-background"><?= breadcrumb($trail) ?></div>
        <p class="hero-item meta-label mt-10 text-sustain">Professional CSR &middot; Advocacy programme</p>
        <h1 class="hero-item hero-delay-1 mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-background sm:text-7xl lg:text-8xl">Grow A Classroom</h1>
        <p class="hero-item hero-delay-2 mt-5 max-w-xl font-accent text-xl italic text-background/85 sm:text-2xl"><?= e($gac['gacTagline']) ?></p>
      </div>
      <div class="hero-item hero-delay-3 lg:justify-self-end"><?= $donateCard(true) ?></div>
    </div>
  </section>

  <section aria-label="Impact targets" class="bg-ink-deep text-background">
    <dl class="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-background/10 lg:grid-cols-4">
      <?php foreach ($gac['gacTargets'] as $t): ?>
        <div class="bg-ink-deep px-6 py-10 lg:px-12 lg:py-14">
          <dt class="meta-label text-background/55"><?= e($t['label']) ?></dt>
          <dd class="mt-3 font-display text-4xl font-semibold tabular-nums sm:text-5xl lg:text-6xl">
            <span data-countup="<?= (int) $t['value'] ?>" data-grouped<?= !empty($t['suffix']) ? ' data-suffix="' . e($t['suffix']) . '"' : '' ?>><?= number_format((int) $t['value']) . e($t['suffix'] ?? '') ?></span>
          </dd>
        </div>
      <?php endforeach; ?>
    </dl>
  </section>

  <section aria-labelledby="gac-overview" class="py-20 lg:py-28">
    <div class="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-12">
      <div <?= reveal() ?>>
        <?= section_rule('01', 'The programme') ?>
        <h2 id="gac-overview" class="type-section mt-8 text-foreground">Better schools, designed by professionals and grown on site.</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground"><?= e($gac['gacOverview']) ?></p>
        <p class="mt-4 text-base leading-relaxed text-muted-foreground">We are actively seeking partners to roll out this initiative across all 47 counties in Kenya.</p>
      </div>
      <div <?= reveal('self-center', 100) ?>>
        <div class="aspect-video overflow-hidden bg-ink-deep shadow-2xl">
          <iframe src="<?= e($gac['gacVideo']['src']) ?>" title="<?= e($gac['gacVideo']['title']) ?>" loading="lazy" class="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </section>

  <section aria-labelledby="gac-strategy" class="bg-paper-earth py-20 lg:py-28">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <div <?= reveal('max-w-2xl') ?>>
        <?= section_rule('02', 'How it works') ?>
        <h2 id="gac-strategy" class="type-section mt-8 text-foreground">A classroom that grows its own materials.</h2>
      </div>
      <ol class="mt-14 grid gap-px bg-foreground/15 sm:grid-cols-2 lg:grid-cols-5">
        <?php foreach ($strategy as $i => $step): ?>
          <li class="bg-paper-earth">
            <div <?= reveal('flex h-full flex-col p-6 lg:p-7', $i * 70) ?>>
              <span class="font-display text-4xl font-semibold text-foreground/60"><?= $pad($i + 1) ?></span>
              <h3 class="mt-6 font-display text-xl font-semibold text-foreground"><?= e($step['title']) ?></h3>
              <p class="mt-3 text-sm leading-relaxed text-foreground/70"><?= e($step['body']) ?></p>
            </div>
          </li>
        <?php endforeach; ?>
      </ol>
    </div>
  </section>

  <section aria-labelledby="gac-schools" class="py-20 lg:py-28">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <div <?= reveal('max-w-2xl') ?>>
        <?= section_rule('03', 'School by school') ?>
        <h2 id="gac-schools" class="type-section mt-8 text-foreground"><?= count($schools) ?> schools across <?= $counties ?> counties, so far.</h2>
        <p class="mt-5 text-base leading-relaxed text-muted-foreground">Follow the Grow A Classroom initiative school by school, with highlights from each visit.</p>
      </div>

      <nav aria-label="Schools" class="sticky top-16 z-20 -mx-6 mt-10 border-y border-border bg-background/90 px-6 backdrop-blur-md lg:mx-0 lg:px-0">
        <ul class="flex gap-6 overflow-x-auto py-3 [scrollbar-width:none]">
          <?php foreach ($schools as $i => $s): ?>
            <li class="shrink-0">
              <a href="#<?= e($s['id']) ?>" class="flex items-baseline gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
                <span class="meta-label text-muted-foreground"><?= $pad($i + 1) ?></span>
                <?= e(preg_replace('/ Primary School$/', '', $s['name'])) ?>
                <span class="text-muted-foreground">&middot; <?= e(preg_replace('/ County$/', '', $s['county'])) ?></span>
              </a>
            </li>
          <?php endforeach; ?>
        </ul>
      </nav>

      <div class="mt-4">
        <?php foreach ($schools as $i => $school):
            $photos = $school['allPhotos'] ?? $school['highlights'];
            $srcs = array_column($photos, 'src');
            $highlights = $school['highlights'];
            $lead = $highlights[0] ?? null;
        ?>
          <article id="<?= e($school['id']) ?>" aria-labelledby="<?= e($school['id']) ?>-title" class="scroll-mt-28 border-t border-border py-14 first:border-t-0 lg:py-20">
            <script type="application/json" data-photo-set="<?= e($school['id']) ?>"><?= json_encode($photos, JSON_HEX_TAG | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
            <div class="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
              <div <?= reveal('lg:sticky lg:top-28 lg:self-start') ?>>
                <p class="meta-label text-muted-foreground"><?= $pad($i + 1) ?> / <?= $pad(count($schools)) ?></p>
                <h3 id="<?= e($school['id']) ?>-title" class="mt-4 font-display text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl"><?= e($school['name']) ?></h3>
                <p class="meta-label mt-3 text-muted-foreground"><?= e($school['kind']) ?> &middot; <?= e($school['county']) ?><?= !empty($school['date']) ? ' &middot; ' . e($school['date']) : '' ?></p>
                <?php if (!empty($school['outcomes'])): ?>
                  <ul class="mt-8 space-y-3 border-t border-border pt-6">
                    <?php foreach ($school['outcomes'] as $outcome): ?>
                      <li class="flex gap-3 text-sm leading-relaxed text-foreground">
                        <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sustain/15 text-sustain"><?= icon('Check', 'h-3.5 w-3.5') ?></span>
                        <?= e($outcome) ?>
                      </li>
                    <?php endforeach; ?>
                  </ul>
                <?php endif; ?>
                <button type="button" data-photo-open="<?= e($school['id']) ?>" data-photo-index="0" class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">
                  <?= icon('Photo', 'h-4 w-4 text-primary') ?>
                  View <?= count($photos) > count($highlights) ? 'all ' . count($photos) : 'the' ?> photos
                </button>
              </div>

              <div>
                <?php if ($lead): ?>
                  <ul class="grid grid-cols-5 gap-2 sm:gap-3">
                    <?php foreach ($highlights as $j => $p): $index = max(0, (int) array_search($p['src'], $srcs, true)); ?>
                      <li class="<?= $j === 0 ? 'col-span-5' : '' ?>">
                        <div <?= reveal('h-full', $j === 0 ? 0 : ($j % 3) * 60) ?>>
                          <?php if ($j === 0): ?><div class="wipe h-full"><?php endif; ?>
                          <button type="button" data-photo-open="<?= e($school['id']) ?>" data-photo-index="<?= $index ?>" aria-label="Open photo: <?= e($p['alt']) ?>" class="group block h-full w-full overflow-hidden bg-secondary">
                            <img src="<?= e($p['src']) ?>" alt="<?= e($p['alt']) ?>" loading="lazy" class="<?= e(cx('photo-grade h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105', $j === 0 ? 'aspect-video' : 'aspect-square')) ?>">
                          </button>
                          <?php if ($j === 0): ?></div><?php endif; ?>
                        </div>
                      </li>
                    <?php endforeach; ?>
                  </ul>
                <?php endif; ?>
                <?php if (!empty($school['video'])): ?>
                  <div <?= reveal('mt-3') ?>>
                    <figure class="overflow-hidden bg-ink-deep">
                      <video controls preload="none"<?= $lead ? ' poster="' . e($lead['src']) . '"' : '' ?> class="aspect-video w-full"><source src="<?= e($school['video']['src']) ?>" type="video/mp4"></video>
                      <figcaption class="meta-label px-4 py-3 text-background/70">Film &middot; <?= e($school['video']['title']) ?></figcaption>
                    </figure>
                  </div>
                <?php endif; ?>
              </div>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
      <p class="mt-6 text-sm text-muted-foreground">More schools across Kenya are joining the programme. Check back for updates.</p>
    </div>
  </section>

  <section aria-labelledby="gac-involved" class="bg-primary py-20 text-primary-foreground lg:py-28">
    <div class="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
      <div <?= reveal() ?>>
        <?= section_rule('04', 'Get involved', 'primary') ?>
        <h2 id="gac-involved" class="type-section mt-8">Help grow the next classroom.</h2>
        <p class="mt-5 max-w-lg text-base leading-relaxed text-primary-foreground/90">Donate towards the Grow A Classroom initiative, or partner with AAK to take it to more schools across all 47 counties.</p>
        <a href="mailto:advocacy@aak.or.ke?subject=Grow%20A%20Classroom%20partnership" class="group link-quiet mt-8">Partner with us: advocacy@aak.or.ke <?= icon('ArrowUpRight') ?></a>
      </div>
      <div <?= reveal('lg:self-end', 100) ?>>
        <div class="shadow-2xl"><?= $donateCard(false) ?></div>
      </div>
    </div>
  </section>
</main>
<?php require APP_DIR . '/views/lightbox.php'; ?>
