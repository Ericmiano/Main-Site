<?php
/**
 * Site header: utility strip, red main bar with mega menus, and the
 * full-screen mobile menu. Behaviour lives in assets/js/site.js (the
 * data-* hooks); state is expressed as attributes so Tailwind variants
 * style it: data-scrolled on <header>, aria-expanded on triggers.
 */
$navMenu = data('site', 'navMenu');
$initiatives = data('site', 'initiatives');
$platforms = data('site', 'aakPlatforms');
$utilityLinks = data('site', 'utilityLinks');
$portal = data('site', 'memberPortalUrl');
$logo = asset('img/aak-logo-horizontal.webp');

$menuLabel = function (array $entry): string {
    return $entry['type'] === 'initiatives' ? 'Initiatives' : $entry['label'];
};
$initiativeHrefs = array_map('initiative_href', $initiatives);
$mobileLink = 'flex min-h-11 items-center text-base text-background/65 transition-colors hover:text-background';
?>
<header data-header class="group/header sticky top-0 z-50 bg-background">
  <div class="hidden max-h-9 overflow-hidden bg-ink-deep text-background transition-[max-height] duration-300 group-data-[scrolled]/header:max-h-0 lg:block">
    <div class="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-6 text-[11px] tracking-[0.14em] uppercase lg:px-12">
      <p class="text-background/50">Blue Violets Plaza, Kindaruma Rd, Off Ngong Rd, Nairobi</p>
      <ul class="flex items-center gap-7">
        <?php foreach ($utilityLinks as $link): ?>
          <li><a href="<?= e($link['href']) ?>"<?= ext_attrs($link['href']) ?> class="text-background/60 transition-colors hover:text-background focus-visible:text-background"><?= e($link['label']) ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>

  <div data-nav class="relative bg-primary">
    <div class="mx-auto flex max-w-[1400px] items-stretch justify-between px-6 lg:px-12">
      <a href="/" aria-label="Architectural Association of Kenya, home" class="flex items-center py-4 transition-[padding] duration-300 group-data-[scrolled]/header:py-2.5">
        <span class="flex items-center rounded-lg bg-background px-3 py-2">
          <img src="<?= e($logo) ?>" width="405" height="96" alt="AAK — Promoting excellence in the built environment" class="h-8 w-auto object-contain transition-[height] duration-300 group-data-[scrolled]/header:h-7">
        </span>
      </a>

      <nav aria-label="Primary" class="hidden items-stretch lg:flex">
        <ul class="flex items-stretch">
          <?php foreach ($navMenu as $entry): ?>
            <?php if ($entry['type'] === 'link'): ?>
              <li class="flex">
                <a href="<?= e($entry['href']) ?>"<?= ext_attrs($entry['href']) ?> class="group relative flex items-center border-l border-primary-foreground/20 px-6 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground">
                  <?= e($entry['label']) ?>
                  <span class="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary-foreground transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"></span>
                </a>
              </li>
            <?php else: $label = $menuLabel($entry); ?>
              <li class="flex">
                <button type="button" aria-haspopup="true" aria-expanded="false" data-menu-trigger="<?= e($label) ?>" class="group relative flex items-center gap-1.5 border-l border-primary-foreground/20 px-6 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground aria-expanded:text-primary-foreground">
                  <?= e($label) ?>
                  <?= icon('ChevronDown', 'h-3.5 w-3.5 transition-transform duration-300 group-aria-expanded:rotate-180') ?>
                  <span class="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary-foreground transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 group-aria-expanded:scale-x-100"></span>
                </button>
              </li>
            <?php endif; ?>
          <?php endforeach; ?>
          <li class="flex items-center pl-2">
            <button type="button" data-search-open aria-label="Search the site" class="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground">
              <?= icon('Search', 'h-5 w-5') ?>
            </button>
          </li>
          <li class="flex items-center pl-2">
            <a href="<?= e($portal) ?>" target="_blank" rel="noopener noreferrer" class="rounded-xl bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-ink-deep hover:text-background">Member log in</a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2 lg:hidden">
        <button type="button" data-search-open aria-label="Search the site" class="my-2 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary-foreground/30 text-primary-foreground">
          <?= icon('Search', 'h-4 w-4') ?>
        </button>
        <button type="button" data-mobile-toggle aria-expanded="false" aria-controls="mobile-nav" class="group meta-label my-2 inline-flex min-h-11 items-center gap-3 rounded-xl border border-primary-foreground/30 px-4 text-primary-foreground">
          <span class="group-aria-expanded:hidden">Menu</span><span class="hidden group-aria-expanded:inline">Close</span>
          <span aria-hidden="true" class="flex flex-col gap-1">
            <span class="block h-px w-5 bg-primary-foreground transition-transform duration-300 group-aria-expanded:translate-y-[3px] group-aria-expanded:rotate-45"></span>
            <span class="block h-px w-5 bg-primary-foreground transition-transform duration-300 group-aria-expanded:-translate-y-[3px] group-aria-expanded:-rotate-45"></span>
          </span>
        </button>
      </div>
    </div>

    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5 bg-primary-foreground/15">
      <div data-progress class="h-full origin-left scale-x-0 bg-primary-foreground/80"></div>
    </div>

    <?php foreach ($navMenu as $entry): if ($entry['type'] === 'link') {
        continue;
    } $label = $menuLabel($entry); ?>
      <div data-menu-panel="<?= e($label) ?>" hidden class="absolute inset-x-0 top-full z-40 hidden animate-in fade-in slide-in-from-top-2 border-t border-background/10 bg-ink-deep text-background shadow-2xl duration-200 lg:block">
        <div class="mx-auto max-w-[1400px] px-6 py-10 lg:px-12">
          <?php if ($entry['type'] === 'initiatives'): ?>
            <h3 class="font-display text-2xl font-semibold text-background">AAK Initiatives</h3>
            <ul class="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <?php foreach ($initiatives as $initiative): ?>
                <li>
                  <?= initiative_link_open($initiative, 'group flex items-center gap-3') ?>
                    <span class="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-secondary">
                      <img src="<?= e($initiative['image']) ?>" alt="" loading="lazy" class="h-full w-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0">
                    </span>
                    <span>
                      <span class="block text-sm font-semibold text-background transition-colors group-hover:text-primary"><?= e($initiative['title']) ?></span>
                      <span class="<?= e(cx('block text-xs', $initiative['tone'] === 'green' ? 'text-sustain' : 'text-primary/80')) ?>"><?= e($initiative['eyebrow']) ?></span>
                    </span>
                  </a>
                </li>
              <?php endforeach; ?>
            </ul>
            <div class="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-background/10 pt-6">
              <span class="meta-label text-background/50">More from AAK</span>
              <?php foreach ($platforms as $link): ?>
                <a href="<?= e($link['href']) ?>"<?= ext_attrs($link['href']) ?> class="link-underline text-sm font-medium text-background/85 transition-colors hover:text-background"><?= e($link['label']) ?></a>
              <?php endforeach; ?>
            </div>
          <?php else: ?>
            <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_2fr]">
              <div>
                <p class="meta-label text-background/60"><?= e($entry['label']) ?></p>
                <?php if (!empty($entry['description'])): ?>
                  <p class="mt-3 max-w-xs text-sm leading-relaxed text-background/65"><?= e($entry['description']) ?></p>
                <?php endif; ?>
              </div>
              <ul class="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                <?php foreach ($entry['links'] as $link): ?>
                  <li><a href="<?= e($link['href']) ?>"<?= ext_attrs($link['href']) ?> class="link-underline inline-flex min-h-11 items-center text-[0.95rem] font-medium text-background/85 transition-colors hover:text-background"><?= e($link['label']) ?></a></li>
                <?php endforeach; ?>
              </ul>
            </div>
          <?php endif; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Site menu" hidden class="animate-in fade-in fixed inset-0 z-50 flex flex-col bg-ink-deep text-background duration-200 lg:hidden">
    <div class="flex items-center justify-between border-b border-background/15 px-6 py-4">
      <a href="/" aria-label="Architectural Association of Kenya, home" class="flex items-center">
        <span class="flex items-center rounded-lg bg-background px-3 py-2">
          <img src="<?= e($logo) ?>" alt="" width="405" height="96" class="h-7 w-auto object-contain">
        </span>
      </a>
      <button type="button" data-mobile-close aria-label="Close menu" class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-background/25 text-background">
        <?= icon('X', 'h-5 w-5') ?>
      </button>
    </div>
    <nav aria-label="Mobile" class="flex-1 overflow-y-auto px-6 py-6">
      <ul>
        <?php foreach ($navMenu as $i => $entry): $num = str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT); ?>
          <?php if ($entry['type'] === 'link'): ?>
            <li class="border-b border-background/12">
              <a href="<?= e($entry['href']) ?>"<?= ext_attrs($entry['href']) ?> class="group flex min-h-16 items-baseline gap-4 py-4">
                <span class="font-display text-xs text-background/35"><?= $num ?></span>
                <span class="font-display text-2xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary sm:text-3xl"><?= e($entry['label']) ?></span>
              </a>
            </li>
          <?php else: $label = $menuLabel($entry); ?>
            <li class="border-b border-background/12">
              <details class="group/acc">
                <summary class="flex min-h-16 cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
                  <span class="flex items-baseline gap-4">
                    <span class="font-display text-xs text-background/35"><?= $num ?></span>
                    <span class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"><?= e($label) ?></span>
                  </span>
                  <?= icon('ChevronDown', 'h-4 w-4 shrink-0 opacity-60 transition-transform duration-200 group-open/acc:rotate-180') ?>
                </summary>
                <ul class="space-y-1 py-2 pb-4 pl-9">
                  <?php if ($entry['type'] === 'initiatives'): ?>
                    <?php foreach ($initiatives as $initiative): ?>
                      <li><?= initiative_link_open($initiative, $mobileLink) ?><?= e($initiative['title']) ?></a></li>
                    <?php endforeach; ?>
                    <?php foreach ($platforms as $link): if (in_array($link['href'], $initiativeHrefs, true)) {
                        continue; // Already listed as an initiative (BuildHub).
                    } ?>
                      <li><a href="<?= e($link['href']) ?>"<?= ext_attrs($link['href']) ?> class="<?= $mobileLink ?>"><?= e($link['label']) ?></a></li>
                    <?php endforeach; ?>
                  <?php else: ?>
                    <?php foreach ($entry['links'] as $link): ?>
                      <li><a href="<?= e($link['href']) ?>"<?= ext_attrs($link['href']) ?> class="<?= $mobileLink ?>"><?= e($link['label']) ?></a></li>
                    <?php endforeach; ?>
                  <?php endif; ?>
                </ul>
              </details>
            </li>
          <?php endif; ?>
        <?php endforeach; ?>
      </ul>
      <a href="<?= e($portal) ?>" target="_blank" rel="noopener noreferrer" class="group btn-primary mt-8 w-full justify-center">Member log in</a>
    </nav>
  </div>
</header>
