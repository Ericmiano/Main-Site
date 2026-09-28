<?php
/**
 * FAQs / Accessibility / Privacy / Terms / Cookies (src/components/site/
 * InfoPage.tsx). With ?fragment=1 it returns only the notice body plus its
 * metadata, for the pop-up (views/info-dialog.php + site.js).
 * $doc (metadata) and $docKey come from the router.
 */
$page['title'] = $doc['title'] . ' | ' . SITE_NAME;
$page['description'] = $doc['description'];
$page['noindex'] = $doc['draft'];

ob_start();
require APP_DIR . '/views/info/' . $docKey . '.php';
$body = (string) ob_get_clean();

if (($_GET['fragment'] ?? '') === '1') {
    $page['fragment'] = true;
    header('X-Robots-Tag: noindex');
    ?><div data-info-doc data-title="<?= e($doc['title']) ?>" data-intro="<?= e($doc['intro']) ?>" data-updated="<?= e($doc['updated']) ?>"<?= $doc['draft'] ? ' data-draft' : '' ?>><?= $body ?></div><?php
    return;
}
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-14 lg:py-20">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= breadcrumb([[$doc['title'], null]]) ?>
      <div class="mt-8 max-w-3xl">
        <p class="meta-label border-t border-border pt-5 text-muted-foreground">Last updated <?= e($doc['updated']) ?></p>
        <h1 class="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"><?= e($doc['title']) ?></h1>
        <p class="mt-5 text-base leading-relaxed text-muted-foreground"><?= e($doc['intro']) ?></p>
      </div>
    </div>
  </section>
  <div class="mx-auto max-w-[1400px] px-6 py-14 lg:px-12 lg:py-20">
    <?php if ($doc['draft']) {
        echo draft_notice('mb-10 max-w-3xl');
    } ?>
    <div class="info-prose max-w-3xl"><?= $body ?></div>
  </div>
</main>
