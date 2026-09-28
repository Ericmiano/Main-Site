<?php
/** Chapter page (src/routes/chapters.$slug.tsx). $slug comes from the router. */
$chapter = find_by_slug(data('site', 'chapters'), $slug);
if (!$chapter) {
    http_response_code(404);
    $page['title'] = 'Chapter not found | ' . SITE_NAME;
    $page['noindex'] = true;
    ?>
    <main class="flex min-h-[50vh] items-center justify-center px-6 py-24 text-center">
      <div>
        <h1 class="font-display text-3xl font-semibold text-foreground">Chapter not found</h1>
        <a href="/" class="group btn-primary mt-6 justify-center">Back to home</a>
      </div>
    </main>
    <?php
    return;
}

$page['title'] = $chapter['name'] . ' Chapter | ' . SITE_NAME;
$page['description'] = $chapter['definition'];
$page['image'] = $chapter['image'];
$council = data('chapter-councils', 'chapterCouncils')[$chapter['slug']] ?? [];
$branches = data('chapter-councils', 'chapterBranches')[$chapter['slug']] ?? [];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld([[$chapter['name'] . ' Chapter', null]]),
    ['@type' => 'Organization', 'name' => 'AAK ' . $chapter['name'] . ' Chapter', 'description' => $chapter['definition'], 'parentOrganization' => ['@id' => SITE_URL . '/#organization']],
]]);
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-10 lg:py-14">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12"><?= breadcrumb([['Chapters', '/#chapters'], [$chapter['name'], null]]) ?></div>
  </section>

  <section class="py-14 lg:py-20">
    <div class="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-[1fr_1.1fr] lg:px-12">
      <div <?= reveal() ?>>
        <span class="meta-label text-muted-foreground">AAK Chapter</span>
        <h1 class="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"><?= e($chapter['name']) ?></h1>
        <p class="mt-5 max-w-xl font-accent text-lg italic leading-relaxed text-muted-foreground"><?= e($chapter['tagline']) ?></p>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"><?= e($chapter['definition']) ?></p>
      </div>
      <div <?= reveal('', 100) ?>>
        <figure class="overflow-hidden rounded-2xl bg-secondary">
          <img src="<?= e($chapter['image']) ?>" alt="<?= e($chapter['name']) ?> chapter of the Architectural Association of Kenya" loading="lazy" class="aspect-4/3 w-full object-cover">
        </figure>
      </div>
    </div>
  </section>

  <?php if ($council): ?>
    <section aria-labelledby="chapter-council-title" class="border-t border-border bg-secondary/40 py-14 lg:py-20">
      <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
        <h2 id="chapter-council-title" class="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter council, 2025/2027</h2>
        <ul class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <?php foreach ($council as $member): ?>
            <li class="rounded-xl bg-card p-5">
              <p class="font-display text-base font-semibold text-foreground"><?= e($member['name']) ?></p>
              <p class="mt-1 text-sm text-muted-foreground"><?= e($member['role']) ?></p>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    </section>
  <?php endif; ?>

  <?php if ($branches): ?>
    <section aria-labelledby="chapter-branches-title" class="border-t border-border py-14 lg:py-20">
      <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
        <h2 id="chapter-branches-title" class="font-display text-2xl font-semibold tracking-tight text-foreground">Regional branches</h2>
        <div class="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <?php foreach ($branches as $branch): ?>
            <div>
              <h3 class="font-display text-base font-semibold text-foreground"><?= e($branch['name']) ?></h3>
              <ul class="mt-4 space-y-3">
                <?php foreach ($branch['members'] as $member): ?>
                  <li class="rounded-xl bg-card p-4">
                    <p class="font-display text-sm font-semibold text-foreground"><?= e($member['name']) ?></p>
                    <p class="mt-1 text-xs text-muted-foreground"><?= e($member['role']) ?></p>
                  </li>
                <?php endforeach; ?>
              </ul>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
  <?php endif; ?>

  <div class="border-t border-border bg-secondary/40 py-10 text-center">
    <span class="meta-label text-muted-foreground"><?= e($chapter['footerTagline']) ?></span>
  </div>

  <section class="py-16 text-center lg:py-20">
    <div class="mx-auto max-w-xl px-6 lg:px-12">
      <h2 class="font-display text-2xl font-semibold tracking-tight text-foreground">Join the <?= e($chapter['name']) ?> Chapter</h2>
      <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Membership gives you standing, CPD access and a voice within your chapter.</p>
      <a href="/membership" class="group btn-primary mt-7">How to join <?= icon('ArrowUpRight') ?></a>
    </div>
  </section>
</main>
