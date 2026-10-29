<?php
/**
 * Preview as on aak.or.ke. The editor's Preview opens aak.or.ke/news/preview
 * with a signed link that works for an hour; aak.or.ke (api/news-page.php)
 * asks this site for the post with that link, here at
 * /wp-json/aak/v1/preview, and shows it in its own article design. The link
 * is the only key: no WordPress sign-in is needed to view it, and it opens
 * this one post and nothing else.
 */

if (!defined('ABSPATH')) {
    exit;
}

const AAK_PREVIEW_SECONDS = HOUR_IN_SECONDS;

function aak_preview_signature(string $payload): string
{
    return substr(hash_hmac('sha256', $payload, wp_salt('auth') . '|aak-preview'), 0, 32);
}

/** post.user.expiry.signature */
function aak_preview_token(int $postId, int $userId): string
{
    $payload = $postId . '.' . $userId . '.' . (time() + AAK_PREVIEW_SECONDS);
    return $payload . '.' . aak_preview_signature($payload);
}

/** [post ID, user ID] for a valid, unexpired link the user may still use; null otherwise. */
function aak_preview_check(string $token): ?array
{
    if (!preg_match('/^(\d{1,20})\.(\d{1,20})\.(\d{1,12})\.([a-f0-9]{32})$/', $token, $m)) {
        return null;
    }
    $payload = "$m[1].$m[2].$m[3]";
    if (!hash_equals(aak_preview_signature($payload), $m[4]) || (int) $m[3] < time()) {
        return null;
    }
    $postId = (int) $m[1];
    $userId = (int) $m[2];
    $post = get_post($postId);
    if (!$post || $post->post_type !== 'post' || $post->post_status === 'trash' || !user_can($userId, 'edit_post', $postId)) {
        return null;
    }
    return [$postId, $userId];
}

// Preview (in the editor, and in the posts list) opens aak.or.ke.
add_filter('preview_post_link', function ($link, $post) {
    if (!$post instanceof WP_Post || $post->post_type !== 'post' || !get_current_user_id()) {
        return $link;
    }
    return aak_site_url() . '/news/preview?token=' . aak_preview_token((int) $post->ID, get_current_user_id());
}, 10, 2);

// /news/preview is the preview's address, so no post may take "preview" as its own.
add_filter('wp_unique_post_slug', function ($slug, $id, $status, $type) {
    return $type === 'post' && $slug === 'preview' ? 'preview-2' : $slug;
}, 10, 4);

add_action('rest_api_init', function () {
    register_rest_route('aak/v1', '/preview', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'args' => [
            'token' => ['type' => 'string', 'required' => true],
            // The featured image just chosen in the editor, not saved yet.
            'thumbnail' => ['type' => 'integer', 'required' => false],
        ],
        'callback' => 'aak_preview_response',
    ]);
});

function aak_preview_response(WP_REST_Request $request)
{
    $found = aak_preview_check((string) $request['token']);
    if (!$found) {
        return new WP_Error('aak_preview_expired', 'This preview link has expired. Press Preview in the editor for a new one.', ['status' => 404]);
    }
    [$postId, $userId] = $found;
    $post = get_post($postId);

    // The latest words: the unsaved changes Preview has just autosaved, if newer.
    $source = $post;
    $autosave = wp_get_post_autosave($postId, $userId);
    if ($autosave && strtotime($autosave->post_modified_gmt) >= strtotime($post->post_modified_gmt)) {
        $source = $autosave;
    }

    $thumbnail = (int) $request['thumbnail'];
    if (!$thumbnail || get_post_type($thumbnail) !== 'attachment') {
        $thumbnail = (int) get_post_thumbnail_id($postId);
    }

    $GLOBALS['post'] = $post;
    setup_postdata($post);
    $content = apply_filters('the_content', $source->post_content);
    wp_reset_postdata();

    $date = $post->post_date_gmt !== '0000-00-00 00:00:00' ? $post->post_date_gmt : current_time('mysql', true);
    $response = rest_ensure_response([
        'id' => $postId,
        'slug' => 'preview',
        'status' => $post->post_status,
        'title' => ['rendered' => apply_filters('the_title', $source->post_title, $postId)],
        'excerpt' => ['rendered' => $source->post_excerpt !== '' ? $source->post_excerpt : wp_trim_words(wp_strip_all_tags($content), 55)],
        'content' => ['rendered' => $content],
        'date_gmt' => str_replace(' ', 'T', $date),
        'modified_gmt' => str_replace(' ', 'T', $source->post_modified_gmt),
        'aak_author' => aak_post_author_name($postId),
        'aak_image' => aak_image_for($thumbnail),
        'aak_categories' => aak_post_categories($postId),
    ]);
    $response->header('Cache-Control', 'no-store');
    $response->header('X-Robots-Tag', 'noindex');
    return $response;
}
