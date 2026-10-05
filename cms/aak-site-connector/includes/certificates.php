<?php
/**
 * Certificates: upload an event's certificate list (Excel or CSV), check it,
 * and publish it to the register aak.or.ke/certificate-verification reads.
 *
 * Registers are CSV files in a folder OUTSIDE public_html on the same hosting
 * account (by default /home/<account>/aak-certificates), one per event:
 *   code,serial,name,certificate,event,dates,venue,cpd_points,issued,status
 * The verification endpoint (aak.or.ke/api/certificate.php) reads them
 * directly, so a published list can be verified straight away.
 */

if (!defined('ABSPATH')) {
    exit;
}

const AAK_CERT_FIELDS = ['code', 'serial', 'name', 'certificate', 'event', 'dates', 'venue', 'cpd_points', 'issued', 'status'];
const AAK_CERT_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ'; // no 0/O, 1/I/L or U
const AAK_CERT_MAX_UPLOAD = 5 * 1024 * 1024;

/** Column headings people actually use, mapped to register fields. */
function aak_cert_header_map(): array
{
    return [
        'serial' => ['serial', 'serial number', 'serial no', 'serial no.', 'serial_no', 'verification code', 'certificate number', 'certificate no', 'cert no', 'cert number'],
        'name' => ['name', 'full name', 'full_name', 'names', 'payment confirmed names', 'delegate', 'delegate name', 'attendee', 'attendee name', 'participant', 'participant name'],
        'certificate' => ['certificate', 'certificate type', 'type'],
        'event' => ['event', 'event name'],
        'dates' => ['dates', 'date', 'event dates', 'event date'],
        'venue' => ['venue', 'location'],
        'cpd_points' => ['cpd', 'cpd points', 'cpd_points', 'cpd pts'],
        'issued' => ['issued', 'issue date', 'date issued', 'issued on'],
        'status' => ['status'],
        'code' => ['code', 'private code'],
    ];
}

/* ---------------------------------------------------------------------------
 * Where the registers live.
 */
function aak_cert_dir(): string
{
    $saved = (string) get_option('aak_cert_dir', '');
    if ($saved !== '') {
        return untrailingslashit($saved);
    }
    // The cPanel home folder: the one that contains public_html.
    $dir = untrailingslashit(ABSPATH);
    for ($i = 0; $i < 6; $i++) {
        if (is_dir($dir . '/public_html')) {
            return $dir . '/aak-certificates';
        }
        $parent = dirname($dir);
        if ($parent === $dir) {
            break;
        }
        $dir = $parent;
    }
    return dirname(untrailingslashit(ABSPATH)) . '/aak-certificates';
}

function aak_cert_ensure_dir(): ?string
{
    $dir = aak_cert_dir();
    if (!is_dir($dir) && !wp_mkdir_p($dir)) {
        return null;
    }
    // Refuse web access even if the folder is ever placed inside public_html.
    if (!file_exists($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', "Require all denied\n");
    }
    return is_writable($dir) ? $dir : null;
}

function aak_cert_slug(string $value): string
{
    return trim(preg_replace('/[^a-z0-9-]+/', '-', strtolower($value)), '-');
}

/* ---------------------------------------------------------------------------
 * Reading spreadsheets.
 */

/** Rows (arrays of strings) from a CSV, whatever Excel saved it as. */
function aak_cert_read_csv(string $path): array
{
    $raw = (string) file_get_contents($path);
    $raw = preg_replace('/^\xEF\xBB\xBF/', '', $raw);
    if (!mb_check_encoding($raw, 'UTF-8')) {
        $raw = mb_convert_encoding($raw, 'UTF-8', 'Windows-1252');
    }
    $firstLine = strtok($raw, "\n");
    $delimiter = substr_count((string) $firstLine, ';') > substr_count((string) $firstLine, ',') ? ';' : ',';
    $handle = fopen('php://temp', 'r+');
    fwrite($handle, $raw);
    rewind($handle);
    $rows = [];
    while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
        $rows[] = array_map(fn ($v) => trim((string) $v), $row);
    }
    fclose($handle);
    return $rows;
}

function aak_cert_col_index(string $ref): int
{
    $letters = preg_replace('/[^A-Z]/', '', strtoupper($ref));
    $n = 0;
    for ($i = 0; $i < strlen($letters); $i++) {
        $n = $n * 26 + (ord($letters[$i]) - 64);
    }
    return $n - 1;
}

/** Rows from the first sheet of an .xlsx workbook (values, not formulas). */
function aak_cert_read_xlsx(string $path): array
{
    if (!class_exists('ZipArchive')) {
        throw new RuntimeException('This server can’t read Excel files. Save the sheet as CSV and upload that instead.');
    }
    $zip = new ZipArchive();
    if ($zip->open($path) !== true) {
        throw new RuntimeException('The Excel file could not be opened.');
    }
    $read = function (string $name) use ($zip) {
        $xml = $zip->getFromName($name);
        return $xml === false ? null : simplexml_load_string($xml);
    };

    // The first sheet, as the workbook lists it.
    $sheetPath = 'xl/worksheets/sheet1.xml';
    $workbook = $read('xl/workbook.xml');
    $rels = $read('xl/_rels/workbook.xml.rels');
    if ($workbook && $rels && isset($workbook->sheets->sheet[0])) {
        $rid = (string) $workbook->sheets->sheet[0]->attributes('http://schemas.openxmlformats.org/officeDocument/2006/relationships')['id'];
        foreach ($rels->Relationship as $rel) {
            if ((string) $rel['Id'] === $rid) {
                $target = ltrim((string) $rel['Target'], '/');
                $sheetPath = strpos($target, 'xl/') === 0 ? $target : 'xl/' . $target;
            }
        }
    }

    $shared = [];
    $ss = $read('xl/sharedStrings.xml');
    if ($ss) {
        foreach ($ss->si as $si) {
            $text = '';
            if (isset($si->t)) {
                $text = (string) $si->t;
            }
            foreach ($si->r as $run) {
                $text .= (string) $run->t;
            }
            $shared[] = $text;
        }
    }

    $sheet = $read($sheetPath);
    $zip->close();
    if (!$sheet) {
        throw new RuntimeException('The first sheet of the Excel file could not be read.');
    }
    $rows = [];
    foreach ($sheet->sheetData->row as $row) {
        $cells = [];
        foreach ($row->c as $c) {
            $type = (string) $c['t'];
            if ($type === 's') {
                $value = $shared[(int) $c->v] ?? '';
            } elseif ($type === 'inlineStr') {
                $value = (string) $c->is->t;
            } else {
                $value = (string) $c->v;
            }
            $cells[aak_cert_col_index((string) $c['r'])] = trim($value);
        }
        if ($cells) {
            $max = max(array_keys($cells));
            $line = [];
            for ($i = 0; $i <= $max; $i++) {
                $line[] = $cells[$i] ?? '';
            }
            $rows[] = $line;
        }
    }
    return $rows;
}

/** Excel stores dates as day numbers; show them as "2 October 2026". */
function aak_cert_excel_date(string $value): string
{
    if (preg_match('/^\d{5}(\.\d+)?$/', $value) && (float) $value > 30000 && (float) $value < 80000) {
        return gmdate('j F Y', (int) round(((float) $value - 25569) * 86400));
    }
    return $value;
}

/**
 * Turn sheet rows into certificate records, filling missing columns from the
 * form's defaults. Returns [records, problems, warnings, skipped].
 */
function aak_cert_parse(array $rows, array $defaults): array
{
    $problems = [];
    $warnings = [];
    // Find the heading row: the first with a serial and a name column.
    $map = null;
    $start = 0;
    foreach (array_slice($rows, 0, 10, true) as $i => $row) {
        $found = [];
        $headings = [];
        foreach ($row as $col => $heading) {
            $h = strtolower(trim(preg_replace('/\s+/', ' ', (string) $heading)));
            foreach (aak_cert_header_map() as $field => $names) {
                if (in_array($h, $names, true)) {
                    $found[$field] = $found[$field] ?? $col;
                    $headings[$field][] = trim((string) $heading);
                }
            }
        }
        if (isset($found['serial'], $found['name'])) {
            // Two name (or serial) columns can't be told apart safely: a sheet
            // with a full delegate list beside the certificate list would pair
            // serials with the wrong people.
            foreach (['serial' => 'serial number', 'name' => 'name'] as $field => $label) {
                if (count($headings[$field]) > 1) {
                    return [[], [sprintf(
                        'The sheet has more than one %s column (%s). Keep only the one for the certificates and upload it again.',
                        $label,
                        implode(', ', array_map(fn ($h) => '“' . $h . '”', $headings[$field]))
                    )], [], 0];
                }
            }
            $map = $found;
            $start = $i + 1;
            break;
        }
    }
    if ($map === null) {
        return [[], ['No “Serial number” and “Name” columns were found. The first row of the sheet should have headings such as “Serial number” and “Full name”.'], [], 0];
    }

    $records = [];
    $seen = [];
    $skipped = 0;
    foreach (array_slice($rows, $start) as $offset => $row) {
        $line = $start + $offset + 1;
        $get = fn ($field) => isset($map[$field]) ? trim((string) ($row[$map[$field]] ?? '')) : '';
        $serial = strtoupper(preg_replace('/\s+/', '', $get('serial')));
        $name = trim(preg_replace('/\s+/u', ' ', $get('name')));
        if ($serial === '' && $name === '') {
            continue;
        }
        if ($serial === '') {
            $skipped++;
            continue;
        }
        if ($name === '') {
            $problems[] = "Row $line: serial $serial has no name.";
            continue;
        }
        $key = preg_replace('/[^A-Z0-9]/', '', $serial);
        if (isset($seen[$key])) {
            $problems[] = "Row $line: serial $serial is used twice (also row {$seen[$key]}).";
            continue;
        }
        $seen[$key] = $line;
        // No status column: '' means "keep whatever it is now" (new people are valid).
        $status = isset($map['status']) ? (strtolower($get('status')) === 'revoked' ? 'revoked' : 'valid') : '';
        $records[] = [
            'code' => strtoupper($get('code')),
            'serial' => $serial,
            'name' => $name,
            'certificate' => $get('certificate') ?: $defaults['certificate'],
            'event' => $get('event') ?: $defaults['event'],
            'dates' => aak_cert_excel_date($get('dates')) ?: $defaults['dates'],
            'venue' => $get('venue') ?: $defaults['venue'],
            'cpd_points' => $get('cpd_points') ?: $defaults['cpd_points'],
            'issued' => aak_cert_excel_date($get('issued')) ?: $defaults['issued'],
            'status' => $status,
        ];
    }

    if (!$records && !$problems) {
        $problems[] = 'The sheet has headings but no certificates under them.';
    }
    // Serials normally share one pattern (AAK/CONV26/DL/0001); point out odd ones.
    $patterns = [];
    foreach ($records as $r) {
        $patterns[preg_replace(['/[A-Z]/', '/[0-9]/'], ['A', '9'], $r['serial'])][] = $r['serial'];
    }
    if (count($patterns) > 1) {
        arsort($patterns);
        $main = array_key_first($patterns);
        foreach ($patterns as $pattern => $serials) {
            if ($pattern !== $main) {
                $warnings[] = 'Serial ' . implode(', ', array_slice($serials, 0, 5)) . ' looks different from the others. Check it’s typed correctly.';
            }
        }
    }
    foreach ($records as $r) {
        if ($r['event'] === '') {
            $problems[] = 'The event name is missing: add an Event column or fill in the Event box.';
            break;
        }
    }
    return [$records, $problems, $warnings, $skipped];
}

/* ---------------------------------------------------------------------------
 * Registers on disk.
 */
function aak_cert_register_path(string $slug): string
{
    return aak_cert_dir() . '/' . $slug . '.csv';
}

function aak_cert_read_register(string $slug): array
{
    $path = aak_cert_register_path($slug);
    if (!is_file($path)) {
        return [];
    }
    $rows = aak_cert_read_csv($path);
    $header = array_map('strtolower', array_shift($rows) ?: []);
    $out = [];
    foreach ($rows as $row) {
        if (count($row) === count($header)) {
            $out[] = array_combine($header, $row) + array_fill_keys(AAK_CERT_FIELDS, '');
        }
    }
    return $out;
}

function aak_cert_registers(): array
{
    $list = [];
    foreach (glob(aak_cert_dir() . '/*.csv') ?: [] as $file) {
        $slug = basename($file, '.csv');
        $rows = aak_cert_read_register($slug);
        $revoked = count(array_filter($rows, fn ($r) => strtolower($r['status']) === 'revoked'));
        $list[] = [
            'slug' => $slug,
            'count' => count($rows),
            'revoked' => $revoked,
            'event' => $rows[0]['event'] ?? '',
            'modified' => filemtime($file),
        ];
    }
    usort($list, fn ($a, $b) => $b['modified'] <=> $a['modified']);
    return $list;
}

function aak_cert_new_code(string $prefix, array $taken): string
{
    do {
        $body = '';
        for ($i = 0; $i < 8; $i++) {
            $body .= AAK_CERT_ALPHABET[random_int(0, strlen(AAK_CERT_ALPHABET) - 1)];
        }
        $code = 'AAK-' . $prefix . '-' . substr($body, 0, 4) . '-' . substr($body, 4);
    } while (isset($taken[$code]));
    return $code;
}

/** Write a register safely: previous version kept in .history, new file swapped in whole. */
function aak_cert_write_register(string $slug, array $records): void
{
    $dir = aak_cert_ensure_dir();
    if ($dir === null) {
        throw new RuntimeException('The certificates folder (' . aak_cert_dir() . ') can’t be written to.');
    }
    $path = aak_cert_register_path($slug);
    if (is_file($path)) {
        $history = $dir . '/.history';
        wp_mkdir_p($history);
        copy($path, $history . '/' . $slug . '-' . gmdate('Ymd-His') . '.csv');
        $old = glob($history . '/' . $slug . '-*.csv') ?: [];
        sort($old);
        foreach (array_slice($old, 0, max(0, count($old) - 20)) as $stale) {
            @unlink($stale);
        }
    }
    $tmp = $path . '.tmp-' . wp_generate_password(6, false);
    $handle = fopen($tmp, 'w');
    fputcsv($handle, AAK_CERT_FIELDS);
    foreach ($records as $r) {
        fputcsv($handle, array_map(fn ($f) => (string) ($r[$f] ?? ''), AAK_CERT_FIELDS));
    }
    fclose($handle);
    if (!rename($tmp, $path)) {
        @unlink($tmp);
        throw new RuntimeException('The register could not be saved.');
    }
}

function aak_cert_log(string $action): void
{
    $log = get_option('aak_cert_log', []);
    array_unshift($log, ['time' => time(), 'user' => wp_get_current_user()->display_name, 'action' => $action]);
    update_option('aak_cert_log', array_slice($log, 0, 100), false);
}

/* ---------------------------------------------------------------------------
 * Admin screens.
 */
add_action('admin_menu', function () {
    add_menu_page('Certificates', 'Certificates', 'manage_aak_certificates', 'aak-certificates', 'aak_cert_screen', 'dashicons-awards', 26);
});

function aak_cert_url(array $args = []): string
{
    return add_query_arg($args, admin_url('admin.php?page=aak-certificates'));
}

function aak_cert_notice(string $message, string $type = 'success'): void
{
    printf('<div class="notice notice-%s"><p>%s</p></div>', esc_attr($type), wp_kses_post($message));
}

/** Handle form posts before any output, then redirect (no resubmits on refresh). */
add_action('admin_init', function () {
    if (!isset($_POST['aak_cert_action']) || !current_user_can('manage_aak_certificates')) {
        return;
    }
    $action = sanitize_key($_POST['aak_cert_action']);
    check_admin_referer('aak_cert_' . $action);
    $previewKey = 'aak_cert_preview_' . get_current_user_id();

    try {
        if ($action === 'upload') {
            $slug = aak_cert_slug((string) wp_unslash($_POST['slug'] ?? ''));
            if ($slug === '') {
                $slug = aak_cert_slug((string) wp_unslash($_POST['event'] ?? ''));
            }
            if ($slug === '') {
                throw new RuntimeException('Give the list a name, e.g. convention-2026.');
            }
            $file = $_FILES['sheet'] ?? null;
            if (!$file || (int) $file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
                throw new RuntimeException('Choose the spreadsheet to upload.');
            }
            if ((int) $file['size'] > AAK_CERT_MAX_UPLOAD) {
                throw new RuntimeException('That file is larger than 5 MB.');
            }
            $ext = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
            if ($ext === 'xlsx') {
                $rows = aak_cert_read_xlsx($file['tmp_name']);
            } elseif ($ext === 'csv') {
                $rows = aak_cert_read_csv($file['tmp_name']);
            } else {
                throw new RuntimeException('Upload an Excel (.xlsx) or CSV file.');
            }
            $defaults = [];
            foreach (['certificate', 'event', 'dates', 'venue', 'cpd_points', 'issued'] as $f) {
                $defaults[$f] = sanitize_text_field(wp_unslash($_POST[$f] ?? ''));
            }
            [$records, $problems, $warnings, $skipped] = aak_cert_parse($rows, $defaults);
            // Never kept in the uploads folder: the parsed list waits here for an hour at most.
            set_transient($previewKey, compact('slug', 'records', 'problems', 'warnings', 'skipped') + ['file' => sanitize_file_name($file['name'])], HOUR_IN_SECONDS);
            wp_safe_redirect(aak_cert_url(['view' => 'preview']));
            exit;
        }

        if ($action === 'publish') {
            $preview = get_transient($previewKey);
            if (!$preview || $preview['problems']) {
                throw new RuntimeException('Nothing to publish. Upload the spreadsheet again.');
            }
            $slug = $preview['slug'];
            // Keep each person's private code when a list is uploaded again.
            $existing = [];
            $existingStatus = [];
            $taken = [];
            foreach (aak_cert_read_register($slug) as $old) {
                $oldKey = preg_replace('/[^A-Z0-9]/', '', strtoupper($old['serial']));
                $existing[$oldKey] = $old['code'];
                $existingStatus[$oldKey] = strtolower($old['status']) === 'revoked' ? 'revoked' : 'valid';
                $taken[$old['code']] = true;
            }
            $prefix = strtoupper(substr(preg_replace('/[^a-z0-9]/', '', $slug), 0, 4)) ?: 'CERT';
            $records = [];
            foreach ($preview['records'] as $r) {
                $key = preg_replace('/[^A-Z0-9]/', '', $r['serial']);
                $code = $r['code'] ?: ($existing[$key] ?? '');
                if ($code === '' || isset($taken[$code]) && ($existing[$key] ?? '') !== $code) {
                    $code = aak_cert_new_code($prefix, $taken);
                }
                $taken[$code] = true;
                $r['code'] = $code;
                // A re-upload without a status column doesn't undo revocations.
                $r['status'] = $r['status'] ?: ($existingStatus[$key] ?? 'valid');
                $records[] = $r;
            }
            aak_cert_write_register($slug, $records);
            delete_transient($previewKey);
            aak_cert_log(sprintf('Published %s (%d certificates) from %s', $slug, count($records), $preview['file']));
            wp_safe_redirect(aak_cert_url(['view' => 'register', 'list' => $slug, 'done' => 'published']));
            exit;
        }

        if ($action === 'cancel') {
            delete_transient($previewKey);
            wp_safe_redirect(aak_cert_url());
            exit;
        }

        if ($action === 'status') {
            $slug = aak_cert_slug((string) wp_unslash($_POST['list'] ?? ''));
            $serial = (string) wp_unslash($_POST['serial'] ?? '');
            $to = ($_POST['to'] ?? '') === 'revoked' ? 'revoked' : 'valid';
            $rows = aak_cert_read_register($slug);
            $found = false;
            foreach ($rows as &$row) {
                if ($row['serial'] === $serial) {
                    $row['status'] = $to;
                    $found = true;
                }
            }
            unset($row);
            if (!$found) {
                throw new RuntimeException('That certificate wasn’t found.');
            }
            aak_cert_write_register($slug, $rows);
            aak_cert_log(sprintf('%s %s in %s', $to === 'revoked' ? 'Revoked' : 'Restored', $serial, $slug));
            wp_safe_redirect(aak_cert_url(['view' => 'register', 'list' => $slug, 's' => $serial, 'done' => $to]));
            exit;
        }

        if ($action === 'delete') {
            $slug = aak_cert_slug((string) wp_unslash($_POST['list'] ?? ''));
            $path = aak_cert_register_path($slug);
            if (is_file($path)) {
                $history = aak_cert_dir() . '/.history';
                wp_mkdir_p($history);
                rename($path, $history . '/' . $slug . '-deleted-' . gmdate('Ymd-His') . '.csv');
                aak_cert_log("Removed list $slug (a copy is kept in .history)");
            }
            wp_safe_redirect(aak_cert_url(['done' => 'deleted']));
            exit;
        }

        if ($action === 'settings' && current_user_can('manage_options')) {
            $dir = trim((string) wp_unslash($_POST['cert_dir'] ?? ''));
            update_option('aak_cert_dir', $dir === '' ? '' : untrailingslashit($dir), false);
            wp_safe_redirect(aak_cert_url(['done' => 'settings']));
            exit;
        }
    } catch (Throwable $e) {
        set_transient('aak_cert_error_' . get_current_user_id(), $e->getMessage(), 60);
        wp_safe_redirect(aak_cert_url(isset($_POST['list']) ? ['view' => 'register', 'list' => sanitize_key($_POST['list'])] : []));
        exit;
    }
});

/** Download a register (for the records), admins and editors only. */
add_action('admin_init', function () {
    if (($_GET['page'] ?? '') !== 'aak-certificates' || !isset($_GET['download']) || !current_user_can('manage_aak_certificates')) {
        return;
    }
    check_admin_referer('aak_cert_download');
    $slug = aak_cert_slug((string) $_GET['download']);
    $path = aak_cert_register_path($slug);
    if (!is_file($path)) {
        wp_die('Not found.');
    }
    nocache_headers();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $slug . '.csv"');
    readfile($path);
    exit;
});

function aak_cert_screen(): void
{
    $view = sanitize_key($_GET['view'] ?? '');
    echo '<div class="wrap"><h1>Certificates</h1>';
    echo '<p>Certificates listed here can be verified by anyone at <a href="' . esc_url(aak_site_url() . '/certificate-verification') . '" target="_blank" rel="noopener">' . esc_html(preg_replace('#^https?://#', '', aak_site_url())) . '/certificate-verification</a>, using the serial number and the holder’s surname.</p>';

    $error = get_transient('aak_cert_error_' . get_current_user_id());
    if ($error) {
        delete_transient('aak_cert_error_' . get_current_user_id());
        aak_cert_notice(esc_html($error), 'error');
    }
    $done = sanitize_key($_GET['done'] ?? '');
    $messages = [
        'published' => 'Published. These certificates can be verified now.',
        'revoked' => 'Certificate revoked: it now shows as withdrawn.',
        'valid' => 'Certificate restored: it shows as genuine again.',
        'deleted' => 'List removed. A copy is kept in the history folder.',
        'settings' => 'Settings saved.',
    ];
    if (isset($messages[$done])) {
        aak_cert_notice($messages[$done]);
    }

    if ($view === 'preview') {
        aak_cert_preview_screen();
    } elseif ($view === 'register') {
        aak_cert_register_screen(aak_cert_slug((string) ($_GET['list'] ?? '')));
    } else {
        aak_cert_home_screen();
    }
    echo '</div>';
}

function aak_cert_home_screen(): void
{
    $dir = aak_cert_dir();
    $ready = aak_cert_ensure_dir() !== null;
    if (!$ready) {
        aak_cert_notice('The certificates folder <code>' . esc_html($dir) . '</code> doesn’t exist or can’t be written to. An administrator can set the right folder at the bottom of this page.', 'error');
    }

    echo '<h2>Upload a certificate list</h2>';
    echo '<p>Upload the event’s spreadsheet (Excel .xlsx, or CSV). It needs a <strong>Serial number</strong> column and a <strong>Name</strong> column; any other details can be columns too, or filled in below for the whole list. You’ll see a preview before anything is published.</p>';
    echo '<form method="post" enctype="multipart/form-data">';
    wp_nonce_field('aak_cert_upload');
    echo '<input type="hidden" name="aak_cert_action" value="upload" />';
    echo '<table class="form-table" role="presentation"><tbody>';
    $field = function (string $name, string $label, string $help = '', string $type = 'text', string $value = '') {
        printf(
            '<tr><th scope="row"><label for="aak-%1$s">%2$s</label></th><td><input type="%4$s" id="aak-%1$s" name="%1$s" class="regular-text" value="%5$s" />%3$s</td></tr>',
            esc_attr($name),
            esc_html($label),
            $help ? '<p class="description">' . esc_html($help) . '</p>' : '',
            esc_attr($type),
            esc_attr($value)
        );
    };
    echo '<tr><th scope="row"><label for="aak-sheet">Spreadsheet</label></th><td><input type="file" id="aak-sheet" name="sheet" accept=".xlsx,.csv" required /></td></tr>';
    $field('event', 'Event', 'e.g. AAK Annual Convention 2026');
    $field('slug', 'List name', 'Short name for this list, e.g. convention-2026. Uploading again with the same name replaces that list (everyone keeps their serial).');
    $field('certificate', 'Certificate type', '', 'text', 'Certificate of Attendance');
    $field('dates', 'Event dates', 'e.g. 16–19 September 2026');
    $field('venue', 'Venue');
    $field('cpd_points', 'CPD points', 'Leave blank if none.');
    $field('issued', 'Issue date', 'e.g. 2 October 2026. Leave blank to show no issue date.');
    echo '</tbody></table>';
    submit_button('Upload and preview', 'primary', 'submit', true, $ready ? [] : ['disabled' => 'disabled']);
    echo '</form>';

    echo '<h2>Published lists</h2>';
    $lists = $ready ? aak_cert_registers() : [];
    if (!$lists) {
        echo '<p>None yet.</p>';
    } else {
        echo '<table class="widefat striped"><thead><tr><th>List</th><th>Event</th><th>Certificates</th><th>Revoked</th><th>Last updated</th><th></th></tr></thead><tbody>';
        foreach ($lists as $l) {
            printf(
                '<tr><td><strong><a href="%s">%s</a></strong></td><td>%s</td><td>%d</td><td>%d</td><td>%s</td><td><a href="%s">Open</a> &middot; <a href="%s">Download</a></td></tr>',
                esc_url(aak_cert_url(['view' => 'register', 'list' => $l['slug']])),
                esc_html($l['slug']),
                esc_html($l['event']),
                $l['count'],
                $l['revoked'],
                esc_html(wp_date('j M Y, H:i', $l['modified'])),
                esc_url(aak_cert_url(['view' => 'register', 'list' => $l['slug']])),
                esc_url(wp_nonce_url(aak_cert_url(['download' => $l['slug']]), 'aak_cert_download'))
            );
        }
        echo '</tbody></table>';
    }

    $log = get_option('aak_cert_log', []);
    if ($log) {
        echo '<h2>Recent activity</h2><ul style="list-style:disc;margin-left:1.5em">';
        foreach (array_slice($log, 0, 15) as $entry) {
            printf('<li>%s &mdash; %s (%s)</li>', esc_html(wp_date('j M Y, H:i', $entry['time'])), esc_html($entry['action']), esc_html($entry['user']));
        }
        echo '</ul>';
    }

    if (current_user_can('manage_options')) {
        echo '<h2>Settings</h2><form method="post">';
        wp_nonce_field('aak_cert_settings');
        echo '<input type="hidden" name="aak_cert_action" value="settings" />';
        printf(
            '<p><label for="aak-cert-dir">Certificates folder on the server</label><br /><input type="text" id="aak-cert-dir" name="cert_dir" class="large-text code" value="%s" placeholder="%s" /></p><p class="description">Must be the folder aak.or.ke’s verification reads: <code>aak-certificates</code> in the hosting account’s home folder, beside (not inside) public_html. Leave blank to use the detected folder: <code>%s</code></p>',
            esc_attr((string) get_option('aak_cert_dir', '')),
            esc_attr(aak_cert_dir()),
            esc_html(aak_cert_dir())
        );
        submit_button('Save', 'secondary');
        echo '</form>';
    }
}

function aak_cert_preview_screen(): void
{
    $p = get_transient('aak_cert_preview_' . get_current_user_id());
    if (!$p) {
        aak_cert_notice('The preview has expired. Upload the spreadsheet again.', 'warning');
        aak_cert_home_screen();
        return;
    }
    $existing = aak_cert_read_register($p['slug']);
    printf('<h2>Preview: %s</h2>', esc_html($p['slug']));
    printf('<p>From <strong>%s</strong>: <strong>%d certificates</strong> ready.</p>', esc_html($p['file']), count($p['records']));
    if ($p['skipped']) {
        printf('<p>%d row(s) without a serial number were left out.</p>', (int) $p['skipped']);
    }
    if ($existing) {
        $before = array_map(fn ($r) => preg_replace('/[^A-Z0-9]/', '', strtoupper($r['serial'])), $existing);
        $after = array_map(fn ($r) => preg_replace('/[^A-Z0-9]/', '', $r['serial']), $p['records']);
        $added = count(array_diff($after, $before));
        $removed = count(array_diff($before, $after));
        $revoked = count(array_filter($existing, fn ($r) => strtolower($r['status']) === 'revoked'));
        aak_cert_notice(sprintf(
            'A list called <strong>%s</strong> is already published (%d certificates). Publishing replaces it: %d new, %d no longer listed. Everyone who stays keeps their serial and private code%s.',
            esc_html($p['slug']),
            count($existing),
            $added,
            $removed,
            $revoked ? sprintf(', and the %d revoked certificate(s) stay revoked unless the sheet has a Status column saying otherwise', $revoked) : ''
        ), 'info');
    }
    foreach ($p['problems'] as $problem) {
        aak_cert_notice(esc_html($problem), 'error');
    }
    foreach ($p['warnings'] as $warning) {
        aak_cert_notice(esc_html($warning), 'warning');
    }

    echo '<table class="widefat striped" style="margin-top:1em"><thead><tr><th>Serial number</th><th>Name</th><th>Certificate</th><th>Event</th><th>Dates</th><th>Venue</th><th>CPD</th><th>Issued</th><th>Status</th></tr></thead><tbody>';
    foreach (array_slice($p['records'], 0, 300) as $r) {
        printf(
            '<tr><td><code>%s</code></td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>',
            esc_html($r['serial']),
            esc_html($r['name']),
            esc_html($r['certificate']),
            esc_html($r['event']),
            esc_html($r['dates']),
            esc_html($r['venue']),
            esc_html($r['cpd_points']),
            esc_html($r['issued']),
            esc_html($r['status'] ?: 'unchanged / valid')
        );
    }
    echo '</tbody></table>';
    if (count($p['records']) > 300) {
        printf('<p>…and %d more.</p>', count($p['records']) - 300);
    }

    echo '<form method="post" style="display:inline-block;margin:1.5em 1em 0 0">';
    wp_nonce_field('aak_cert_publish');
    echo '<input type="hidden" name="aak_cert_action" value="publish" />';
    submit_button(sprintf('Publish %d certificates', count($p['records'])), 'primary', 'submit', false, $p['problems'] ? ['disabled' => 'disabled'] : []);
    echo '</form><form method="post" style="display:inline-block">';
    wp_nonce_field('aak_cert_cancel');
    echo '<input type="hidden" name="aak_cert_action" value="cancel" />';
    submit_button('Cancel', 'secondary', 'submit', false);
    echo '</form>';
    if ($p['problems']) {
        echo '<p><strong>Fix the problems above in the spreadsheet, then upload it again.</strong></p>';
    }
}

function aak_cert_register_screen(string $slug): void
{
    $rows = aak_cert_read_register($slug);
    printf('<p><a href="%s">&larr; All lists</a></p><h2>%s</h2>', esc_url(aak_cert_url()), esc_html($slug));
    if (!$rows) {
        echo '<p>This list is empty or doesn’t exist.</p>';
        return;
    }
    $search = sanitize_text_field(wp_unslash($_GET['s'] ?? ''));
    printf(
        '<form method="get"><input type="hidden" name="page" value="aak-certificates" /><input type="hidden" name="view" value="register" /><input type="hidden" name="list" value="%s" /><p class="search-box" style="float:none"><label class="screen-reader-text" for="aak-cert-search">Search</label><input type="search" id="aak-cert-search" name="s" value="%s" placeholder="Serial or name" /> <input type="submit" class="button" value="Search" /></p></form>',
        esc_attr($slug),
        esc_attr($search)
    );
    if ($search !== '') {
        $needle = strtolower($search);
        $rows = array_values(array_filter($rows, fn ($r) => strpos(strtolower($r['serial'] . ' ' . $r['name']), $needle) !== false));
    }
    printf('<p>%d certificate(s) shown.</p>', count($rows));
    echo '<table class="widefat striped"><thead><tr><th>Serial number</th><th>Name</th><th>Event</th><th>Status</th><th></th></tr></thead><tbody>';
    foreach ($rows as $r) {
        $revoked = strtolower($r['status']) === 'revoked';
        echo '<tr>';
        printf('<td><code>%s</code></td><td>%s</td><td>%s</td><td>%s</td>', esc_html($r['serial']), esc_html($r['name']), esc_html($r['event']), $revoked ? '<strong style="color:#b32d2e">Revoked</strong>' : 'Valid');
        echo '<td><form method="post" style="margin:0">';
        wp_nonce_field('aak_cert_status');
        printf(
            '<input type="hidden" name="aak_cert_action" value="status" /><input type="hidden" name="list" value="%s" /><input type="hidden" name="serial" value="%s" /><input type="hidden" name="to" value="%s" />',
            esc_attr($slug),
            esc_attr($r['serial']),
            $revoked ? 'valid' : 'revoked'
        );
        printf(
            '<button type="submit" class="button button-small" onclick="return confirm(%s)">%s</button>',
            esc_attr(wp_json_encode($revoked ? 'Restore this certificate?' : 'Revoke this certificate? It will show as withdrawn.')),
            $revoked ? 'Restore' : 'Revoke'
        );
        echo '</form></td></tr>';
    }
    echo '</tbody></table>';

    echo '<form method="post" style="margin-top:2em">';
    wp_nonce_field('aak_cert_delete');
    printf('<input type="hidden" name="aak_cert_action" value="delete" /><input type="hidden" name="list" value="%s" />', esc_attr($slug));
    printf(
        '<button type="submit" class="button button-link-delete" onclick="return confirm(%s)">Remove this whole list</button>',
        esc_attr(wp_json_encode('Remove the whole list? Its certificates will no longer verify. A copy is kept in the history folder.'))
    );
    echo '</form>';
}
