<?php
/** Page not found (src/components/site/NotFound.tsx). Sent with a 404 status. */
$page['title'] = 'Page not found | ' . SITE_NAME;
$page['noindex'] = true;
$page['bare'] = true;
$destinations = [
    ['/events', 'Events', "What's on at AAK"],
    ['/membership', 'Membership', 'Join, renew and fees'],
    ['/resources', 'Resource centre', 'Reports and documents'],
    ['/faqs', 'FAQs', 'Quick answers'],
    ['/contact', 'Contact', 'Reach the secretariat'],
];
?>
<main class="min-h-screen bg-background">
  <div class="mx-auto flex min-h-screen max-w-[1400px] flex-col px-6 py-10 lg:px-12">
    <a href="/" class="flex w-fit items-center gap-3" aria-label="AAK home">
      <img src="<?= e(asset('img/aak-logo-mark.webp')) ?>" alt="" width="40" height="40" class="h-10 w-10">
      <span class="font-display text-xl font-bold tracking-[0.16em] text-foreground">AAK</span>
    </a>
    <div class="my-auto grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
      <div>
        <p class="meta-label border-t border-border pt-5 text-foreground/70">Error 404 &middot; Page not found</p>
        <h1 class="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-balance text-foreground sm:text-7xl">This page isn&rsquo;t here.</h1>
        <p class="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">It may have moved when the AAK website was rebuilt, or the address may be mistyped. Try one of these instead, or start from the homepage.</p>
        <a href="/" class="group btn-primary mt-8">Go to the homepage</a>
      </div>
      <ul class="border-t border-border">
        <?php foreach ($destinations as [$href, $label, $hint]): ?>
          <li class="border-b border-border">
            <a href="<?= e($href) ?>" class="group flex items-center justify-between gap-4 py-4 text-foreground">
              <span>
                <span class="type-title block"><?= e($label) ?></span>
                <span class="text-sm text-muted-foreground"><?= e($hint) ?></span>
              </span>
              <?= icon('ArrowUpRight', 'h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5') ?>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</main>
