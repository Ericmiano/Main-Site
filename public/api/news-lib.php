<?php
/**
 * Shared code for the news endpoints (api/news.php, api/news-page.php): reads
 * published posts from AAK's WordPress back office (cms.aak.or.ke) through its
 * REST API, keeps only safe formatting, and caches the result briefly.
 *
 * Not reachable on its own: .htaccess only lets the named endpoints run.
 *
 * Optional config OUTSIDE public_html, to point at a different WordPress:
 *   /home/<account>/aak-cms-config.php
 *   <?php return ['cms_url' => 'https://cms.aak.or.ke'];
 */

if (!defined('AAK_NEWS')) {
    http_response_code(404);
    exit;
}

ini_set('display_errors', '0');

const NEWS_CACHE_SECONDS = 60;      // published posts appear within a minute
const NEWS_STALE_SECONDS = 86400;   // if WordPress is down, keep serving the last copy for a day
const NEWS_DEFAULT_CMS = 'https://cms.aak.or.ke';

function news_home(): string
{
    return dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/../..');
}

function news_cms_url(): string
{
    static $url = null;
    if ($url === null) {
        $file = news_home() . '/aak-cms-config.php';
        $config = is_file($file) ? (include $file) : [];
        $url = rtrim((string) (($config['cms_url'] ?? '') ?: NEWS_DEFAULT_CMS), '/');
    }
    return $url;
}

/** GET a WordPress REST path, cached; returns [data, total, totalPages] or null. */
function news_fetch(string $path): ?array
{
    $dir = news_home() . '/.aak-news-cache';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $file = $dir . '/' . sha1(news_cms_url() . $path) . '.json';
    $cached = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
    $age = is_file($file) ? time() - filemtime($file) : PHP_INT_MAX;
    if (is_array($cached) && $age < NEWS_CACHE_SECONDS) {
        return $cached;
    }

    $raw = @file_get_contents(news_cms_url() . '/wp-json' . $path, false, stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 8,
            'ignore_errors' => true,
            'header' => "Accept: application/json\r\nUser-Agent: aak.or.ke news\r\n",
        ],
    ]));
    $status = 0;
    $total = 0;
    $pages = 0;
    foreach ($http_response_header ?? [] as $line) {
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
            $status = (int) $m[1];
        } elseif (preg_match('/^X-WP-Total:\s*(\d+)/i', $line, $m)) {
            $total = (int) $m[1];
        } elseif (preg_match('/^X-WP-TotalPages:\s*(\d+)/i', $line, $m)) {
            $pages = (int) $m[1];
        }
    }
    $data = $raw !== false ? json_decode($raw, true) : null;
    if ($status === 200 && is_array($data)) {
        $result = ['data' => $data, 'total' => $total, 'totalPages' => $pages];
        @file_put_contents($file, json_encode($result), LOCK_EX);
        return $result;
    }
    error_log("news: WordPress responded $status for $path");
    // WordPress unreachable: fall back to the last good copy rather than an empty page.
    return is_array($cached) && $age < NEWS_STALE_SECONDS ? $cached : null;
}

function news_text(string $html): string
{
    $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim(preg_replace('/\s+/u', ' ', $text));
}

/** Only https (or site-relative) links and images survive. */
function news_safe_url(string $url, bool $allowMail = false): ?string
{
    $url = trim($url);
    if ($url === '') {
        return null;
    }
    if (preg_match('#^https?://#i', $url) || preg_match('#^/(?!/)#', $url) || preg_match('/^#/', $url)) {
        return $url;
    }
    if ($allowMail && preg_match('/^(mailto|tel):/i', $url)) {
        return $url;
    }
    return null;
}

/** YouTube embeds only, in privacy-enhanced mode. */
function news_youtube_embed(string $src): ?string
{
    if (preg_match('#^https?://(?:www\.)?(?:youtube\.com|youtube-nocookie\.com)/embed/([A-Za-z0-9_-]{6,20})#', $src, $m)) {
        return 'https://www.youtube-nocookie.com/embed/' . $m[1];
    }
    return null;
}

/**
 * Keep the article's structure and nothing else: headings, paragraphs, lists,
 * quotes, links, images, tables and YouTube videos. Scripts, styles, forms,
 * classes and inline styling are removed, so a post can't break the page or
 * run code on it, whoever wrote it.
 */
function news_sanitize(string $html): string
{
    if (trim($html) === '') {
        return '';
    }
    $allowed = [
        'p' => [], 'h2' => [], 'h3' => [], 'h4' => [], 'strong' => [], 'b' => [], 'em' => [], 'i' => [],
        'u' => [], 's' => [], 'br' => [], 'hr' => [], 'ul' => [], 'ol' => ['start'], 'li' => [],
        'blockquote' => [], 'cite' => [], 'figure' => [], 'figcaption' => [], 'code' => [], 'pre' => [],
        'sub' => [], 'sup' => [], 'table' => [], 'thead' => [], 'tbody' => [], 'tfoot' => [], 'tr' => [],
        'th' => ['colspan', 'rowspan'], 'td' => ['colspan', 'rowspan'], 'caption' => [],
        'a' => ['href'], 'img' => ['src', 'alt', 'width', 'height', 'srcset', 'sizes'], 'iframe' => ['src', 'title'],
    ];
    $rename = ['h1' => 'h2', 'h5' => 'h4', 'h6' => 'h4'];
    $drop = ['script', 'style', 'form', 'input', 'button', 'select', 'textarea', 'object', 'embed', 'noscript', 'svg', 'math', 'link', 'meta', 'template'];

    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="utf-8"?><div id="aak-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    $root = $doc->getElementById('aak-root');
    if (!$root) {
        return '';
    }

    $walk = function (DOMNode $node) use (&$walk, $doc, $allowed, $rename, $drop): void {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child instanceof DOMComment || $child instanceof DOMProcessingInstruction) {
                $node->removeChild($child);
                continue;
            }
            if (!$child instanceof DOMElement) {
                continue;
            }
            $tag = strtolower($child->tagName);
            if (in_array($tag, $drop, true)) {
                $node->removeChild($child);
                continue;
            }
            if (isset($rename[$tag])) {
                $new = $doc->createElement($rename[$tag]);
                while ($child->firstChild) {
                    $new->appendChild($child->firstChild);
                }
                $node->replaceChild($new, $child);
                $child = $new;
                $tag = $rename[$tag];
            }
            if (!isset($allowed[$tag])) {
                // Unknown wrapper (div, section, span…): keep its contents, lose the element.
                $walk($child);
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);
                continue;
            }
            $keep = $allowed[$tag];
            foreach (iterator_to_array($child->attributes) as $attr) {
                if (!in_array(strtolower($attr->name), $keep, true)) {
                    $child->removeAttribute($attr->name);
                }
            }
            if ($tag === 'a') {
                $href = news_safe_url($child->getAttribute('href'), true);
                if ($href === null) {
                    $child->removeAttribute('href');
                } else {
                    $child->setAttribute('href', $href);
                    if (preg_match('#^https?://#i', $href) && !preg_match('#^https://(www\.)?aak\.or\.ke(/|$)#i', $href)) {
                        $child->setAttribute('target', '_blank');
                        $child->setAttribute('rel', 'noopener noreferrer');
                    }
                }
            } elseif ($tag === 'img') {
                $src = news_safe_url($child->getAttribute('src'));
                if ($src === null) {
                    $node->removeChild($child);
                    continue;
                }
                $child->setAttribute('src', $src);
                if ($child->hasAttribute('srcset') && preg_match('/(javascript|data):/i', $child->getAttribute('srcset'))) {
                    $child->removeAttribute('srcset');
                }
                $child->setAttribute('loading', 'lazy');
                $child->setAttribute('decoding', 'async');
            } elseif ($tag === 'iframe') {
                $src = news_youtube_embed($child->getAttribute('src'));
                if ($src === null) {
                    $node->removeChild($child);
                    continue;
                }
                $child->setAttribute('src', $src);
                $child->setAttribute('title', $child->getAttribute('title') ?: 'Video');
                $child->setAttribute('loading', 'lazy');
                $child->setAttribute('allowfullscreen', '');
                $child->setAttribute('allow', 'encrypted-media; picture-in-picture');
            }
            $walk($child);
        }
    };
    $walk($root);

    $out = '';
    foreach ($root->childNodes as $child) {
        $out .= $doc->saveHTML($child);
    }
    // Drop paragraphs left empty by the clean-up.
    return trim(preg_replace('#<p>(\s|&nbsp;|<br>)*</p>#u', '', $out));
}

/** A WordPress post in the shape the site uses. */
function news_post(array $p, bool $withContent): array
{
    $content = $withContent ? news_sanitize((string) ($p['content']['rendered'] ?? '')) : null;
    $words = str_word_count(news_text((string) ($p['content']['rendered'] ?? '')));
    $image = $p['aak_image'] ?? null;
    $post = [
        'id' => (int) ($p['id'] ?? 0),
        'slug' => (string) ($p['slug'] ?? ''),
        'title' => news_text((string) ($p['title']['rendered'] ?? '')),
        'excerpt' => news_text((string) ($p['excerpt']['rendered'] ?? '')),
        'date' => (string) ($p['date_gmt'] ?? '') . 'Z',
        'modified' => (string) ($p['modified_gmt'] ?? '') . 'Z',
        'author' => (string) ($p['aak_author'] ?? ''),
        'categories' => array_values(array_map(
            fn ($c) => ['name' => (string) ($c['name'] ?? ''), 'slug' => (string) ($c['slug'] ?? '')],
            is_array($p['aak_categories'] ?? null) ? $p['aak_categories'] : []
        )),
        'image' => is_array($image) && news_safe_url((string) ($image['src'] ?? '')) ? [
            'src' => (string) $image['src'],
            'width' => (int) ($image['width'] ?? 0),
            'height' => (int) ($image['height'] ?? 0),
            'alt' => (string) ($image['alt'] ?? ''),
        ] : null,
        'readingMinutes' => max(1, (int) round($words / 200)),
    ];
    if ($withContent) {
        $post['content'] = $content;
    }
    return $post;
}

const NEWS_FIELDS = 'id,slug,title,excerpt,date_gmt,modified_gmt,aak_author,aak_image,aak_categories';

/** Categories that have posts (WordPress's default "Uncategorized" left out). */
function news_categories(): array
{
    $res = news_fetch('/wp/v2/categories?hide_empty=true&per_page=100&_fields=id,name,slug,count');
    $out = [];
    foreach (($res['data'] ?? []) as $c) {
        if (($c['slug'] ?? '') === 'uncategorized') {
            continue;
        }
        $out[] = ['id' => (int) $c['id'], 'name' => news_text((string) $c['name']), 'slug' => (string) $c['slug'], 'count' => (int) $c['count']];
    }
    return $out;
}

function news_list(int $page, int $perPage, string $category): ?array
{
    $query = ['status' => 'publish', 'per_page' => $perPage, 'page' => $page, '_fields' => NEWS_FIELDS . ',content'];
    $categories = news_categories();
    if ($category !== '') {
        $match = array_values(array_filter($categories, fn ($c) => $c['slug'] === $category));
        if (!$match) {
            return ['posts' => [], 'total' => 0, 'totalPages' => 0, 'categories' => $categories];
        }
        $query['categories'] = $match[0]['id'];
    }
    $res = news_fetch('/wp/v2/posts?' . http_build_query($query));
    if ($res === null) {
        return null;
    }
    return [
        'posts' => array_map(fn ($p) => news_post($p, false), $res['data']),
        'total' => $res['total'],
        'totalPages' => $res['totalPages'],
        'categories' => $categories,
    ];
}

function news_single(string $slug): ?array
{
    $res = news_fetch('/wp/v2/posts?' . http_build_query(['slug' => $slug, 'status' => 'publish', '_fields' => NEWS_FIELDS . ',content']));
    $first = $res['data'][0] ?? null;
    return is_array($first) ? news_post($first, true) : null;
}
