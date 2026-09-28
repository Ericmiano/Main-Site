<?php
/** Events index (src/routes/events.index.tsx). */
$page['title'] = 'Events | ' . SITE_NAME;
$page['description'] = "AAK's calendar of association-wide events: the Annual Convention, the Nairobi Biennale of Architecture & Art, the Sports & Wellness Day and the Urban Thinkers Campus.";
$trail = [['Events', null]];
$events = sorted_events();
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld($trail),
    ['@type' => 'ItemList', 'name' => 'AAK events', 'itemListElement' => array_map(function ($event, $i) {
        return ['@type' => 'ListItem', 'position' => $i + 1, 'item' => event_ld($event)];
    }, $events, array_keys($events))],
]]);
$card = 'group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7 transition-colors duration-300 hover:border-primary/60';
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-14 lg:py-20">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= breadcrumb($trail) ?>
      <div <?= reveal('mt-8') ?>>
        <div class="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground"><?= icon('Calendar', 'h-4 w-4 text-primary') ?><span>Ongoing &amp; upcoming</span></div>
        <h1 class="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">What&rsquo;s happening at AAK</h1>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground"><?= e($page['description']) ?></p>
        <div class="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a href="/documents/2026-AAK-Calendar-of-Events.pdf" target="_blank" rel="noopener noreferrer" class="group btn-primary"><?= icon('FileDownload') ?> 2026 calendar of events (PDF)</a>
          <a href="https://members.aak.or.ke/publicevents" target="_blank" rel="noopener noreferrer" class="link-quiet text-foreground">Register for events on the member portal</a>
        </div>
      </div>
    </div>
  </section>

  <section aria-labelledby="events-list-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="events-list-title" class="sr-only">All events</h2>
      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach ($events as $i => $event):
            $status = event_status($event);
            $href = $event['externalSiteHref'] ?? '/events/' . $event['slug'];
        ?>
          <li>
            <div <?= reveal('h-full', $i * 60) ?>>
              <a href="<?= e($href) ?>"<?= ext_attrs($href) ?> class="<?= $card ?>">
                <div>
                  <div class="flex items-center gap-3">
                    <span class="<?= e(cx('meta-label inline-flex items-center gap-2 px-3 py-1', $status === 'ongoing' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')) ?>">
                      <?php if ($status === 'ongoing'): ?><span class="pulse-dot h-1.5 w-1.5 bg-primary-foreground"></span><?php endif; ?>
                      <?= $status === 'ongoing' ? 'Ongoing' : ($status === 'past' ? 'Past' : 'Upcoming') ?>
                    </span>
                    <span class="text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><?= e($event['kicker']) ?></span>
                  </div>
                  <h3 class="mt-6 font-display text-xl font-semibold leading-snug text-foreground"><?= e($event['title']) ?></h3>
                  <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><?= e($event['summary']) ?></p>
                  <div class="mt-5 space-y-2 text-sm text-muted-foreground">
                    <p class="flex items-center gap-2"><?= icon('Calendar', 'h-4 w-4 text-primary') ?><time datetime="<?= e($event['isoDate']) ?>"><?= e($event['date']) ?></time></p>
                    <p class="flex items-center gap-2"><?= icon('MapPin', 'h-4 w-4 text-primary') ?><?= e($event['location']) ?></p>
                  </div>
                  <?= countdown($event, 'mt-3 inline-block text-xs font-semibold text-primary') ?>
                </div>
                <span class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground">View details <?= icon('ArrowUpRight', 'h-4 w-4 text-primary') ?></span>
              </a>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>
</main>
