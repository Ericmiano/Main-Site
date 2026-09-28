<?php
/**
 * Front controller: maps the request path to a page template and renders it
 * inside the shared layout. Static files (images, PDFs, CSS/JS) are served
 * by Apache directly; .htaccess sends everything else here.
 */

declare(strict_types=1);

define('APP_DIR', __DIR__);

require APP_DIR . '/lib/helpers.php';

/**
 * Exact paths => page template (php/app/pages/<name>.php). Dynamic routes
 * are matched below.
 */
function route_table(): array
{
    return [
        '/' => 'home',
    ];
}

/** Resolve a path to [template, params] or null for a 404. */
function resolve_route(string $path): ?array
{
    $table = route_table();
    if (isset($table[$path])) {
        return [$table[$path], []];
    }
    // /about -> pages/about.php, for every single-segment page. Templates
    // that back dynamic routes or special cases aren't reachable directly.
    $reserved = ['home', '404', 'event', 'chapter', 'initiative'];
    if (preg_match('#^/([a-z0-9-]+)$#', $path, $m) && !in_array($m[1], $reserved, true)
        && is_file(APP_DIR . '/pages/' . $m[1] . '.php')) {
        return [$m[1], []];
    }
    $patterns = [
        '#^/events/([a-z0-9-]+)$#' => 'event',
        '#^/chapters/([a-z0-9-]+)$#' => 'chapter',
        '#^/initiatives/([a-z0-9-]+)$#' => 'initiative',
    ];
    foreach ($patterns as $pattern => $template) {
        if (preg_match($pattern, $path, $m) && is_file(APP_DIR . '/pages/' . $template . '.php')) {
            return [$template, ['slug' => $m[1]]];
        }
    }
    return null;
}

/**
 * Render a page template into the layout. Templates set $page (title,
 * description, canonical path, extra head tags) and echo their body.
 * A template can call not_found() when a slug doesn't exist.
 */
function render_page(string $template, array $params = []): void
{
    $page = [
        'title' => SITE_NAME,
        'description' => "The professional body for Kenya's built and natural environment practitioners since 1967.",
        'path' => current_path(),
        'noindex' => false,
        'head' => '',
        'bare' => false, // true: no header/footer (404 page)
    ];
    ob_start();
    try {
        (function () use (&$page, $params, $template) {
            extract($params, EXTR_SKIP);
            require APP_DIR . '/pages/' . $template . '.php';
        })();
    } catch (NotFound $e) {
        ob_end_clean();
        render_not_found();
        return;
    }
    $content = (string) ob_get_clean();
    require APP_DIR . '/views/layout.php';
}

final class NotFound extends Exception
{
}

function not_found(): void
{
    throw new NotFound();
}

function render_not_found(): void
{
    http_response_code(404);
    render_page('404');
}

/** Calendar file for an event (the "Add to calendar" link). All-day, so
 * DTEND is the day after the last day. */
function send_event_ics(array $event): void
{
    $text = function (string $s): string {
        return str_replace(['\\', "\n", ',', ';'], ['\\\\', '\\n', '\\,', '\\;'], $s);
    };
    $day = function (string $iso, int $offsetDays = 0): string {
        return gmdate('Ymd', event_timestamp($iso) + $offsetDays * 86400);
    };
    $url = SITE_URL . '/events/' . $event['slug'];
    $lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Architectural Association of Kenya//Events//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:' . $event['slug'] . '@aak.or.ke',
        'DTSTAMP:' . gmdate('Ymd\THis\Z'),
        'DTSTART;VALUE=DATE:' . $day($event['isoDate']),
        'DTEND;VALUE=DATE:' . $day($event['endIsoDate'] ?? $event['isoDate'], 1),
        'SUMMARY:' . $text($event['title']),
        'LOCATION:' . $text($event['venue']),
        'DESCRIPTION:' . $text($event['summary'] . "\n\n" . $url),
        'URL:' . $url,
        'END:VEVENT',
        'END:VCALENDAR',
    ];
    header('Content-Type: text/calendar; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $event['slug'] . '.ics"');
    echo implode("\r\n", $lines);
}

function dispatch(): void
{
    $path = current_path();
    if (preg_match('#^/events/([a-z0-9-]+)\.ics$#', $path, $m)) {
        $event = find_by_slug(data('site', 'events'), $m[1]);
        if ($event) {
            send_event_ics($event);
            return;
        }
        render_not_found();
        return;
    }
    $route = resolve_route($path);
    if ($route === null) {
        render_not_found();
        return;
    }
    render_page($route[0], $route[1]);
}
