<?php
/**
 * How many public events the members portal is listing (served at
 * /api/portal-events via .htaccess). The Events page embeds the portal's
 * events widget only when this is above zero, so visitors never see an empty
 * box. Reads the same public page the widget shows; no keys involved.
 */

// Never print PHP warnings into the response: they can reveal server paths.
ini_set('display_errors', '0');

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
    header('Allow: GET, HEAD');
    http_response_code(405);
    echo json_encode(['count' => 0]);
    exit;
}

const WIDGET_URL = 'https://members.aak.or.ke/publicevents/embeddable';
const CACHE_SECONDS = 600;

function respond(int $count, int $maxAge): void
{
    header("Cache-Control: public, max-age=$maxAge");
    echo json_encode(['count' => $count]);
    exit;
}

// Cache outside public_html, beside the member-stats files: the shared temp
// folder on shared hosting can be writable by other accounts.
$cacheFile = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/../..') . '/.aak-portal-events-cache.json';
$cached = is_file($cacheFile) ? json_decode((string) file_get_contents($cacheFile), true) : null;
$cachedCount = is_array($cached) && is_int($cached['count'] ?? null) ? $cached['count'] : null;

if ($cachedCount !== null && time() - filemtime($cacheFile) < CACHE_SECONDS) {
    respond($cachedCount, 300);
}

$html = @file_get_contents(WIDGET_URL, false, stream_context_create([
    'http' => ['method' => 'GET', 'timeout' => 8, 'ignore_errors' => true],
]));
$status = 0;
foreach ($http_response_header ?? [] as $line) {
    if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
        $status = (int) $m[1];
    }
}

if ($status === 200 && is_string($html)) {
    // One "event-card" element per listed event.
    $count = preg_match_all('/class\s*=\s*["\'][^"\']*\bevent-card\b/i', $html);
    @file_put_contents($cacheFile, json_encode(['count' => $count]));
    respond($count, 300);
}

error_log("portal-events: widget responded $status");
respond($cachedCount ?? 0, 60);
