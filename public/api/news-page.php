<?php
/**
 * Article pages, /news/<slug> (routed here by .htaccess). Serves the site's
 * article page with this post's own title, description and sharing preview in
 * the <head>, so search engines and social networks see the real article, and
 * hands the post to the page so it shows without a second request.
 * An unknown or unpublished slug gets the site's 404 page.
 */

define('AAK_NEWS', true);
require __DIR__ . '/news-lib.php';

const SITE_URL = 'https://aak.or.ke';

$root = $_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__);
$slug = (string) ($_GET['slug'] ?? '');
$post = preg_match('/^[a-z0-9-]{1,200}$/', $slug) ? news_single($slug) : null;
$template = @file_get_contents($root . '/news/__article__/index.html');

header('X-Content-Type-Options: nosniff');

if (!$post || $template === false) {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    readfile($root . '/404.html');
    exit;
}

$e = fn (string $s) => htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
$url = SITE_URL . '/news/' . $post['slug'];
$title = $post['title'] . ' | Architectural Association of Kenya';
$description = mb_substr($post['excerpt'] ?: $post['title'], 0, 300);
$image = $post['image']['src'] ?? SITE_URL . '/og-image.jpg';

// Drop the template's generic head tags, then add this article's.
$template = preg_replace([
    '#<title>.*?</title>#s',
    '#<meta\s+(?:name|property)="(?:description|og:[a-z:_]+|twitter:[a-z:_]+)"[^>]*>#i',
    '#<link\s+rel="canonical"[^>]*>#i',
], '', $template);

$jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'Article',
    'headline' => $post['title'],
    'description' => $description,
    'datePublished' => $post['date'],
    'dateModified' => $post['modified'],
    'mainEntityOfPage' => $url,
    'image' => [$image],
    'author' => $post['author'] ? ['@type' => 'Person', 'name' => $post['author']] : ['@id' => SITE_URL . '/#organization'],
    'publisher' => ['@id' => SITE_URL . '/#organization'],
];
$json = fn ($v) => json_encode($v, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);

$head = '<title>' . $e($title) . '</title>'
    . '<meta name="description" content="' . $e($description) . '"/>'
    . '<link rel="canonical" href="' . $e($url) . '"/>'
    . '<meta property="og:type" content="article"/>'
    . '<meta property="og:title" content="' . $e($post['title']) . '"/>'
    . '<meta property="og:description" content="' . $e($description) . '"/>'
    . '<meta property="og:url" content="' . $e($url) . '"/>'
    . '<meta property="og:image" content="' . $e($image) . '"/>'
    . '<meta property="article:published_time" content="' . $e($post['date']) . '"/>'
    . '<meta name="twitter:card" content="summary_large_image"/>'
    . '<script type="application/ld+json">' . $json($jsonLd) . '</script>'
    // The post itself, read by the page on load (data, not script).
    . '<script type="application/json" id="aak-news-post">' . $json($post) . '</script>';

$html = preg_replace('#</head>#i', $head . '</head>', $template, 1);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=60');
echo $html;
