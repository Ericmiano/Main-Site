<?php
/** Document archive page (src/components/site/ReportArchive.tsx). $archive from the router. */
[$title, $description, $eyebrow, $docsKey] = $archive;
$documents = data('report-archives', $docsKey) ?? [];
$page['title'] = $title . ' | ' . SITE_NAME;
$page['description'] = $description;
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-14 lg:py-20">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= breadcrumb([['Resource Centre', '/resources'], [$title, null]]) ?>
      <div <?= reveal('mt-8 max-w-2xl') ?>>
        <div class="meta-label flex items-center gap-3 text-muted-foreground"><span><?= e($eyebrow) ?></span></div>
        <h1 class="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"><?= e($title) ?></h1>
        <p class="mt-5 text-base leading-relaxed text-muted-foreground"><?= e($description) ?></p>
      </div>
    </div>
  </section>

  <section aria-labelledby="documents-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="documents-title" class="sr-only">Documents</h2>
      <?php if ($documents): ?>
        <ul class="border-t border-border">
          <?php foreach ($documents as $i => $doc): ?>
            <li>
              <div <?= reveal('', $i * 60) ?>>
                <a href="<?= e($doc['href']) ?>" target="_blank" rel="noopener noreferrer" class="group flex w-full flex-col gap-2 border-b border-border py-7 text-left transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                  <div class="flex items-start gap-6 sm:items-center">
                    <span class="pt-1 font-display text-xs tabular-nums text-muted-foreground sm:pt-0"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
                    <h3 class="font-display text-lg font-semibold leading-snug text-foreground sm:text-xl"><?= e($doc['title']) ?></h3>
                  </div>
                  <div class="flex items-center gap-4 pl-12 sm:pl-0">
                    <?php if (!empty($doc['year'])): ?><span class="text-xs uppercase tracking-[0.16em] text-muted-foreground"><?= e($doc['year']) ?></span><?php endif; ?>
                    <?= icon('ArrowUpRight', 'h-5 w-5 shrink-0 text-primary') ?>
                  </div>
                </a>
              </div>
            </li>
          <?php endforeach; ?>
        </ul>
      <?php else: ?>
        <p class="text-sm text-muted-foreground">No documents are currently listed for this category.</p>
      <?php endif; ?>
    </div>
  </section>
</main>
