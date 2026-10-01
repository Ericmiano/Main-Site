<?php
/**
 * Member register endpoint for cPanel hosting (served at /api/member-stats via .htaccess).
 *
 * Source order: the members portal feed (if configured) -> the hand-entered
 * snapshot (member-register-snapshot.json next to this file) -> unavailable,
 * in which case the site hides the register. Never invents numbers.
 *
 * Configure the feed in a file OUTSIDE public_html so the token isn't web-readable:
 *   /home/<account>/aak-member-stats-config.php
 *   <?php return ['url' => 'https://members.aak.or.ke/...', 'token' => '...'];
 */

// Never print PHP warnings into the response: they can reveal server paths.
ini_set('display_errors', '0');

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
    header('Allow: GET, HEAD');
    http_response_code(405);
    echo json_encode(['available' => false]);
    exit;
}

const CACHE_SECONDS = 300;

function respond(int $status, array $body, int $maxAge = 0): void
{
    http_response_code($status);
    header($maxAge > 0 ? "Cache-Control: public, max-age=$maxAge" : 'Cache-Control: no-store');
    echo json_encode($body);
    exit;
}

// Placeholder chapters in the portal's data ("TEST CHAPTER", "TEST EMAIL", "LS").
function clean(array $data): array
{
    $data['byChapter'] = array_values(array_filter(
        $data['byChapter'] ?? [],
        fn ($row) => !preg_match('/test|^ls$/i', trim((string) ($row['chapter'] ?? '')))
    ));
    $data['byCategory'] = $data['byCategory'] ?? [];
    return $data;
}

function valid($data): bool
{
    return is_array($data)
        && isset($data['updatedAt'], $data['totals']['members'], $data['totals']['inGoodStanding'])
        && is_int($data['totals']['members'])
        && is_int($data['totals']['inGoodStanding']);
}

$configFile = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/../..') . '/aak-member-stats-config.php';
$config = is_file($configFile) ? (include $configFile) : [];
$feedUrl = $config['url'] ?? null;
$token = $config['token'] ?? null;

if ($feedUrl) {
    // Cache beside the private config, outside public_html. The shared temp
    // folder on shared hosting can be writable by other accounts, which could
    // plant fake figures; anything read back is re-validated regardless.
    $cacheFile = dirname($configFile) . '/.aak-member-stats-cache.json';
    $cached = is_file($cacheFile) ? json_decode((string) file_get_contents($cacheFile), true) : null;
    if (!valid($cached)) {
        $cached = null;
    }

    if ($cached && time() - filemtime($cacheFile) < CACHE_SECONDS) {
        respond(200, ['available' => true, 'source' => 'live'] + $cached, 60);
    }

    $headers = "Accept: application/json\r\n" . ($token ? "Authorization: Bearer $token\r\n" : '');
    $raw = @file_get_contents($feedUrl, false, stream_context_create([
        'http' => ['method' => 'GET', 'header' => $headers, 'timeout' => 8, 'ignore_errors' => true],
    ]));
    $status = 0;
    foreach ($http_response_header ?? [] as $line) {
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
            $status = (int) $m[1];
        }
    }
    $data = $raw !== false ? json_decode($raw, true) : null;

    if ($status === 200 && valid($data)) {
        $data = clean($data);
        @file_put_contents($cacheFile, json_encode($data));
        respond(200, ['available' => true, 'source' => 'live'] + $data, 60);
    }
    error_log("member-stats: feed responded $status");
    if ($cached) {
        respond(200, ['available' => true, 'source' => 'live'] + $cached, 60);
    }
}

$snapshotFile = __DIR__ . '/member-register-snapshot.json';
$snapshot = is_file($snapshotFile) ? json_decode((string) file_get_contents($snapshotFile), true) : null;
if (valid($snapshot)) {
    respond(200, ['available' => true, 'source' => 'snapshot'] + clean($snapshot), 60);
}

respond(503, ['available' => false]);
