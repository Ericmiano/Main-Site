<?php
/** Event detail (src/routes/events.$slug.tsx). $slug comes from the router. */
$event = find_by_slug(data('site', 'events'), $slug);
if (!$event) {
    // Same as the React route's notFoundComponent, with a real 404 status.
    http_response_code(404);
    $page['title'] = 'Event not found | ' . SITE_NAME;
    $page['noindex'] = true;
    ?>
    <main class="flex min-h-[50vh] items-center justify-center px-6 py-24 text-center">
      <div>
        <h1 class="font-display text-3xl font-semibold text-foreground">Event not found</h1>
        <p class="mt-3 text-sm text-muted-foreground">This event may have closed or the link may be out of date.</p>
        <a href="/events" class="group btn-primary mt-6 justify-center">View all events</a>
      </div>
    </main>
    <?php
    return;
}

$status = event_status($event);
$page['title'] = $event['title'] . ' | ' . SITE_NAME;
$page['description'] = $event['summary'];
$page['image'] = $event['image'];
$trail = [['Events', '/events'], [$event['title'], null]];

// Registration: an external URL, or a page on this site (registerTo).
if (!empty($event['registerTo'])) {
    $registerHref = $event['registerTo']['to'];
    if (!empty($event['registerTo']['params']['slug'])) {
        $registerHref = str_replace('$slug', $event['registerTo']['params']['slug'], $registerHref);
    }
    $registerUrl = SITE_URL . $registerHref;
} else {
    $registerHref = $event['registerHref'] ?? '#';
    $registerUrl = $registerHref;
}
$registerCta = function (string $class) use ($registerHref, $event): string {
    return '<a href="' . e($registerHref) . '"' . ext_attrs($registerHref) . ' class="' . e($class) . '">'
        . e($event['registerLabel']) . icon('ArrowUpRight') . '</a>';
};

$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld($trail),
    array_filter([
        '@type' => 'Event',
        'name' => $event['title'],
        'description' => $event['summary'],
        'startDate' => $event['isoDate'],
        'endDate' => $event['endIsoDate'] ?? null,
        'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
        'eventStatus' => 'https://schema.org/EventScheduled',
        'image' => $event['image'],
        'location' => ['@type' => 'Place', 'name' => $event['location'], 'address' => $event['venue']],
        'organizer' => ['@type' => 'Organization', 'name' => SITE_NAME, 'url' => SITE_URL],
        'offers' => ['@type' => 'Offer', 'url' => $registerUrl, 'availability' => 'https://schema.org/InStock'],
    ]),
]]);
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-10 lg:py-14">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12"><?= breadcrumb($trail) ?></div>
  </section>

  <article>
    <section class="py-14 lg:py-20">
      <div class="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-12">
        <div <?= reveal() ?>>
          <div class="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
            <span class="<?= $status === 'ongoing' ? 'inline-flex items-center gap-2 bg-primary px-3 py-1 text-primary-foreground' : 'inline-flex items-center gap-2 bg-secondary px-3 py-1 text-secondary-foreground' ?>">
              <?php if ($status === 'ongoing'): ?><span class="pulse-dot h-1.5 w-1.5 bg-primary-foreground"></span><?php endif; ?>
              <?= $status === 'ongoing' ? 'Ongoing' : ($status === 'past' ? 'Past' : 'Upcoming') ?>
            </span>
            <span><?= e($event['kicker']) ?></span>
          </div>
          <h1 class="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"><?= e($event['title']) ?></h1>
          <p class="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"><?= e($event['summary']) ?></p>

          <dl class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <?php foreach ($event['facts'] as $fact): ?>
              <div class="rounded-xl border border-border p-4">
                <dt class="meta-label text-muted-foreground"><?= e($fact['label']) ?></dt>
                <dd class="mt-1.5 text-sm font-medium text-foreground"><?= e($fact['value']) ?></dd>
              </div>
            <?php endforeach; ?>
          </dl>

          <div data-countdown="<?= e($event['isoDate']) ?>" data-countdown-end="<?= e($event['endIsoDate'] ?? $event['isoDate']) ?>" data-countdown-style="full" class="mt-8" hidden></div>

          <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <?= $registerCta('group btn-primary') ?>
            <?php if ($status !== 'past'): ?>
              <a href="/events/<?= e($event['slug']) ?>.ics" download class="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"><?= icon('CalendarPlus') ?> Add to calendar</a>
            <?php endif; ?>
            <a href="/events" class="link-quiet text-foreground">Back to all events</a>
          </div>
        </div>

        <div <?= reveal('', 120) ?>>
          <figure class="overflow-hidden rounded-2xl bg-secondary">
            <img src="<?= e($event['image']) ?>" alt="<?= e($event['imageAlt']) ?>" loading="lazy" class="aspect-4/3 w-full object-cover">
          </figure>
          <div class="mt-6 space-y-3 rounded-2xl border border-border p-6 text-sm text-muted-foreground">
            <p class="flex items-center gap-2"><?= icon('Calendar', 'h-4 w-4 shrink-0 text-primary') ?><time datetime="<?= e($event['isoDate']) ?>"><?= e($event['date']) ?></time></p>
            <p class="flex items-start gap-2"><?= icon('MapPin', 'mt-0.5 h-4 w-4 shrink-0 text-primary') ?><span><?= e($event['venue']) ?></span></p>
          </div>
        </div>
      </div>
    </section>

    <?php if (!empty($event['body'])): ?>
      <section aria-labelledby="event-details-title" class="border-t border-border py-14 lg:py-20">
        <div class="mx-auto max-w-3xl px-6 lg:px-12">
          <h2 id="event-details-title" class="sr-only">About this event</h2>
          <div class="space-y-6 text-base leading-relaxed text-muted-foreground">
            <?php foreach ($event['body'] as $paragraph): ?><p><?= e($paragraph) ?></p><?php endforeach; ?>
          </div>
        </div>
      </section>
    <?php endif; ?>

    <?php if (!empty($event['agenda'])): ?>
      <section aria-labelledby="event-agenda-title" class="border-t border-border bg-secondary/40 py-14 lg:py-20">
        <div class="mx-auto max-w-3xl px-6 lg:px-12">
          <h2 id="event-agenda-title" class="font-display text-2xl font-semibold tracking-tight text-foreground">Programme</h2>
          <ol class="mt-8 space-y-6 border-l border-border pl-6">
            <?php foreach ($event['agenda'] as $item): ?>
              <li class="relative">
                <span class="absolute top-1 -left-[1.6rem] h-2.5 w-2.5 bg-primary" aria-hidden="true"></span>
                <p class="meta-label text-muted-foreground"><?= e($item['time']) ?></p>
                <p class="mt-1 text-sm font-medium text-foreground"><?= e($item['label']) ?></p>
              </li>
            <?php endforeach; ?>
          </ol>
        </div>
      </section>
    <?php endif; ?>

    <section class="border-t border-border py-16 text-center lg:py-20">
      <div class="mx-auto max-w-xl px-6 lg:px-12">
        <h2 class="font-display text-2xl font-semibold tracking-tight text-foreground">Ready to take part?</h2>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><?= e($event['cta']) ?></p>
        <?= $registerCta('group btn-primary mt-7') ?>
      </div>
    </section>
  </article>
</main>
