<?php
/** Statement hero after RIBA's (src/components/home/Hero.tsx). */
$names = array_column(data('site', 'chapters'), 'name');
$chapterList = implode(', ', array_slice($names, 0, -1)) . ' and ' . end($names);
$next = null;
foreach (sorted_events() as $event) {
    if (event_status($event) !== 'past') {
        $next = $event;
        break;
    }
}
$img = function (int $w): string {
    return asset('img/hero-swiss-chancery-' . $w . '.webp');
};
?>
<section aria-labelledby="hero-title" class="bg-background">
  <div class="mx-auto grid max-w-[1400px] gap-8 px-6 pt-12 pb-10 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-16 lg:px-12 lg:pt-14 lg:pb-12">
    <div>
      <p class="meta-label text-foreground/70">The Architectural Association of Kenya &middot; Est. 1967</p>
      <h1 id="hero-title" class="mt-5 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-balance text-primary sm:text-6xl lg:text-7xl">
        Promoting excellence in the built environment.
      </h1>
    </div>
    <div class="hero-item hero-delay-1 lg:pb-2">
      <p class="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        The umbrella professional body for Kenya&rsquo;s built and natural environment, uniting eight chapters: <span class="text-foreground"><?= e($chapterList) ?></span>.
      </p>
      <div class="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
        <a href="/membership" class="group btn-primary">
          Join AAK
          <?= icon('ArrowRight', 'h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5') ?>
        </a>
        <a href="#events" class="link-quiet">What&rsquo;s on</a>
      </div>
    </div>
  </div>

  <div class="relative isolate h-[58svh] min-h-[22rem] overflow-hidden bg-ink-deep lg:h-[68svh]">
    <img src="<?= e($img(1280)) ?>"
         srcset="<?= e($img(640)) ?> 640w, <?= e($img(960)) ?> 960w, <?= e($img(1280)) ?> 1280w"
         sizes="100vw" width="1280" height="578" fetchpriority="high"
         alt="The Swiss Chancery in Nairobi: a rust-red building with deep-set windows above a sloping lawn"
         class="absolute inset-0 h-full w-full object-cover object-[50%_60%] hero-zoom">
    <p class="absolute top-3 right-4 z-10 rounded-sm bg-ink-deep/70 px-2 py-1 text-[0.6875rem] text-background/90 lg:top-auto lg:right-12 lg:bottom-3">
      Swiss Chancery, Nairobi &middot; DMJ Architects
    </p>

    <?php if ($next): ?>
      <a href="/events/<?= e($next['slug']) ?>" class="hero-item hero-delay-2 group absolute bottom-2 -left-6 w-[min(34rem,calc(100%-1.5rem))] origin-bottom-left -rotate-3 bg-primary py-7 pr-16 pl-12 text-primary-foreground shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] transition-transform duration-300 hover:-rotate-2 sm:bottom-4 sm:py-9 sm:pl-[4.5rem] lg:top-[max(1.5rem,calc(100svh-39rem))] lg:bottom-auto lg:w-[calc(max(0px,(100vw-1400px)/2)+38rem)] lg:pl-[calc(max(0px,(100vw-1400px)/2)+4.5rem)]">
        <?= icon('ArrowUpRight', 'absolute top-5 right-5 h-9 w-9 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-11 sm:w-11', 2.6) ?>
        <span class="meta-label block text-primary-foreground/85">
          <?= event_status($next) === 'ongoing' ? 'Happening now' : 'Next up' ?> &middot; <?= e(format_date($next['isoDate'], 'j F')) ?>
        </span>
        <span class="mt-2 block font-display text-2xl font-semibold leading-tight text-balance sm:text-3xl"><?= e($next['title']) ?></span>
        <?= countdown($next, 'mt-2 block text-sm font-semibold text-primary-foreground/85') ?>
      </a>
    <?php endif; ?>
  </div>
</section>
