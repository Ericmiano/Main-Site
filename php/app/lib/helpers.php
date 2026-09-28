<?php
/**
 * Template helpers shared by every page. Written for PHP 7.4+ so it runs on
 * any current cPanel host.
 */

declare(strict_types=1);

const SITE_URL = 'https://aak.or.ke';
const SITE_NAME = 'Architectural Association of Kenya';

/** Escape for HTML text and attribute values. */
function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Join class names, skipping empty ones (the PHP twin of `cn`). */
function cx(...$classes): string
{
    $out = [];
    foreach ($classes as $class) {
        if (is_array($class)) {
            foreach ($class as $name => $on) {
                if ($on) {
                    $out[] = $name;
                }
            }
        } elseif ($class) {
            $out[] = $class;
        }
    }
    return implode(' ', $out);
}

/** Content exported from src/data (see scripts/export-php-data.mjs). */
function data(string $file, ?string $key = null)
{
    static $cache = [];
    if (!isset($cache[$file])) {
        $path = APP_DIR . '/data/' . $file . '.json';
        $cache[$file] = json_decode((string) file_get_contents($path), true);
    }
    return $key === null ? $cache[$file] : ($cache[$file][$key] ?? null);
}

/** A Tabler icon as inline SVG (paths from php/app/data/icons.json). */
function icon(string $name, string $class = 'h-4 w-4', float $stroke = 2, bool $hidden = true): string
{
    $paths = data('icons', $name);
    if ($paths === null) {
        return '';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
        . ' stroke-width="' . $stroke . '" stroke-linecap="round" stroke-linejoin="round"'
        . ' class="' . e($class) . '"' . ($hidden ? ' aria-hidden="true"' : '') . '>' . $paths . '</svg>';
}

/** URL of a file in /assets with a cache-busting version. */
function asset(string $path): string
{
    $file = PUBLIC_DIR . '/assets/' . $path;
    $version = is_file($file) ? (string) filemtime($file) : '1';
    return '/assets/' . $path . '?v=' . $version;
}

/** Current request path without query string or trailing slash. */
function current_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = rawurldecode($path);
    return $path === '/' ? '/' : rtrim($path, '/');
}

function is_external(string $href): bool
{
    return (bool) preg_match('#^https?://#', $href);
}

/** target/rel attributes for links that leave the site. */
function ext_attrs(string $href): string
{
    return is_external($href) ? ' target="_blank" rel="noopener noreferrer"' : '';
}

/**
 * Scroll-reveal wrapper attributes: `.reveal` hides until site.js adds
 * `.reveal-in` as the element enters the viewport (see design.css).
 */
function reveal(string $class = '', int $delay = 0, bool $ruleDraw = false): string
{
    $classes = cx('reveal', $ruleDraw ? 'rule-draw' : '', $class);
    $style = $delay > 0 ? ' style="transition-delay: ' . $delay . 'ms"' : '';
    return 'class="' . e($classes) . '" data-reveal' . $style;
}

/** Thin numbered rule that opens a homepage section ("LABEL ─── 01"). */
function section_rule(string $index, string $label, string $tone = 'light'): string
{
    $tones = [
        'light' => ['border-border', 'text-foreground/70', 'text-foreground/70'],
        'dark' => ['border-background/15', 'text-background/65', 'text-background/65'],
        'primary' => ['border-primary-foreground/25', 'text-primary-foreground', 'text-primary-foreground'],
    ];
    [$rule, $labelTone, $indexTone] = $tones[$tone];
    return '<div data-section-index="' . e($index) . '" data-section-label="' . e($label) . '"'
        . ' class="' . e(cx('flex items-center justify-between border-t pt-6', $rule)) . '">'
        . '<span class="' . e(cx('meta-label', $labelTone)) . '">' . e($label) . '</span>'
        . '<span class="' . e(cx('meta-label', $indexTone)) . '">' . e($index) . '</span></div>';
}

/** Date in the site's en-GB style, e.g. "10 October 2026". */
function format_date(string $iso, string $format = 'j F Y'): string
{
    return gmdate($format, strtotime($iso . (strlen($iso) === 10 ? 'T00:00:00Z' : '')));
}

/* Events -------------------------------------------------------------- */

function event_timestamp(string $iso): int
{
    return (int) strtotime($iso . (strlen($iso) === 10 ? 'T00:00:00Z' : ''));
}

/** The event's real status now: "upcoming"/"ongoing" in the data goes stale. */
function event_status(array $event, ?int $now = null): string
{
    $now = $now ?? time();
    $start = event_timestamp($event['isoDate']);
    $end = isset($event['endIsoDate']) ? event_timestamp($event['endIsoDate']) : $start;
    if ($end < $now) {
        return 'past';
    }
    if ($start <= $now && $now <= $end) {
        return 'ongoing';
    }
    return $event['status'] === 'ongoing' ? 'upcoming' : $event['status'];
}

/** Ongoing first, then upcoming, then past; soonest first within each. */
function sorted_events(): array
{
    $rank = ['ongoing' => 0, 'upcoming' => 1, 'past' => 2];
    $events = data('site', 'events');
    usort($events, function ($a, $b) use ($rank) {
        return [$rank[event_status($a)], event_timestamp($a['isoDate'])]
            <=> [$rank[event_status($b)], event_timestamp($b['isoDate'])];
    });
    return $events;
}

/** schema.org Event node for listings (homepage, events index). */
function event_ld(array $event): array
{
    return array_filter([
        '@type' => 'Event',
        'name' => $event['title'],
        'startDate' => $event['isoDate'],
        'endDate' => $event['endIsoDate'] ?? null,
        'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
        'eventStatus' => 'https://schema.org/EventScheduled',
        'location' => ['@type' => 'Place', 'name' => $event['location']],
        'url' => SITE_URL . '/events/' . $event['slug'],
        'organizer' => ['@id' => SITE_URL . '/#organization'],
    ]);
}

function find_by_slug(array $items, string $slug): ?array
{
    foreach ($items as $item) {
        if (($item['slug'] ?? null) === $slug) {
            return $item;
        }
    }
    return null;
}

/**
 * Live countdown badge; site.js fills it in ("Starts in 11d 4h" or
 * "Happening now") and removes it once the event has ended.
 */
function countdown(array $event, string $class): string
{
    $end = $event['endIsoDate'] ?? $event['isoDate'];
    return '<span class="' . e($class) . '" data-countdown="' . e($event['isoDate']) . '"'
        . ' data-countdown-end="' . e($end) . '" hidden></span>';
}

/* Initiatives --------------------------------------------------------- */

/** Href for an initiative: its own site when it has one, else its page here. */
function initiative_href(array $initiative): string
{
    return $initiative['externalUrl'] ?? '/initiatives/' . $initiative['slug'];
}

/** Opening <a> for an initiative, with new-tab attributes when external. */
function initiative_link_open(array $initiative, string $class = ''): string
{
    $href = initiative_href($initiative);
    return '<a href="' . e($href) . '"' . ext_attrs($href) . ($class !== '' ? ' class="' . e($class) . '"' : '') . '>';
}

/* Shared page pieces ---------------------------------------------------- */

/**
 * Breadcrumb trail after Home (src/components/site/PageBreadcrumb.tsx).
 * $trail: [[label, href|null], ...]; the last crumb is the current page.
 */
function breadcrumb(array $trail): string
{
    $items = array_merge([['Home', '/']], $trail);
    $out = '<nav aria-label="breadcrumb"><ol class="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">';
    foreach ($items as $i => $crumb) {
        [$label, $href] = [$crumb[0], $crumb[1] ?? null];
        $out .= '<li class="inline-flex items-center gap-1.5">'
            . ($href
                ? '<a class="transition-colors hover:text-foreground" href="' . e($href) . '">' . e($label) . '</a>'
                : '<span role="link" aria-disabled="true" aria-current="page" class="font-normal text-foreground">' . e($label) . '</span>')
            . '</li>';
        if ($i < count($items) - 1) {
            $out .= '<li role="presentation" aria-hidden="true" class="[&>svg]:h-3.5 [&>svg]:w-3.5">' . icon('ChevronRight', '') . '</li>';
        }
    }
    return $out . '</ol></nav>';
}

/** BreadcrumbList JSON-LD node for $trail (same shape as breadcrumb()). */
function breadcrumb_ld(array $trail): array
{
    $items = array_merge([['Home', '/']], $trail);
    $list = [];
    foreach ($items as $i => $crumb) {
        $list[] = [
            '@type' => 'ListItem',
            'position' => $i + 1,
            'name' => $crumb[0],
            'item' => SITE_URL . ($crumb[1] ?? current_path()),
        ];
    }
    return ['@type' => 'BreadcrumbList', 'itemListElement' => $list];
}

/**
 * Section heading with the thin rule (src/components/site/SectionHeading.tsx).
 * $title is trusted HTML (callers escape their own text). Options:
 * description, index, action (HTML), bold, class, id (for the <h2>).
 */
function section_heading(string $eyebrow, string $title, array $o = []): string
{
    $bold = !empty($o['bold']);
    $out = '<div ' . reveal(cx('flex flex-col gap-7 md:flex-row md:items-end md:justify-between', $o['class'] ?? '')) . '>'
        . '<div class="max-w-2xl flex-1">'
        . '<div class="flex items-center justify-between border-t border-border pt-5">'
        . '<span class="' . e(cx('meta-label text-muted-foreground', $bold ? 'font-extrabold text-foreground' : '')) . '">' . e($eyebrow) . '</span>'
        . (!empty($o['index']) ? '<span aria-hidden="true" class="meta-label text-muted-foreground">' . e($o['index']) . '</span>' : '')
        . '</div>'
        . '<h2' . (!empty($o['id']) ? ' id="' . e($o['id']) . '"' : '') . ' class="' . e(cx('type-section mt-7 text-foreground', $bold ? 'font-bold' : '')) . '">' . $title . '</h2>'
        . (!empty($o['description']) ? '<p class="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">' . e($o['description']) . '</p>' : '')
        . '</div>'
        . (!empty($o['action']) ? '<div class="shrink-0">' . $o['action'] . '</div>' : '')
        . '</div>';
    return $out;
}

/** Standard inner-page intro band: breadcrumb, eyebrow rule, h1, lead copy. */
function page_intro(array $trail, string $eyebrow, string $title, string $leadHtml = '', string $eyebrowIcon = '', string $width = 'max-w-3xl'): string
{
    return '<section class="border-b border-border bg-secondary/40 py-14 lg:py-20">'
        . '<div class="mx-auto max-w-[1400px] px-6 lg:px-12">' . breadcrumb($trail)
        . '<div ' . reveal('mt-8 ' . $width) . '>'
        . '<div class="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">'
        . ($eyebrowIcon !== '' ? icon($eyebrowIcon, 'h-4 w-4 text-primary') : '') . '<span>' . e($eyebrow) . '</span></div>'
        . '<h1 class="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">' . e($title) . '</h1>'
        . $leadHtml
        . '</div></div></section>';
}

/** Grid of initiative cards (CSR and Programmes pages). */
function initiative_cards(array $initiatives): string
{
    $out = '<ul class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">';
    foreach (array_values($initiatives) as $i => $initiative) {
        $out .= '<li><div ' . reveal('h-full', $i * 80) . '>'
            . initiative_link_open($initiative, 'group flex h-full flex-col rounded-2xl border border-border bg-card p-7')
            . '<span class="meta-label text-muted-foreground">' . e($initiative['eyebrow']) . '</span>'
            . '<h3 class="mt-4 font-display text-lg font-semibold leading-snug text-foreground">' . e($initiative['title']) . '</h3>'
            . '<span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">' . e($initiative['cta']) . icon('ArrowUpRight', 'h-4 w-4 text-primary') . '</span>'
            . '</a></div></li>';
    }
    return $out . '</ul>';
}

/** Rounded card grid of [title, body] pairs (About objectives, Programmes). */
function info_cards(array $items): string
{
    $out = '<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">';
    foreach ($items as $i => [$title, $body]) {
        $out .= '<li><div ' . reveal('h-full rounded-2xl bg-card p-7', $i * 60) . '>'
            . '<h3 class="font-display text-lg font-semibold text-foreground">' . e($title) . '</h3>'
            . '<p class="mt-3 text-sm leading-relaxed text-muted-foreground">' . e($body) . '</p></div></li>';
    }
    return $out . '</ul>';
}

/** Shown on legal notices until LEGAL_PAGES_APPROVED is set (InfoPage.tsx). */
function draft_notice(string $class = ''): string
{
    return '<div role="note" class="' . e(cx('flex gap-3 rounded-xl border border-foreground/20 bg-paper-earth p-5 text-sm leading-relaxed text-foreground', $class)) . '">'
        . icon('AlertTriangle', 'mt-0.5 h-5 w-5 shrink-0')
        . '<p><strong>Draft pending AAK approval.</strong> This notice describes how the website works today. Its wording has not yet been approved by the Association and may change.</p></div>';
}

/* Page head ----------------------------------------------------------- */

/** JSON-LD script tag. */
function json_ld(array $data): string
{
    return '<script type="application/ld+json">'
        . json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG)
        . '</script>';
}
