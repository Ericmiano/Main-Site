<?php
/**
 * Applications to the President for appointment of an arbitrator (served
 * at /api/arbitration-request via .htaccess), sent from the form on
 * /arbitration.
 *
 * The questions are AAK's Form SP/1 (Statement of particulars); the fields
 * are named as in the new-case form of AAK's arbitration system (applicant =
 * claimant, other party = respondent, basis, project, contract, dispute
 * value, category, description, documents mapped to the system's document
 * types), so an application can be entered there as it stands, or imported
 * from the JSON copy attached to every email (schema
 * "aak-arbitration-intake/1").
 *
 * Each application is emailed from arbitration@aak.or.ke to the Secretariat
 * (aak@aak.or.ke, copying fiona@aak.or.ke) with the documents attached, and
 * the applicant gets an acknowledgement with the reference. Nothing is kept
 * on the server apart from a hashed rate-limit counter.
 *
 * Settings live OUTSIDE public_html, in
 *   /home/<account>/aak-arbitration/config.php
 * returning an array with any of: to, cc, from, fromName, graph, outbox.
 *   graph   Microsoft 365 sending (aak.or.ke's mail is on Microsoft 365):
 *           ['tenantId' => ..., 'clientId' => ..., 'clientSecret' => ...]
 *           for an app with Mail.Send for the arbitration@ mailbox. Without
 *           it (the setup in use), PHP's mail() sends through this cPanel
 *           server as arbitration@aak.or.ke (a cPanel mailbox), which
 *           needs the server in aak.or.ke's SPF record:
 *           v=spf1 include:spf.protection.outlook.com ip4:192.185.129.133 -all
 *   outbox  a folder: emails are written there as .eml files instead of
 *           being sent (local testing).
 * To test, set 'to' to a mailbox of your own and 'cc' to null, send one
 * application, then remove both lines: the defaults below apply again.
 */

ini_set('display_errors', '0');
date_default_timezone_set('Africa/Nairobi');

// mbstring is usual on cPanel; these stand in if it's switched off.
if (!function_exists('mb_strlen')) {
    function mb_strlen(string $s): int { return preg_match_all('/./us', $s); }
    function mb_substr(string $s, int $start, ?int $length = null): string
    {
        preg_match_all('/./us', $s, $m);
        return implode('', array_slice($m[0], $start, $length));
    }
}

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

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    respond(405, ['status' => 'error']);
}

const MAX_REQUESTS = 5;          // per visitor ...
const WINDOW_SECONDS = 3600;     // ... per hour
const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 15 * 1024 * 1024; // keeps the email under common 25 MB mailbox limits
const MIN_SECONDS_ON_FORM = 5;   // quicker than this is a script, not a person
const MAX_PER_DAY = 30;          // the whole site: caps misuse of the acknowledgement emails

/** Form SP/1's parties in dispute. */
const PARTY_KINDS = [
    'contractor' => 'Contractor',
    'employer' => 'Employer',
    'sub_contractor' => 'Sub-contractor',
    'architect' => 'Architect',
    'other' => 'Other',
];
/** Form SP/1's "Attach documents", each with the arbitration system's document type. */
const DOCUMENT_ITEMS = [
    'arbitration_agreement' => ['Arbitration agreement, or the contract containing it', null],
    'declaration_of_dispute' => ['Letter of declaration of dispute', 'correspondence'],
    'request_for_appointment' => ['Letter requesting appointment of arbitrator by parties', 'correspondence'],
    'applicant_declaration' => ['Declaration by applicant that all matters required to be observed by parties prior to application have been fulfilled', 'other'],
    'supporting' => ['Other supporting documents', 'evidence'],
];
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
const CURRENCIES = ['KES', 'USD', 'EUR', 'GBP'];

$private = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/../..') . '/aak-arbitration';
$config = is_file($private . '/config.php') ? (array) include $private . '/config.php' : [];
$to = $config['to'] ?? 'aak@aak.or.ke';
$cc = array_key_exists('cc', $config) ? $config['cc'] : 'fiona@aak.or.ke';
$from = $config['from'] ?? 'arbitration@aak.or.ke';
$fromName = $config['fromName'] ?? 'AAK Arbitration';

// Posts only from this site's own pages: another website can't submit
// applications in its visitors' names.
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
$originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
$originPort = parse_url($origin, PHP_URL_PORT);
$allowed = preg_match('/^((www|new)\.)?aak\.or\.ke$/', $originHost)
    || (in_array($originHost, ['localhost', '127.0.0.1'], true)
        && strtolower((string) ($_SERVER['HTTP_HOST'] ?? '')) === $originHost . ($originPort ? ":$originPort" : ''));
if (!$allowed) {
    respond(403, ['status' => 'forbidden']);
}

// A body bigger than post_max_size arrives empty: say so rather than "invalid".
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 0 && !$_POST && !$_FILES) {
    respond(413, ['status' => 'too_large']);
}

// Spam traps: a hidden field people never fill, and a minimum time on the form.
if (trim((string) ($_POST['website'] ?? '')) !== ''
    || (int) ($_POST['elapsed'] ?? 0) < MIN_SECONDS_ON_FORM * 1000) {
    respond(400, ['status' => 'invalid', 'error' => 'Please try again.']);
}

// Rate limit by a hash of the visitor's address (the address itself isn't kept).
$limitDir = $private . '/.ratelimit';
if (!is_dir($limitDir)) {
    @mkdir($limitDir, 0700, true);
}
$limitFile = $limitDir . '/' . hash('sha256', 'aak-arb|' . ($_SERVER['REMOTE_ADDR'] ?? '')) . '.json';
$now = time();
$hits = is_file($limitFile) ? json_decode((string) file_get_contents($limitFile), true) : [];
$hits = array_values(array_filter(is_array($hits) ? $hits : [], fn ($t) => is_int($t) && $now - $t < WINDOW_SECONDS));
if (count($hits) >= MAX_REQUESTS) {
    header('Retry-After: ' . WINDOW_SECONDS);
    respond(429, ['status' => 'rate_limited']);
}
$dayFile = $limitDir . '/day-' . date('Ymd') . '.count';
$today = is_file($dayFile) ? (int) file_get_contents($dayFile) : 0;
if ($today >= MAX_PER_DAY) {
    error_log('arbitration-request: the daily limit of ' . MAX_PER_DAY . ' applications was reached');
    header('Retry-After: 3600');
    respond(429, ['status' => 'rate_limited']);
}
foreach (glob($limitDir . '/day-*.count') ?: [] as $old) {
    if ($old !== $dayFile) {
        @unlink($old);
    }
}

/** One line of text: no control characters (so nothing can be smuggled into email headers). */
function line(string $key, int $max, bool $required = false): ?string
{
    $value = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string) ($_POST[$key] ?? '')) ?? '');
    if ($value === '') {
        if ($required) {
            fail("$key is required");
        }
        return null;
    }
    if (mb_strlen($value) > $max) {
        fail("$key is too long");
    }
    return $value;
}

function text(string $key, int $max, bool $required = false): ?string
{
    $value = trim(str_replace("\r\n", "\n", preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', (string) ($_POST[$key] ?? '')) ?? ''));
    if ($value === '') {
        if ($required) {
            fail("$key is required");
        }
        return null;
    }
    if (mb_strlen($value) > $max) {
        fail("$key is too long");
    }
    return $value;
}

function email(string $key, bool $required): ?string
{
    $value = line($key, 254, $required);
    if ($value !== null && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        fail("$key is not a valid email address");
    }
    return $value;
}

/** The form's own words for each field, for error messages. */
const LABELS = [
    'basis' => 'the arbitration agreement',
    'partiesInDispute' => 'the parties in dispute',
    'partiesInDisputeOther' => 'the other party type',
    'claimantType' => "the applicant's type",
    'claimantFullName' => "the applicant's name",
    'claimantOrganizationName' => "the applicant's organisation",
    'claimantEmail' => "the applicant's email",
    'claimantPhone' => "the applicant's phone",
    'claimantAddress' => "the applicant's address",
    'representativeFullName' => "the representative's name",
    'representativeOrganizationName' => "the representative's firm",
    'representativeEmail' => "the representative's email",
    'representativePhone' => "the representative's phone",
    'representativeAddress' => "the representative's address",
    'respondentType' => "the other party's type",
    'respondentFullName' => "the other party's name",
    'respondentOrganizationName' => "the other party's organisation",
    'respondentEmail' => "the other party's email",
    'respondentPhone' => "the other party's phone",
    'respondentAddress' => "the other party's address",
    'respondentAdvocateName' => "the other party's advocate or agent",
    'respondentAdvocateAddress' => "the advocate's address",
    'respondentAdvocateReference' => "the advocate's file reference",
    'architectName' => 'the architect or contract administrator',
    'architectAddress' => "the architect's address",
    'otherConsultants' => 'the quantity surveyor or consulting engineer',
    'projectName' => 'the description of the building works',
    'projectLocation' => 'the location of the building works',
    'contractReference' => 'the title of the contract form',
    'contractSum' => 'the contract sum',
    'contractSigned' => 'whether the contract is signed',
    'contractExecutionDate' => 'the date of the contract',
    'arbitrationClause' => 'the arbitration clause',
    'disputeValue' => 'the approximate sum in dispute',
    'currency' => 'the currency',
    'category' => 'the matter in dispute',
    'description' => 'the outline of the matters in dispute',
    'venueContractor' => "the contractor's preferred venue",
    'venueEmployer' => "the employer's preferred venue",
    'submittedBy' => 'who is submitting the statement',
];

function fail(string $message): void
{
    // "claimantEmail is required" reads "the applicant's email is required".
    $message = preg_replace_callback('/^(\w+)/', fn ($m) => LABELS[$m[1]] ?? $m[1], $message);
    respond(400, ['status' => 'invalid', 'error' => $message]);
}

/** Files must be what their names say: the first bytes of each format. */
function looksLike(string $ext, string $data): bool
{
    $head = substr($data, 0, 4);
    return match ($ext) {
        'pdf' => $head === '%PDF',
        'png' => $head === "\x89PNG",
        'jpg', 'jpeg' => substr($head, 0, 3) === "\xFF\xD8\xFF",
        'docx', 'xlsx' => $head === "PK\x03\x04",
        'doc', 'xls' => $head === "\xD0\xCF\x11\xE0",
        default => false,
    };
}

function party(string $role, bool $emailRequired): array
{
    $type = line("{$role}Type", 20, true);
    if (!in_array($type, ['individual', 'organization'], true)) {
        fail("{$role}Type is invalid");
    }
    return [
        'role' => $role,
        'type' => $type,
        'fullName' => line("{$role}FullName", 255, true),
        'organizationName' => $type === 'organization' ? line("{$role}OrganizationName", 255, true) : null,
        'email' => email("{$role}Email", $emailRequired),
        'phone' => line("{$role}Phone", 50, $role === 'claimant'),
        'address' => line("{$role}Address", 500, true),
    ];
}

function amount(string $key, bool $required): ?float
{
    $raw = str_replace([',', ' '], '', (string) ($_POST[$key] ?? ''));
    if ($raw === '' && !$required) {
        return null;
    }
    if (!is_numeric($raw) || (float) $raw <= 0 || (float) $raw > 1e15) {
        fail("$key must be a number above zero");
    }
    return (float) $raw;
}

// Form SP/1: "Parties in Dispute (tick as appropriate)".
$partiesInDispute = array_values(array_unique(array_map('strval', (array) ($_POST['partiesInDispute'] ?? []))));
if (!$partiesInDispute || array_diff($partiesInDispute, array_keys(PARTY_KINDS))) {
    fail('partiesInDispute is required');
}
$partiesInDisputeOther = in_array('other', $partiesInDispute, true) ? line('partiesInDisputeOther', 100, true) : null;

$basis = line('basis', 30, true);
if (!in_array($basis, ['contractual_clause', 'mutual_agreement'], true)) {
    fail('basis is invalid');
}
$claimant = party('claimant', true);
$respondent = party('respondent', true);

// The applicant's representative, advocate or agent: optional, but reachable if given.
$representative = null;
if (trim((string) ($_POST['representativeFullName'] ?? '')) !== '') {
    $representative = [
        'fullName' => line('representativeFullName', 255, true),
        'organizationName' => line('representativeOrganizationName', 255),
        'email' => email('representativeEmail', true),
        'phone' => line('representativePhone', 50),
        'address' => line('representativeAddress', 500),
    ];
}
// The acknowledgement and the Secretariat's replies go to whoever filed.
$applicantEmail = $representative['email'] ?? $claimant['email'];

$respondentAdvocate = null;
if (trim((string) ($_POST['respondentAdvocateName'] ?? '')) !== '') {
    $respondentAdvocate = [
        'fullName' => line('respondentAdvocateName', 255, true),
        'address' => line('respondentAdvocateAddress', 500),
        'fileReference' => line('respondentAdvocateReference', 100),
    ];
}
$contractAdministrator = null;
if (trim((string) ($_POST['architectName'] ?? '')) !== '') {
    $contractAdministrator = [
        'fullName' => line('architectName', 255, true),
        'address' => line('architectAddress', 500),
        'otherConsultants' => line('otherConsultants', 500),
    ];
}

$currency = strtoupper(line('currency', 3) ?? 'KES');
if (!in_array($currency, CURRENCIES, true)) {
    fail('currency is invalid');
}
$disputeValue = amount('disputeValue', true);
$contractSum = amount('contractSum', false);
$contractSigned = line('contractSigned', 3, true);
if (!in_array($contractSigned, ['yes', 'no'], true)) {
    fail('contractSigned is required');
}
$executionDate = line('contractExecutionDate', 10);
if ($executionDate !== null && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $executionDate)) {
    fail('contractExecutionDate is invalid');
}

$application = [
    'schema' => 'aak-arbitration-intake/1',
    'form' => 'SP/1 Statement of particulars: application to the President for appointment of arbitrator',
    'reference' => 'ARB-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3))),
    'submittedAt' => date('c'),
    'submittedBy' => line('submittedBy', 255, true),
    'case' => [
        'basis' => $basis,
        'disputeValue' => $disputeValue,
        'currency' => $currency,
        'category' => line('category', 100, true),
        'description' => text('description', 10000, true),
        'priorAdjudicationOrMediation' => ($_POST['priorAdr'] ?? '') === 'yes',
    ],
    // The applicant is the system's claimant; the other party its respondent.
    'parties' => [$claimant, $respondent],
    'partiesInDispute' => $partiesInDispute,
    'partiesInDisputeOther' => $partiesInDisputeOther,
    'filedBy' => $representative ? ['role' => 'representative of the applicant'] + $representative : ['role' => 'applicant'],
    'respondentRepresentative' => $respondentAdvocate,
    'contractAdministrator' => $contractAdministrator,
    'project' => [
        'name' => line('projectName', 255, true),
        'location' => line('projectLocation', 255, true),
    ],
    'contract' => [
        'referenceNumber' => line('contractReference', 150, true),
        'executionDate' => $executionDate,
        'value' => $contractSum,
        'currency' => $currency,
        'signed' => $contractSigned === 'yes',
        'hasArbitrationClause' => $basis === 'contractual_clause',
        'arbitrationClauseText' => text('arbitrationClause', 5000),
    ],
    'venuePreferences' => [
        'contractor' => line('venueContractor', 255),
        'employer' => line('venueEmployer', 255),
    ],
    'documents' => [],
];
if (($_POST['otherPartyCopied'] ?? '') !== 'yes') {
    fail('Please confirm the other party is copied');
}
if (($_POST['declaration'] ?? '') !== 'yes') {
    fail('Please confirm the declaration');
}

// Documents: files[] with a matching documentTypes[] entry each (Form SP/1's list).
$attachments = [];
$files = $_FILES['files'] ?? null;
$types = (array) ($_POST['documentTypes'] ?? []);
if ($files && is_array($files['name'])) {
    if (count($files['name']) > MAX_FILES) {
        fail('Please attach at most ' . MAX_FILES . ' files');
    }
    $total = 0;
    foreach ($files['name'] as $i => $name) {
        $error = $files['error'][$i] ?? UPLOAD_ERR_NO_FILE;
        if ($error === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if (in_array($error, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
            respond(413, ['status' => 'too_large']);
        }
        if ($error !== UPLOAD_ERR_OK || !is_uploaded_file($files['tmp_name'][$i])) {
            fail('A file could not be uploaded');
        }
        $item = (string) ($types[$i] ?? '');
        if (!isset(DOCUMENT_ITEMS[$item])) {
            fail('A document type is invalid');
        }
        // A safe file name: letters, digits, dots, dashes and spaces only.
        $safe = trim(preg_replace('/[^\w.\- ]+/u', '_', basename((string) $name)) ?? '', ' .');
        $ext = strtolower(pathinfo($safe, PATHINFO_EXTENSION));
        if ($safe === '' || !in_array($ext, ALLOWED_EXTENSIONS, true)) {
            fail('Files must be PDF, Word, Excel, JPG or PNG');
        }
        $size = (int) $files['size'][$i];
        $total += $size;
        if ($total > MAX_TOTAL_BYTES) {
            respond(413, ['status' => 'too_large']);
        }
        $data = (string) file_get_contents($files['tmp_name'][$i]);
        if (!looksLike($ext, $data)) {
            fail(mb_substr($safe, 0, 60) . " isn't a readable " . strtoupper($ext) . ' file');
        }
        $systemType = DOCUMENT_ITEMS[$item][1] ?? ($basis === 'contractual_clause' ? 'contract_copy' : 'submission_agreement');
        $attachments[] = ['name' => mb_substr($safe, 0, 120), 'data' => $data];
        $application['documents'][] = [
            'fileName' => mb_substr($safe, 0, 120),
            'formItem' => $item,
            'documentType' => $systemType,
            'sizeBytes' => $size,
            'sha256' => hash('sha256', $data),
        ];
    }
}

$hits[] = $now;
@file_put_contents($limitFile, json_encode($hits), LOCK_EX);
@file_put_contents($dayFile, (string) ($today + 1), LOCK_EX);

/* The emails ----------------------------------------------------------- */

function h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function encodedHeader(string $value): string
{
    return preg_match('/[^\x20-\x7E]/', $value) ? '=?UTF-8?B?' . base64_encode($value) . '?=' : $value;
}

/** "Name (Organisation)", then address, email and phone, one per line. */
function contact(array $p): string
{
    return implode("\n", array_filter([
        $p['fullName'] . (!empty($p['organizationName']) ? ' (' . $p['organizationName'] . ')' : ''),
        $p['address'] ?? null,
        $p['email'] ?? null,
        $p['phone'] ?? null,
        !empty($p['fileReference']) ? 'File reference: ' . $p['fileReference'] : null,
        !empty($p['otherConsultants']) ? 'Quantity surveyor / consulting engineer: ' . $p['otherConsultants'] : null,
    ]));
}

$a = $application;
$money = fn (?float $v) => $v === null ? null : $currency . ' ' . number_format($v, 2);
$rows = array_values(array_filter([
    ['Reference', $a['reference']],
    ['Received', date('j F Y, H:i')],
    ['Parties in dispute', implode(', ', array_map(fn ($k) => $k === 'other' ? 'Other: ' . $partiesInDisputeOther : PARTY_KINDS[$k], $partiesInDispute))],
    ['Applicant party', contact($claimant)],
    $representative ? ['Representative / advocate / agent of applicant', contact($representative)] : null,
    ['Other party', contact($respondent)],
    $respondentAdvocate ? ["Other party's advocate / agent", contact($respondentAdvocate)] : null,
    $contractAdministrator ? ['Architect / contract administrator', contact($contractAdministrator)] : null,
    ['Building works', $a['project']['name'] . "\n" . $a['project']['location']],
    ['Contract form', $a['contract']['referenceNumber']],
    $contractSum !== null ? ['Contract sum', $money($contractSum)] : null,
    ['Contract signed', $contractSigned === 'yes' ? 'Yes' : 'No'],
    $executionDate ? ['Contract date', $executionDate] : null,
    ['Arbitration agreement', $basis === 'contractual_clause'
        ? 'Arbitration clause in the contract'
        : 'Separate arbitration agreement'],
    $a['contract']['arbitrationClauseText'] ? ['Arbitration clause', $a['contract']['arbitrationClauseText']] : null,
    ['Matter in dispute', $a['case']['category']],
    ['Outline of the matters in dispute', $a['case']['description']],
    ['Adjudication / mediation', $a['case']['priorAdjudicationOrMediation'] ? 'A matter in dispute has been the subject of adjudication or mediation' : 'Not indicated'],
    ['Approximate sum in dispute', $money($disputeValue)],
    $a['venuePreferences']['contractor'] ? ['Venue preference: contractor', $a['venuePreferences']['contractor']] : null,
    $a['venuePreferences']['employer'] ? ['Venue preference: employer', $a['venuePreferences']['employer']] : null,
    ['Documents', $a['documents']
        ? implode("\n", array_map(fn ($d) => DOCUMENT_ITEMS[$d['formItem']][0] . ': ' . $d['fileName'], $a['documents']))
        : 'None attached'],
    ['Submitted by', $a['submittedBy'] . ', ' . date('j F Y')],
]));

function plainTable(array $rows): string
{
    return implode("\n", array_map(fn ($r) => $r[0] . ":\n  " . str_replace("\n", "\n  ", $r[1]), $rows));
}

function htmlTable(array $rows): string
{
    $out = '<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font:14px/1.5 Arial,sans-serif">';
    foreach ($rows as $r) {
        $out .= '<tr><th align="left" valign="top" style="border-bottom:1px solid #ddd;color:#555;font-weight:600;white-space:nowrap">'
            . h($r[0]) . '</th><td style="border-bottom:1px solid #ddd">' . nl2br(h($r[1])) . '</td></tr>';
    }
    return $out . '</table>';
}

function chunked(string $data): string
{
    return chunk_split(base64_encode($data), 76, "\r\n");
}

/** A multipart/alternative body (plain text + HTML). */
function alternative(string $plain, string $html, string $boundary): string
{
    return "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunked($plain)
        . "--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunked($html)
        . "--$boundary--\r\n";
}

function contentType(string $name): string
{
    return [
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls' => 'application/vnd.ms-excel',
        'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'json' => 'application/json',
    ][strtolower(pathinfo($name, PATHINFO_EXTENSION))] ?? 'application/octet-stream';
}

/** One email as MIME headers and body (for the test outbox and PHP's mail()). */
function mime(array $m, string $from, string $fromName, string $domain): array
{
    $alt = 'alt-' . bin2hex(random_bytes(8));
    $headers = 'From: ' . encodedHeader($fromName) . " <$from>\r\nMIME-Version: 1.0\r\nDate: " . date('r')
        . ($m['replyTo'] ? "\r\nReply-To: {$m['replyTo']}" : '')
        . (!empty($m['messageId']) ? "\r\nMessage-ID: <{$m['messageId']}@$domain>" : '');
    if (!$m['attachments']) {
        return [$headers . "\r\nContent-Type: multipart/alternative; boundary=\"$alt\"", alternative($m['plain'], $m['html'], $alt)];
    }
    $mixed = 'mixed-' . bin2hex(random_bytes(8));
    $body = "--$mixed\r\nContent-Type: multipart/alternative; boundary=\"$alt\"\r\n\r\n" . alternative($m['plain'], $m['html'], $alt);
    foreach ($m['attachments'] as $f) {
        $body .= "--$mixed\r\nContent-Type: " . contentType($f['name']) . '; name="' . encodedHeader($f['name']) . "\"\r\n"
            . 'Content-Transfer-Encoding: base64' . "\r\n" . 'Content-Disposition: attachment; filename="' . encodedHeader($f['name']) . "\"\r\n\r\n"
            . chunked($f['data']);
    }
    return [$headers . "\r\nContent-Type: multipart/mixed; boundary=\"$mixed\"", $body . "--$mixed--\r\n"];
}

/* Microsoft 365 (aak.or.ke's mail) ---------------------------------------
 * aak.or.ke's SPF allows only Microsoft 365 to send for the domain, so mail
 * goes out through Microsoft Graph as the arbitration@ mailbox: an app
 * registered in the AAK tenant with the Mail.Send application permission
 * (limited to that mailbox), its details in config.php under "graph":
 * tenantId, clientId, clientSecret. Each email is made as a draft, its
 * attachments added (over 3 MB in chunks, as Graph requires), then sent, so
 * it also lands in the mailbox's Sent Items. */

const GRAPH_CHUNK = 9 * 320 * 1024; // under Graph's 4 MB per upload request

function http(string $method, string $url, array $headers, ?string $body): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 60,
    ]);
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    if ($response === false) {
        error_log("arbitration-request: $method " . parse_url($url, PHP_URL_HOST) . ' failed: ' . curl_error($ch));
    }
    curl_close($ch);
    return [$status, is_string($response) ? (json_decode($response, true) ?: []) : []];
}

function graphToken(array $g): ?string
{
    [$status, $json] = http(
        'POST',
        ($g['loginBase'] ?? 'https://login.microsoftonline.com') . '/' . rawurlencode((string) $g['tenantId']) . '/oauth2/v2.0/token',
        ['Content-Type: application/x-www-form-urlencoded'],
        http_build_query([
            'grant_type' => 'client_credentials',
            'client_id' => $g['clientId'],
            'client_secret' => $g['clientSecret'],
            'scope' => 'https://graph.microsoft.com/.default',
        ]),
    );
    if ($status !== 200 || empty($json['access_token'])) {
        error_log("arbitration-request: Microsoft sign-in failed ($status " . ($json['error'] ?? '') . ')');
        return null;
    }
    return $json['access_token'];
}

function sendGraph(array $m, array $g, string $from, string $fromName): bool
{
    static $token = null;
    if (!function_exists('curl_init')) {
        error_log('arbitration-request: PHP curl is off; it is needed to send through Microsoft 365');
        return false;
    }
    $token ??= graphToken($g);
    if (!$token) {
        return false;
    }
    $auth = ['Authorization: Bearer ' . $token, 'Content-Type: application/json'];
    $json = fn (array $data) => json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $who = fn (?string $address) => $address ? [['emailAddress' => ['address' => $address]]] : [];
    $mailbox = ($g['graphBase'] ?? 'https://graph.microsoft.com/v1.0') . '/users/' . rawurlencode($from);

    [$status, $draft] = http('POST', "$mailbox/messages", $auth, $json([
        'subject' => $m['subject'],
        'body' => ['contentType' => 'HTML', 'content' => $m['html']],
        'from' => ['emailAddress' => ['address' => $from, 'name' => $fromName]],
        'toRecipients' => $who($m['to']),
        'ccRecipients' => $who($m['cc']),
        'replyTo' => $who($m['replyTo']),
    ]));
    if ($status !== 201 || empty($draft['id'])) {
        error_log("arbitration-request: Microsoft 365 draft failed ($status " . ($draft['error']['code'] ?? '') . ')');
        return false;
    }
    $message = "$mailbox/messages/" . rawurlencode($draft['id']);

    foreach ($m['attachments'] as $f) {
        $size = strlen($f['data']);
        if ($size < 3 * 1024 * 1024) {
            [$status, $res] = http('POST', "$message/attachments", $auth, $json([
                '@odata.type' => '#microsoft.graph.fileAttachment',
                'name' => $f['name'],
                'contentType' => contentType($f['name']),
                'contentBytes' => base64_encode($f['data']),
            ]));
            if ($status !== 201) {
                error_log("arbitration-request: Microsoft 365 attachment failed ($status " . ($res['error']['code'] ?? '') . ')');
                return false;
            }
            continue;
        }
        [$status, $session] = http('POST', "$message/attachments/createUploadSession", $auth, $json([
            'AttachmentItem' => [
                'attachmentType' => 'file',
                'name' => $f['name'],
                'size' => $size,
                'contentType' => contentType($f['name']),
            ],
        ]));
        if ($status !== 201 || empty($session['uploadUrl'])) {
            error_log("arbitration-request: Microsoft 365 upload session failed ($status)");
            return false;
        }
        // The upload address carries its own authorisation: no token on these requests.
        for ($at = 0; $at < $size; $at += GRAPH_CHUNK) {
            $chunk = substr($f['data'], $at, GRAPH_CHUNK);
            [$status] = http('PUT', $session['uploadUrl'], [
                'Content-Type: application/octet-stream',
                'Content-Range: bytes ' . $at . '-' . ($at + strlen($chunk) - 1) . '/' . $size,
            ], $chunk);
            if (!in_array($status, [200, 201], true)) {
                error_log("arbitration-request: Microsoft 365 upload failed ($status)");
                return false;
            }
        }
    }

    [$status, $res] = http('POST', "$message/send", ['Authorization: Bearer ' . $token], '');
    if ($status !== 202) {
        error_log("arbitration-request: Microsoft 365 send failed ($status " . ($res['error']['code'] ?? '') . ')');
        return false;
    }
    return true;
}

/**
 * Sends one email: written to the test outbox if one is set, otherwise
 * through Microsoft 365 when config.php has "graph", otherwise PHP's mail().
 */
function deliver(array $m, array $config, string $from, string $fromName, string $domain): bool
{
    if (!empty($config['outbox'])) {
        [$headers, $body] = mime($m, $from, $fromName, $domain);
        @mkdir($config['outbox'], 0700, true);
        $file = rtrim($config['outbox'], '/\\') . '/' . date('Ymd-His') . '-' . bin2hex(random_bytes(3)) . '.eml';
        $all = "To: {$m['to']}\r\n" . ($m['cc'] ? "Cc: {$m['cc']}\r\n" : '') . 'Subject: ' . encodedHeader($m['subject']) . "\r\n" . $headers . "\r\n\r\n" . $body;
        return file_put_contents($file, $all) !== false;
    }
    if (!empty($config['graph'])) {
        return sendGraph($m, (array) $config['graph'], $from, $fromName);
    }
    [$headers, $body] = mime($m, $from, $fromName, $domain);
    return mail($m['to'], encodedHeader($m['subject']), $body, ($m['cc'] ? "Cc: {$m['cc']}\r\n" : '') . $headers, '-f' . $from);
}

$domain = substr(strrchr($from, '@') ?: '@aak.or.ke', 1);
$partyName = fn (array $p) => $p['organizationName'] ?? $p['fullName'];

// 1. To the Secretariat: the application, the documents, and the JSON copy.
$intro = 'A new application to the President for appointment of an arbitrator (Form SP/1) was submitted on aak.or.ke.';
$jsonName = 'arbitration-request-' . $a['reference'] . '.json';
$secretariat = [
    'to' => $to,
    'cc' => $cc ?: null,
    'replyTo' => $applicantEmail,
    'messageId' => strtolower($a['reference']),
    'subject' => 'Application for appointment of arbitrator ' . $a['reference'] . ': ' . $partyName($claimant) . ' v ' . $partyName($respondent),
    'plain' => "$intro\n\n" . plainTable($rows) . "\n\nReply to this email to answer the applicant.\nThe attached JSON holds the same details in the arbitration system's format.",
    'html' => '<p style="font:14px Arial,sans-serif">' . h($intro) . '</p>' . htmlTable($rows)
        . '<p style="font:13px Arial,sans-serif;color:#555">Reply to this email to answer the applicant. The attached JSON holds the same details in the arbitration system&rsquo;s format.</p>',
    'attachments' => array_merge($attachments, [[
        'name' => $jsonName,
        'data' => json_encode($application, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
    ]]),
];
if (!deliver($secretariat, $config, $from, $fromName, $domain)) {
    error_log('arbitration-request: the Secretariat email could not be sent');
    respond(502, ['status' => 'error']);
}

// 2. To the applicant: the acknowledgement, with what they sent (not the files).
$ackIntro = 'Thank you. The Architectural Association of Kenya has received your application to the President for appointment of an arbitrator. '
    . 'Your reference is ' . $a['reference'] . '; please quote it when you write to the Secretariat.';
$acknowledgement = [
    'to' => $applicantEmail,
    'cc' => null,
    'replyTo' => $to,
    'subject' => 'Your application for appointment of an arbitrator: ' . $a['reference'],
    'plain' => "$ackIntro\n\nWhat you sent:\n\n" . plainTable($rows) . "\n\nArchitectural Association of Kenya\naak@aak.or.ke · +254 721 691 337",
    'html' => '<p style="font:14px Arial,sans-serif">' . h($ackIntro) . '</p><p style="font:14px Arial,sans-serif">What you sent:</p>'
        . htmlTable($rows) . '<p style="font:13px Arial,sans-serif;color:#555">Architectural Association of Kenya<br>aak@aak.or.ke · +254 721 691 337</p>',
    'attachments' => [],
];
if (!deliver($acknowledgement, $config, $from, $fromName, $domain)) {
    error_log('arbitration-request: the acknowledgement could not be sent');
}

respond(200, ['status' => 'ok', 'reference' => $a['reference']]);
