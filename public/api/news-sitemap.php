<?php
/**
 * Sitemap of published News & insights articles (served at /news-sitemap.xml
 * via .htaccess; listed in robots.txt next to the main sitemap).
 */

define('AAK_NEWS', true);
require __DIR__ . '/news-lib.php';

header('Content-Type: application/xml; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=600');

$urls = [];
for ($page = 1; $page <= 20; $page++) {
    $list = news_list($page, 24, '');
    foreach (($list['posts'] ?? []) as $post) {
        $urls[] = [$post['slug'], $post['modified']];
    }
    if (!$list || $page >= ($list['totalPages'] ?? 0)) {
        break;
    }
}

echo '<?xml version="1.0" encoding="UTF-8"?>', "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', "\n";
foreach ($urls as [$slug, $modified]) {
    $lastmod = substr($modified, 0, 10);
    echo '  <url><loc>https://aak.or.ke/news/', htmlspecialchars($slug, ENT_XML1), '</loc>',
        preg_match('/^\d{4}-\d{2}-\d{2}$/', $lastmod) ? "<lastmod>$lastmod</lastmod>" : '',
        '</url>', "\n";
}
echo '</urlset>', "\n";
