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
 * Optional settings live OUTSIDE public_html, in
 *   /home/<account>/aak-arbitration/config.php
 * returning an array with any of: to, cc, from, fromName, outbox. "outbox"
 * is a folder: when set, emails are written there as .eml files instead of
 * being sent (for testing). Without the file the defaults below apply.
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
$cc = $config['cc'] ?? 'fiona@aak.or.ke';
$from = $config['from'] ?? 'arbitration@aak.or.ke';
$fromName = $config['fromName'] ?? 'AAK Arbitration';
$outbox = $config['outbox'] ?? null;

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
$respondent = party('respondent', false);

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

function sendMail(string $to, ?string $cc, string $subject, string $headers, string $body, string $from, ?string $outbox): bool
{
    if ($outbox) {
        @mkdir($outbox, 0700, true);
        $file = rtrim($outbox, '/\\') . '/' . date('Ymd-His') . '-' . bin2hex(random_bytes(3)) . '.eml';
        $all = "To: $to\r\n" . ($cc ? "Cc: $cc\r\n" : '') . 'Subject: ' . encodedHeader($subject) . "\r\n" . $headers . "\r\n\r\n" . $body;
        return file_put_contents($file, $all) !== false;
    }
    $headersWithCc = ($cc ? "Cc: $cc\r\n" : '') . $headers;
    return mail($to, encodedHeader($subject), $body, $headersWithCc, '-f' . $from);
}

$domain = substr(strrchr($from, '@') ?: '@aak.or.ke', 1);
$common = 'From: ' . encodedHeader($fromName) . " <$from>\r\nMIME-Version: 1.0\r\nDate: " . date('r');

// 1. To the Secretariat: the application, the documents, and the JSON copy.
$mixed = 'mixed-' . bin2hex(random_bytes(8));
$alt = 'alt-' . bin2hex(random_bytes(8));
$intro = "A new application to the President for appointment of an arbitrator (Form SP/1) was submitted on aak.or.ke.";
$plain = "$intro\n\n" . plainTable($rows) . "\n\nReply to this email to answer the applicant.\nThe attached JSON holds the same details in the arbitration system's format.";
$html = '<p style="font:14px Arial,sans-serif">' . h($intro) . '</p>' . htmlTable($rows)
    . '<p style="font:13px Arial,sans-serif;color:#555">Reply to this email to answer the applicant. The attached JSON holds the same details in the arbitration system&rsquo;s format.</p>';
$body = "--$mixed\r\nContent-Type: multipart/alternative; boundary=\"$alt\"\r\n\r\n" . alternative($plain, $html, $alt);
foreach ($attachments as $file) {
    $body .= "--$mixed\r\nContent-Type: application/octet-stream; name=\"" . encodedHeader($file['name']) . "\"\r\n"
        . "Content-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"" . encodedHeader($file['name']) . "\"\r\n\r\n"
        . chunked($file['data']);
}
$jsonName = 'arbitration-request-' . $a['reference'] . '.json';
$body .= "--$mixed\r\nContent-Type: application/json; name=\"$jsonName\"\r\nContent-Transfer-Encoding: base64\r\n"
    . "Content-Disposition: attachment; filename=\"$jsonName\"\r\n\r\n"
    . chunked(json_encode($application, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE))
    . "--$mixed--\r\n";

$partyName = fn (array $p) => $p['organizationName'] ?? $p['fullName'];
$subject = 'Application for appointment of arbitrator ' . $a['reference'] . ': ' . $partyName($claimant) . ' v ' . $partyName($respondent);
$headers = $common . "\r\nReply-To: " . $applicantEmail . "\r\nMessage-ID: <" . strtolower($a['reference']) . '@' . $domain . ">\r\n"
    . "Content-Type: multipart/mixed; boundary=\"$mixed\"";

if (!sendMail($to, $cc, $subject, $headers, $body, $from, $outbox)) {
    error_log('arbitration-request: the Secretariat email could not be sent');
    respond(502, ['status' => 'error']);
}

// 2. To the applicant: the acknowledgement, with what they sent (not the files).
$ackAlt = 'alt-' . bin2hex(random_bytes(8));
$ackIntro = 'Thank you. The Architectural Association of Kenya has received your application to the President for appointment of an arbitrator. '
    . 'Your reference is ' . $a['reference'] . '; please quote it when you write to the Secretariat.';
$ackPlain = "$ackIntro\n\nWhat you sent:\n\n" . plainTable($rows) . "\n\nArchitectural Association of Kenya\naak@aak.or.ke · +254 721 691 337";
$ackHtml = '<p style="font:14px Arial,sans-serif">' . h($ackIntro) . '</p><p style="font:14px Arial,sans-serif">What you sent:</p>'
    . htmlTable($rows) . '<p style="font:13px Arial,sans-serif;color:#555">Architectural Association of Kenya<br>aak@aak.or.ke · +254 721 691 337</p>';
$ackHeaders = $common . "\r\nReply-To: $to\r\nContent-Type: multipart/alternative; boundary=\"$ackAlt\"";
if (!sendMail($applicantEmail, null, 'Your application for appointment of an arbitrator: ' . $a['reference'], $ackHeaders, alternative($ackPlain, $ackHtml, $ackAlt), $from, $outbox)) {
    error_log('arbitration-request: the acknowledgement could not be sent');
}

respond(200, ['status' => 'ok', 'reference' => $a['reference']]);
