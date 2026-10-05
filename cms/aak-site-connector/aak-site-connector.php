<?php
/**
 * Plugin Name:       AAK Site Connector
 * Description:       Turns this WordPress into the private back office for aak.or.ke: posts publish to News & insights on the main site, and event certificates are uploaded here for verification.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Architectural Association of Kenya
 * License:           Proprietary
 *
 * Visitors never see this WordPress: every public page redirects to
 * aak.or.ke, which reads published posts over the REST API
 * (aak.or.ke/api/news) and shows them in the site's own design.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('AAK_CONNECTOR_DIR', __DIR__);

/** The public site posts appear on. */
function aak_site_url(): string
{
    return untrailingslashit((string) get_option('aak_site_url', 'https://aak.or.ke'));
}

require_once __DIR__ . '/includes/certificates.php';

/* ---------------------------------------------------------------------------
 * Set-up, once, when the plugin is activated.
 */
register_activation_hook(__FILE__, function () {
    foreach (['Blog', 'Article', 'Op-ed', 'News'] as $name) {
        if (!term_exists($name, 'category')) {
            wp_insert_term($name, 'category');
        }
    }
    // Anyone given a login can write and publish their own posts.
    update_option('default_role', 'author');
    update_option('default_comment_status', 'closed');
    update_option('default_ping_status', 'closed');
    update_option('blog_public', '0'); // the back office itself stays out of search engines
    if (!get_option('permalink_structure')) {
        update_option('permalink_structure', '/%postname%/');
    }
    foreach (['administrator', 'editor'] as $role) {
        $r = get_role($role);
        if ($r) {
            $r->add_cap('manage_aak_certificates');
        }
    }
    flush_rewrite_rules();
});

/* ---------------------------------------------------------------------------
 * Headless: no public pages here. Posts open on aak.or.ke/news/<slug>.
 */
add_action('template_redirect', function () {
    if (is_preview() || is_admin() || wp_doing_ajax() || wp_doing_cron() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return;
    }
    if (is_singular('post')) {
        $post = get_queried_object();
        if ($post instanceof WP_Post && $post->post_status === 'publish') {
            wp_redirect(aak_site_url() . '/news/' . $post->post_name, 301);
            exit;
        }
    }
    wp_redirect(aak_site_url() . '/news', 302);
    exit;
});

// "View post" in the editor goes to the article on the main site.
add_filter('post_link', function ($link, $post) {
    if ($post instanceof WP_Post && $post->post_type === 'post' && $post->post_status === 'publish') {
        return aak_site_url() . '/news/' . $post->post_name;
    }
    return $link;
}, 10, 2);

// Previews of drafts stay here (shown with the WordPress theme, logged-in only).
add_filter('preview_post_link', function ($link, $post) {
    return add_query_arg(['p' => $post->ID, 'preview' => 'true'], home_url('/'));
}, 10, 2);

/* ---------------------------------------------------------------------------
 * Lock-down: no comments, pingbacks or XML-RPC; usernames not public.
 */
add_filter('xmlrpc_enabled', '__return_false');
add_filter('pings_open', '__return_false');
add_filter('comments_open', '__return_false');
add_action('init', function () {
    remove_post_type_support('post', 'comments');
    remove_post_type_support('post', 'trackbacks');
    remove_post_type_support('page', 'comments');
});
add_action('admin_menu', function () {
    remove_menu_page('edit-comments.php');
});
add_filter('wp_headers', function ($headers) {
    unset($headers['X-Pingback']);
    return $headers;
});

// The REST API's user list would reveal login names to anyone.
add_filter('rest_endpoints', function ($endpoints) {
    if (!is_user_logged_in()) {
        foreach (array_keys($endpoints) as $route) {
            if (strpos($route, '/wp/v2/users') === 0) {
                unset($endpoints[$route]);
            }
        }
    }
    return $endpoints;
});

// Author pages (?author=1) would too.
add_action('parse_request', function ($wp) {
    if (!is_admin() && isset($_GET['author'])) {
        wp_redirect(aak_site_url(), 302);
        exit;
    }
});

/* ---------------------------------------------------------------------------
 * What the main site needs from each post, ready to use.
 */
add_action('rest_api_init', function () {
    register_rest_field('post', 'aak_author', [
        'get_callback' => function ($post) {
            // Read from the post itself: with ?_fields= the response may not include "author".
            $user = get_userdata((int) get_post_field('post_author', (int) $post['id']));
            return $user ? $user->display_name : '';
        },
        'schema' => ['type' => 'string', 'context' => ['view']],
    ]);
    register_rest_field('post', 'aak_image', [
        'get_callback' => function ($post) {
            $id = get_post_thumbnail_id($post['id']);
            if (!$id) {
                return null;
            }
            $src = wp_get_attachment_image_src($id, 'large') ?: wp_get_attachment_image_src($id, 'full');
            if (!$src) {
                return null;
            }
            return [
                'src' => $src[0],
                'width' => (int) $src[1],
                'height' => (int) $src[2],
                'alt' => (string) get_post_meta($id, '_wp_attachment_image_alt', true),
            ];
        },
        'schema' => ['type' => ['object', 'null'], 'context' => ['view']],
    ]);
    register_rest_field('post', 'aak_categories', [
        'get_callback' => function ($post) {
            $out = [];
            foreach (get_the_category($post['id']) as $cat) {
                if ($cat->slug !== 'uncategorized') {
                    $out[] = ['name' => html_entity_decode($cat->name), 'slug' => $cat->slug];
                }
            }
            return $out;
        },
        'schema' => ['type' => 'array', 'context' => ['view']],
    ]);
});

/* ---------------------------------------------------------------------------
 * A short guide on the dashboard for the people who'll be posting.
 */
add_action('wp_dashboard_setup', function () {
    wp_add_dashboard_widget('aak_guide', 'Posting to aak.or.ke', function () {
        $site = esc_url(aak_site_url() . '/news');
        echo '<ol style="margin-left:1.2em;line-height:1.7">';
        echo '<li>Go to <strong>Posts &rsaquo; Add New Post</strong> and write your post.</li>';
        echo '<li>In the panel on the right, tick a <strong>category</strong> (Blog, Article, Op-ed, News) and set a <strong>featured image</strong>.</li>';
        echo '<li>Optionally write a short <strong>excerpt</strong>: it shows on the news page and when the post is shared.</li>';
        echo '<li>Press <strong>Publish</strong>. The post appears on <a href="' . $site . '" target="_blank" rel="noopener">aak.or.ke/news</a> within a minute.</li>';
        echo '</ol>';
        echo '<p>To change or remove a post later, edit it or move it to the Bin; the site follows within a minute.</p>';
        if (current_user_can('manage_aak_certificates')) {
            echo '<p><strong>Certificates:</strong> upload event certificate lists under <a href="' . esc_url(admin_url('admin.php?page=aak-certificates')) . '">Certificates</a>.</p>';
        }
    });
});

/* ---------------------------------------------------------------------------
 * Settings: where the main site is.
 */
add_action('admin_init', function () {
    register_setting('general', 'aak_site_url', [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => 'https://aak.or.ke',
    ]);
    add_settings_field('aak_site_url', 'Main website (AAK)', function () {
        printf(
            '<input type="url" name="aak_site_url" value="%s" class="regular-text" /><p class="description">Published posts appear at this address under /news.</p>',
            esc_attr(aak_site_url())
        );
    }, 'general');
});
