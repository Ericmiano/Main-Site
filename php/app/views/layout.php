<?php
/** @var array $page  @var string $content */
$fullTitle = $page['title'];
$canonical = SITE_URL . ($page['path'] === '/' ? '/' : $page['path']);
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($fullTitle) ?></title>
  <meta name="description" content="<?= e($page['description']) ?>">
  <?php if ($page['noindex']): ?><meta name="robots" content="noindex"><?php endif; ?>
  <meta property="og:site_name" content="<?= e(SITE_NAME) ?>">
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?= e($fullTitle) ?>">
  <meta property="og:description" content="<?= e($page['description']) ?>">
  <meta property="og:url" content="<?= e($canonical) ?>">
  <meta property="og:image" content="<?= e($page['image'] ?? SITE_URL . '/og-image.jpg') ?>">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="<?= e($canonical) ?>">
  <link rel="stylesheet" href="<?= e(asset('css/site.css')) ?>">
  <!-- Self-hosted fonts: preload the two the first screen uses. -->
  <link rel="preload" href="/fonts/libre-baskerville-700-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/ibm-plex-sans-400-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
  <link rel="icon" href="/favicon-192x192.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <!-- Without JavaScript, scroll-reveal content must still show. -->
  <noscript><style>.reveal{opacity:1;transform:none}.wipe{clip-path:none}.hero-item{opacity:1;animation:none}</style></noscript>
  <?= $page['head'] ?>
  <script src="<?= e(asset('js/site.js')) ?>" defer></script>
</head>
<body>
<?php if (!$page['bare']) {
    require APP_DIR . '/views/header.php';
} ?>
<?= $content ?>
<?php if (!$page['bare']) {
    require APP_DIR . '/views/footer.php';
    require APP_DIR . '/views/info-dialog.php';
} ?>
</body>
</html>
