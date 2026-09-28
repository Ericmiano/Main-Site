<?php
/** Homepage: ported section by section from src/routes/index.tsx. */
$page['title'] = 'AAK | Architectural Association of Kenya';
$page['description'] = 'The Architectural Association of Kenya unites eight built-environment chapters. Explore events, awards, green building standards and member services.';

$events = sorted_events();
$page['head'] = json_ld([
    '@context' => 'https://schema.org',
    '@graph' => [
        [
            '@type' => 'Organization',
            '@id' => SITE_URL . '/#organization',
            'name' => SITE_NAME,
            'alternateName' => 'AAK',
            'url' => SITE_URL,
            'foundingDate' => '1967',
            'description' => $page['description'],
            'address' => ['@type' => 'PostalAddress', 'addressLocality' => 'Nairobi', 'addressCountry' => 'KE'],
        ],
        [
            '@type' => 'ItemList',
            'name' => 'Upcoming AAK events',
            'itemListElement' => array_map(function ($event, $i) {
                return [
                    '@type' => 'ListItem',
                    'position' => $i + 1,
                    'item' => array_filter([
                        '@type' => 'Event',
                        'name' => $event['title'],
                        'startDate' => $event['isoDate'],
                        'endDate' => $event['endIsoDate'] ?? null,
                        'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                        'eventStatus' => 'https://schema.org/EventScheduled',
                        'location' => ['@type' => 'Place', 'name' => $event['location']],
                        'url' => SITE_URL . '/events/' . $event['slug'],
                        'organizer' => ['@id' => SITE_URL . '/#organization'],
                    ]),
                ];
            }, $events, array_keys($events)),
        ],
    ],
]);
?>
<main>
<?php
foreach ([
    'hero', 'member-stats', 'origin', 'events-strip', 'spotlight', 'biennale', 'initiatives',
    'statement', 'chapters', 'partners', 'media-grid', 'featured-firm', 'membership',
] as $section) {
    require APP_DIR . '/views/home/' . $section . '.php';
}
?>
</main>
<?php require APP_DIR . '/views/home/section-indicator.php'; ?>
