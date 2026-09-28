<?php
/** Site footer, ported from src/components/site/Footer.tsx. */
$associationLinks = [
    ['About Us', '/about'],
    ['Programmes', '/programs'],
    ['Corporate Social Responsibility', '/csr'],
    ['Membership', '/membership'],
    ['AAK Leadership', '/team'],
    ['Contact us', '/contact'],
];
$resourceLinks = [
    ['Events', '/events'],
    ['Resource Centre', '/resources'],
    // Arbitration: on hold while the page is being finished. Re-add once ready.
    ['Awards & Honours', '/awards'],
    ['Student affiliates', '/students'],
    ['Store', '/store'],
    ['Initiatives', '/#initiatives'],
    ['Members Directory', 'https://members.aak.or.ke/directory'],
    ['Validate Certificate', 'https://members.aak.or.ke/validate'],
];
$social = [
    ['X (Twitter)', 'https://x.com/Arch_KE'],
    ['LinkedIn', 'https://ke.linkedin.com/company/architectural-association-of-kenya'],
    ['Facebook', 'https://www.facebook.com/ArchKE/'],
    ['Instagram', 'https://www.instagram.com/arch_ke/'],
    ['YouTube', 'https://www.youtube.com/@architecturalassociationof854'],
    ['TikTok', 'https://www.tiktok.com/@aak_kenya'],
];
$policyLinks = [
    ['FAQs', '/faqs'],
    ['Accessibility', '/accessibility'],
    ['Privacy', '/privacy'],
    ['Terms of use', '/terms'],
    ['Cookies', '/cookies'],
];
$link = 'link-underline transition-colors hover:text-background';

$column = function (string $title, array $links) use ($link): void { ?>
  <nav aria-label="<?= e($title) ?>">
    <h3 class="meta-label text-background/50"><?= e($title) ?></h3>
    <ul class="mt-5 space-y-3 text-sm text-background/85">
      <?php foreach ($links as [$label, $href]): ?>
        <li><a class="<?= $link ?>" href="<?= e($href) ?>"<?= ext_attrs($href) ?>><?= e($label) ?></a></li>
      <?php endforeach; ?>
    </ul>
  </nav>
<?php };
?>
<footer class="bg-ink-deep text-background">
  <div class="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
    <div class="grid gap-14 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr]">
      <div>
        <div class="flex items-center gap-3">
          <img src="<?= e(asset('img/aak-logo-mark.webp')) ?>" alt="" class="h-10 w-10 object-contain" width="40" height="40">
          <p class="font-display text-2xl font-bold tracking-[0.16em]">AAK</p>
        </div>
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
          The Architectural Association of Kenya has united professionals across the built and natural environment since 1967.
        </p>
        <address class="mt-6 space-y-1 text-sm not-italic text-background/60">
          <p>Blue Violets Plaza, 6th Floor, Room 605</p>
          <p>Kindaruma Rd, Off Ngong Rd</p>
          <p>P.O. Box 44258-00100, Nairobi, Kenya</p>
          <p><a class="<?= $link ?>" href="mailto:aak@aak.or.ke">aak@aak.or.ke</a></p>
        </address>
      </div>

      <?php $column('Chapters', array_map(function ($c) {
          return [$c['name'], '/chapters/' . $c['slug']];
      }, data('site', 'chapters'))); ?>
      <?php $column('Association', $associationLinks); ?>
      <?php $column('Resources', $resourceLinks); ?>

      <div>
        <h3 class="meta-label text-background/50">Follow</h3>
        <ul class="mt-5 space-y-3 text-sm text-background/85">
          <?php foreach ($social as [$label, $href]): ?>
            <li><a class="<?= $link ?>" href="<?= e($href) ?>" target="_blank" rel="noopener noreferrer"><?= e($label) ?></a></li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>

    <div class="mt-16 flex flex-col gap-4 border-t border-background/15 pt-8 text-xs text-background/65 lg:flex-row lg:items-center lg:justify-between">
      <p>&copy; <?= date('Y') ?> Architectural Association of Kenya. All rights reserved.</p>
      <nav aria-label="Help and policies">
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          <?php foreach ($policyLinks as [$label, $href]): ?>
            <li><a href="<?= e($href) ?>" class="<?= $link ?>"><?= e($label) ?></a></li>
          <?php endforeach; ?>
        </ul>
      </nav>
    </div>
  </div>
</footer>
