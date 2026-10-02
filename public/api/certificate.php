<?php
/**
 * Certificate verification (served at /api/certificate via .htaccess).
 *
 * Looks up one certificate in the registers kept OUTSIDE public_html, so the
 * list itself can never be downloaded or browsed:
 *   /home/<account>/aak-certificates/*.csv
 * Columns: code,serial,name,certificate,event,dates,venue,cpd_points,issued,status
 * (status "revoked" withdraws a certificate; "code" is AAK's private record
 * identifier and is never sent out). The registers are made by
 * scripts/certificates/make-register.py and hold no contact details.
 *
 * Ask with the printed serial and a name on the certificate (e.g. surname):
 *   ?serial=AAK/CONV26/DL/0000&name=Surname
 * Serials run in sequence, so the name is required: without it anyone could
 * list every holder by counting. A wrong pair reads "not found", never
 * revealing that the serial exists.
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
const WINDOW_SECONDS = 600;  // ... per 10 minutes, against guessing

// Serials are compared without slashes, spaces or case: "aak conv26 dl 0001" = "AAK/CONV26/DL/0001".
function canonical(string $value): string
{
    return preg_replace('/[^A-Z0-9]/', '', strtoupper($value));
}

// Names are compared word by word, ignoring case, accents and punctuation
// (so Mulang'a, Mulang’a and MULANGA all match).
function nameWords(string $name): array
{
    $name = str_replace(["'", "\u{2019}", "\u{2018}"], '', $name);
    $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name);
    $plain = strtolower(preg_replace('/[^A-Za-z]+/', ' ', $ascii !== false ? $ascii : $name));
    return array_values(array_filter(explode(' ', $plain), fn ($w) => strlen($w) >= 2));
}

$serial = canonical((string) ($_GET['serial'] ?? ''));
$givenName = nameWords((string) ($_GET['name'] ?? ''));
// At least one real name (3+ letters), so "a" or "an" can't stand in for one.
if ($serial === '' || strlen($serial) > 40 || !$givenName || count($givenName) > 8
    || !array_filter($givenName, fn ($w) => strlen($w) >= 3)) {
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
        // Every word typed must be one of the holder's names.
        if (canonical($record['serial'] ?? '') !== $serial
            || array_diff($givenName, nameWords($record['name'] ?? ''))) {
            continue;
        }
        fclose($handle);
        $revoked = strtolower($record['status'] ?? '') === 'revoked';
        respond(200, [
            'status' => $revoked ? 'revoked' : 'valid',
            'serial' => $record['serial'] ?? '',
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
