<?php
/** Initiative page (src/routes/initiatives.$slug.tsx). $slug comes from the router. */
$initiative = find_by_slug(data('initiatives-detail', 'initiativeDetails'), $slug);
if (!$initiative) {
    http_response_code(404);
    $page['title'] = 'Initiative not found | ' . SITE_NAME;
    $page['noindex'] = true;
    ?>
    <main class="flex min-h-[50vh] items-center justify-center px-6 py-24 text-center">
      <div>
        <h1 class="font-display text-3xl font-semibold text-foreground">Initiative not found</h1>
        <a href="/" class="group btn-primary mt-6 justify-center">Back to home</a>
      </div>
    </main>
    <?php
    return;
}

$page['title'] = $initiative['title'] . ' | ' . SITE_NAME;
$page['description'] = $initiative['summary'];
$page['image'] = $initiative['image'];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld([[$initiative['title'], null]]),
    ['@type' => 'Article', 'headline' => $initiative['title'], 'description' => $initiative['summary'], 'image' => $initiative['image'], 'publisher' => ['@id' => SITE_URL . '/#organization']],
]]);
$videos = $initiative['videos'] ?? [];
$primaryVideo = array_shift($videos);

$video = function (array $v, string $class): string {
    if ($v['kind'] === 'file') {
        return '<video controls preload="metadata" class="' . e($class) . '"><source src="' . e($v['src']) . '" type="video/mp4"></video>';
    }
    return '<iframe src="' . e($v['src']) . '" title="' . e($v['title']) . '" class="' . e($class) . '"'
        . ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
};
$photoGrid = function (array $photos): string {
    $out = '<ul class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">';
    foreach ($photos as $i => $photo) {
        $out .= '<li><div ' . reveal('', ($i % 3) * 60) . '><figure class="overflow-hidden rounded-2xl bg-secondary">'
            . '<img src="' . e($photo['src']) . '" alt="' . e($photo['alt']) . '" loading="lazy" class="aspect-4/3 w-full object-cover">'
            . '</figure></div></li>';
    }
    return $out . '</ul>';
};
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-10 lg:py-14">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12"><?= breadcrumb([['Initiatives', '/#initiatives'], [$initiative['title'], null]]) ?></div>
  </section>

  <article>
    <section class="py-14 lg:py-20">
      <div class="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-12">
        <div <?= reveal() ?>>
          <span class="<?= $initiative['tone'] === 'green' ? 'meta-label text-sustain' : 'meta-label text-muted-foreground' ?>"><?= e($initiative['eyebrow']) ?></span>
          <h1 class="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"><?= e($initiative['title']) ?></h1>
          <p class="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"><?= e($initiative['summary']) ?></p>
          <?php if (!empty($initiative['stats'])): ?>
            <dl class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <?php foreach ($initiative['stats'] as $stat): ?>
                <div class="rounded-xl border border-border p-4">
                  <dt class="meta-label text-muted-foreground"><?= e($stat['label']) ?></dt>
                  <dd class="mt-1.5 text-sm font-medium text-foreground"><?= e($stat['value']) ?></dd>
                </div>
              <?php endforeach; ?>
            </dl>
          <?php endif; ?>
        </div>
        <div <?= reveal('', 120) ?>>
          <figure class="overflow-hidden rounded-2xl bg-secondary">
            <?php if ($primaryVideo): ?>
              <?= $video($primaryVideo, 'aspect-video w-full') ?>
            <?php else: ?>
              <img src="<?= e($initiative['image']) ?>" alt="<?= e($initiative['imageAlt']) ?>" loading="lazy" class="aspect-4/3 w-full object-cover">
            <?php endif; ?>
          </figure>
        </div>
      </div>
    </section>

    <?php if ($videos): ?>
      <section class="border-t border-border py-14 lg:py-20">
        <div class="mx-auto max-w-3xl px-6 lg:px-12">
          <h2 class="meta-label text-muted-foreground">More video</h2>
          <div class="mt-4 space-y-8">
            <?php foreach ($videos as $v): ?>
              <div>
                <p class="mb-3 text-sm font-medium text-foreground"><?= e($v['title']) ?></p>
                <div class="aspect-video overflow-hidden border border-border bg-secondary"><?= $video($v, 'h-full w-full') ?></div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      </section>
    <?php endif; ?>

    <section class="border-t border-border py-14 lg:py-20">
      <div class="mx-auto max-w-3xl px-6 lg:px-12">
        <div class="space-y-6 text-base leading-relaxed text-muted-foreground">
          <?php foreach ($initiative['body'] as $paragraph): ?><p><?= e($paragraph) ?></p><?php endforeach; ?>
        </div>

        <?php if (!empty($initiative['audio'])): ?>
          <div class="mt-10 border-t border-border pt-8">
            <h2 class="meta-label text-muted-foreground">Radio coverage</h2>
            <ul class="mt-4 space-y-5">
              <?php foreach ($initiative['audio'] as $clip): ?>
                <li>
                  <p class="text-sm font-medium text-foreground"><?= e($clip['label']) ?></p>
                  <audio controls preload="none" class="mt-2 w-full"><source src="<?= e($clip['src']) ?>" type="audio/mpeg"></audio>
                </li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endif; ?>

        <?php if (!empty($initiative['documents'])): ?>
          <div class="mt-10 border-t border-border pt-8">
            <h2 class="meta-label text-muted-foreground">Documents</h2>
            <ul class="mt-4 space-y-3">
              <?php foreach ($initiative['documents'] as $doc): ?>
                <li><a href="<?= e($doc['href']) ?>" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center gap-2 text-sm font-semibold text-foreground"><?= e($doc['title']) ?><?= icon('ArrowUpRight', 'h-4 w-4 text-primary') ?></a></li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endif; ?>

        <?php if (!empty($initiative['contacts'])): ?>
          <div class="mt-10 border-t border-border pt-8">
            <h2 class="meta-label text-muted-foreground">Report a concern</h2>
            <ul class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <?php foreach ($initiative['contacts'] as $contact): ?>
                <li>
                  <a href="<?= e($contact['href']) ?>"<?= ext_attrs($contact['href']) ?> class="group flex flex-col rounded-xl border border-border p-4 transition-colors hover:bg-secondary/60">
                    <span class="meta-label text-muted-foreground"><?= e($contact['label']) ?></span>
                    <span class="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground"><?= e($contact['value']) ?><?= icon('ArrowUpRight', 'h-3.5 w-3.5 text-primary') ?></span>
                  </a>
                </li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endif; ?>
      </div>
    </section>

    <?php if (!empty($initiative['gallery'])): ?>
      <section aria-labelledby="gallery-title" class="border-t border-border bg-secondary/40 py-14 lg:py-20">
        <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
          <h2 id="gallery-title" class="font-display text-2xl font-semibold tracking-tight text-foreground">Photo gallery</h2>
          <?= $photoGrid($initiative['gallery']) ?>
        </div>
      </section>
    <?php endif; ?>

    <?php foreach ($initiative['events'] ?? [] as $i => $ev): ?>
      <section aria-labelledby="event-title-<?= $i ?>" class="border-t border-border bg-secondary/40 py-14 lg:py-20">
        <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 id="event-title-<?= $i ?>" class="font-display text-2xl font-semibold tracking-tight text-foreground"><?= e($ev['title']) ?></h2>
            <?php if (!empty($ev['date'])): ?><span class="text-sm font-medium text-muted-foreground"><?= e($ev['date']) ?></span><?php endif; ?>
          </div>
          <?php if (!empty($ev['video'])): ?>
            <div <?= reveal('mt-8') ?>><figure class="overflow-hidden rounded-2xl bg-secondary"><?= $video($ev['video'], 'aspect-video w-full') ?></figure></div>
          <?php endif; ?>
          <?= $photoGrid($ev['gallery']) ?>
        </div>
      </section>
    <?php endforeach; ?>

    <section class="border-t border-border py-16 text-center lg:py-20">
      <div class="mx-auto max-w-xl px-6 lg:px-12">
        <h2 class="font-display text-2xl font-semibold tracking-tight text-foreground">Get involved</h2>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Reach the secretariat to support or take part in this programme.</p>
        <a href="mailto:advocacy@aak.or.ke" class="group btn-primary mt-7">Contact advocacy@aak.or.ke <?= icon('ArrowUpRight') ?></a>
      </div>
    </section>
  </article>
</main>
