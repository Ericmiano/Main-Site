<?php
/**
 * News & insights feed (served at /api/news via .htaccess) from AAK's
 * WordPress back office; see news-lib.php.
 *
 *   /api/news?page=1&per_page=12&category=op-ed   a page of posts + categories
 *   /api/news?slug=my-post                        one post, with its content
 */

define('AAK_NEWS', true);
require __DIR__ . '/news-lib.php';

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

function news_respond(int $status, array $body, int $maxAge): void
{
    http_response_code($status);
    header($maxAge > 0 ? "Cache-Control: public, max-age=$maxAge" : 'Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
    header('Allow: GET, HEAD');
    news_respond(405, ['error' => 'method'], 0);
}

$slug = (string) ($_GET['slug'] ?? '');
if ($slug !== '') {
    if (!preg_match('/^[a-z0-9-]{1,200}$/', $slug)) {
        news_respond(404, ['error' => 'not_found'], 60);
    }
    $post = news_single($slug);
    $post ? news_respond(200, ['post' => $post], 60) : news_respond(404, ['error' => 'not_found'], 60);
}

$page = max(1, min(500, (int) ($_GET['page'] ?? 1)));
$perPage = max(1, min(24, (int) ($_GET['per_page'] ?? 12)));
$category = (string) ($_GET['category'] ?? '');
if ($category !== '' && !preg_match('/^[a-z0-9-]{1,100}$/', $category)) {
    $category = '';
}
$list = news_list($page, $perPage, $category);
$list === null ? news_respond(503, ['error' => 'unavailable'], 0) : news_respond(200, $list, 60);
