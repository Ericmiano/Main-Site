<?php
/** "What's happening at AAK" timeline (src/components/home/EventsStrip.tsx). */
$upcoming = array_values(array_filter(sorted_events(), function ($event) {
    return event_status($event) !== 'past';
}));
$card = 'group grid gap-4 py-8 sm:grid-cols-[5rem_1fr] sm:items-center lg:grid-cols-[8rem_1fr_auto] lg:gap-8';
?>
<section id="events" aria-labelledby="events-title" class="bg-ink-deep py-20 lg:py-28">
  <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
    <div <?= reveal() ?>><?= section_rule('02', 'AAK now', 'dark') ?></div>
    <div <?= reveal('mt-8 grid gap-8 border-b border-background/12 pb-10 lg:grid-cols-[1fr_auto] lg:items-end') ?>>
      <div>
        <h2 id="events-title" class="type-section mt-4 text-background">What&rsquo;s happening at AAK</h2>
        <a href="/events" class="link-quiet mt-5 text-background/80">See the full calendar</a>
      </div>
      <blockquote class="max-w-sm border-l-2 border-primary/60 pl-5 lg:pl-6">
        <p class="font-accent text-base font-medium italic leading-snug text-background/85 sm:text-lg">&ldquo;Shifting the Center: reclaiming Africa&rsquo;s architecture and future.&rdquo;</p>
        <footer class="meta-label mt-3 text-background/65">Nairobi Biennale of Architecture &amp; Art, 2026 theme</footer>
      </blockquote>
    </div>

    <ul>
      <?php $prevMonth = null; foreach ($upcoming as $event):
          $status = event_status($event);
          $month = format_date($event['isoDate'], 'F');
          $href = $event['externalSiteHref'] ?? '/events/' . $event['slug'];
      ?>
        <li class="border-b border-background/12 first:border-t">
          <a href="<?= e($href) ?>"<?= ext_attrs($href) ?> class="<?= $card ?>">
            <?php if ($month !== $prevMonth): ?>
              <span class="meta-label -mb-2 text-background/60 sm:col-span-full"><?= e($month) ?></span>
            <?php endif; $prevMonth = $month; ?>
            <span class="font-display text-5xl font-semibold text-background/90 lg:text-6xl"><?= e(format_date($event['isoDate'], 'd')) ?></span>
            <div>
              <div class="flex items-center gap-3">
                <span class="<?= e(cx('meta-label', $status === 'ongoing' ? 'text-primary' : 'text-background/50')) ?>"><?= $status === 'ongoing' ? 'Ongoing' : 'Upcoming' ?></span>
                <span class="meta-label text-background/50"><?= e($event['kicker']) ?></span>
              </div>
              <h3 class="mt-2 font-display text-2xl font-semibold leading-snug text-background transition-colors duration-300 group-hover:text-primary"><?= e($event['title']) ?></h3>
              <p class="mt-2 flex items-center gap-2 text-sm text-background/65"><?= icon('MapPin', 'h-4 w-4 text-primary') ?><?= e($event['location']) ?></p>
              <?= countdown($event, 'mt-2 inline-block text-xs font-semibold text-[oklch(0.75_0.13_38.5)]') ?>
            </div>
            <span class="inline-flex items-center gap-2 text-sm font-semibold text-background">
              View event <?= icon('ArrowUpRight', 'h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5') ?>
            </span>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>

    <div <?= reveal('mt-10 flex flex-wrap items-center justify-between gap-6') ?>>
      <p class="text-sm text-background/65">Conventions, CPD sessions, site visits and more across the year.</p>
      <a href="/events" class="group btn-primary">
        View all events <?= icon('ArrowUpRight', 'h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5') ?>
      </a>
    </div>
  </div>
</section>
