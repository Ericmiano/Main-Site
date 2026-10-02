<?php
/**
 * Certificate verification (served at /api/certificate?code=... via .htaccess).
 *
 * Looks up one certificate code in the registers kept OUTSIDE public_html, so
 * the list itself can never be downloaded or browsed:
 *   /home/<account>/aak-certificates/*.csv
 * Columns: code,name,certificate,event,dates,venue,cpd_points,issued,status
 * (status "revoked" withdraws a certificate). The registers are made by
 * scripts/certificates/make-register.py and hold no contact details.
 */

// Never print PHP warnings into the response: they can reveal server paths.
ini_set('display_errors', '0');

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
    header('Allow: GET, HEAD');
    respond(405, ['status' => 'error']);
}

const MAX_LOOKUPS = 30;      // per visitor ...
const WINDOW_SECONDS = 600;  // ... per 10 minutes, so codes can't be guessed by brute force

// Codes are compared without dashes, spaces or case: "aak-c26 7kq3m9xd" = "AAK-C26-7KQ3-M9XD".
function canonical(string $code): string
{
    return preg_replace('/[^A-Z0-9]/', '', strtoupper($code));
}

$code = canonical((string) ($_GET['code'] ?? ''));
if ($code === '' || strlen($code) > 40) {
    respond(400, ['status' => 'invalid']);
}

$dir = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/../..') . '/aak-certificates';
if (!is_dir($dir)) {
    error_log('certificate: register folder missing');
    respond(503, ['status' => 'unavailable']);
}

// Rate limit by a hash of the visitor's address (the address itself isn't kept).
$limitDir = $dir . '/.ratelimit';
if (!is_dir($limitDir)) {
    @mkdir($limitDir, 0700);
}
$limitFile = $limitDir . '/' . hash('sha256', 'aak-cert|' . ($_SERVER['REMOTE_ADDR'] ?? '')) . '.json';
$now = time();
$hits = is_file($limitFile) ? json_decode((string) file_get_contents($limitFile), true) : [];
$hits = array_values(array_filter(is_array($hits) ? $hits : [], fn ($t) => is_int($t) && $now - $t < WINDOW_SECONDS));
if (count($hits) >= MAX_LOOKUPS) {
    header('Retry-After: ' . WINDOW_SECONDS);
    respond(429, ['status' => 'rate_limited']);
}
$hits[] = $now;
@file_put_contents($limitFile, json_encode($hits), LOCK_EX);

foreach (glob($dir . '/*.csv') ?: [] as $file) {
    $handle = fopen($file, 'r');
    if (!$handle) {
        continue;
    }
    $header = fgetcsv($handle);
    if (!$header) {
        fclose($handle);
        continue;
    }
    $header = array_map(fn ($h) => strtolower(trim(preg_replace('/^\xEF\xBB\xBF/', '', $h))), $header);
    while (($row = fgetcsv($handle)) !== false) {
        if (count($row) !== count($header)) {
            continue;
        }
        $record = array_combine($header, array_map('trim', $row));
        if (canonical($record['code'] ?? '') !== $code) {
            continue;
        }
        fclose($handle);
        $revoked = strtolower($record['status'] ?? '') === 'revoked';
        respond(200, [
            'status' => $revoked ? 'revoked' : 'valid',
            'code' => $record['code'],
            'name' => $record['name'] ?? '',
            'certificate' => $record['certificate'] ?? '',
            'event' => $record['event'] ?? '',
            'dates' => $record['dates'] ?? '',
            'venue' => $record['venue'] ?? '',
            'cpdPoints' => ($record['cpd_points'] ?? '') === '' ? null : $record['cpd_points'],
            'issued' => $record['issued'] ?? '',
        ]);
    }
    fclose($handle);
}

respond(404, ['status' => 'not_found']);
