<?php
/**
 * Writing for aak.or.ke: a back office that shows the people posting only
 * what they use, a starting layout for each kind of post, an editor limited
 * to what aak.or.ke displays, and checks before anything is published.
 *
 * Administrators keep the full WordPress back office; everyone else (authors,
 * editors, contributors) gets the simpler one.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Whether this user gets the simpler back office. */
function aak_simple_screens(): bool
{
    return is_user_logged_in() && !current_user_can('manage_options');
}

/* ---------------------------------------------------------------------------
 * The kinds of post. Each is a category on aak.or.ke (News & insights is
 * filtered by them) with a layout to start from. A layout is guidance only:
 * its blocks are empty, with hints in grey, and blocks left empty don't show
 * on aak.or.ke.
 */
function aak_layouts(): array
{
    $p = function (string $hint): array {
        return ['core/paragraph', ['placeholder' => $hint], '<p></p>'];
    };
    $h = function (string $hint): array {
        return ['core/heading', ['placeholder' => $hint], '<h2 class="wp-block-heading"></h2>'];
    };
    $quote = function (string $hint): array {
        return ['core/quote', [], '<blockquote class="wp-block-quote">', [['core/paragraph', ['placeholder' => $hint], '<p></p>']], '</blockquote>'];
    };
    return [
        'news' => [
            'label' => 'News',
            'category' => 'news',
            'hint' => 'What happened, for members and the public',
            'blocks' => [
                $p('Start with what happened, where and when, in a sentence or two.'),
                $p('Then the details, most important first.'),
                $quote('A quote from someone involved (optional: delete this block if there isn’t one).'),
            ],
        ],
        'article' => [
            'label' => 'Article',
            'category' => 'article',
            'hint' => 'A longer piece, in sections',
            'blocks' => [
                $p('Open with what the article is about, in a sentence or two.'),
                $h('First section heading'),
                $p('Write the first section…'),
                $h('Next section heading (optional)'),
                $p('Write the next section…'),
            ],
        ],
        'op-ed' => [
            'label' => 'Op-ed',
            'category' => 'op-ed',
            'hint' => 'An opinion, argued',
            'blocks' => [
                $p('State your argument in a sentence or two.'),
                $p('Make the case…'),
                $quote('A line worth pulling out (optional: delete this block if not needed).'),
                $p('Close with what should happen next.'),
            ],
        ],
        'blog' => [
            'label' => 'Blog',
            'category' => 'blog',
            'hint' => 'A shorter, personal post',
            'blocks' => [$p('Start writing…')],
        ],
    ];
}

/** The category for a kind of post (0 if it has been deleted). */
function aak_layout_category_id(string $key): int
{
    $layouts = aak_layouts();
    if (!isset($layouts[$key])) {
        return 0;
    }
    $term = get_term_by('slug', $layouts[$key]['category'], 'category');
    return $term ? (int) $term->term_id : 0;
}

/** A layout as block markup for the editor. */
function aak_layout_markup(string $key): string
{
    $layouts = aak_layouts();
    if (!isset($layouts[$key])) {
        return '';
    }
    $toBlock = function (array $b) use (&$toBlock): array {
        $inner = isset($b[3]) ? array_map($toBlock, $b[3]) : [];
        $content = $inner ? array_merge([$b[2]], array_fill(0, count($inner), null), [$b[4]]) : [$b[2]];
        return [
            'blockName' => $b[0],
            'attrs' => $b[1],
            'innerBlocks' => $inner,
            'innerHTML' => $inner ? $b[2] . $b[4] : $b[2],
            'innerContent' => $content,
        ];
    };
    return serialize_blocks(array_map($toBlock, $layouts[$key]['blocks']));
}

// "Write a News post" etc. on the dashboard open post-new.php?aak_layout=news:
// the new post starts with that layout, its category already chosen.
add_action('load-post-new.php', function () {
    $key = sanitize_key((string) ($_GET['aak_layout'] ?? ''));
    if (($_GET['post_type'] ?? 'post') !== 'post' || !isset(aak_layouts()[$key])) {
        return;
    }
    add_filter('default_content', function ($content, $post) use ($key) {
        return $post->post_type === 'post' ? aak_layout_markup($key) : $content;
    }, 10, 2);
    add_action('save_post_post', function ($id, $post) use ($key) {
        $category = aak_layout_category_id($key);
        if ($post->post_status === 'auto-draft' && $category) {
            wp_set_post_categories($id, [$category]);
        }
    }, 10, 2);
});

/* ---------------------------------------------------------------------------
 * Checks before publishing. A post goes live only with a title, a category
 * (the kind of post), a featured image (aak.or.ke's cards and sharing
 * previews use it) and alt text for that image (read out to people who
 * can't see it).
 */

/** What a post still needs before it can go live; empty when it's ready. */
function aak_publish_problems(int $id, ?array $categories = null, ?int $thumbnail = null, ?string $title = null): array
{
    $problems = [];
    if (trim(wp_strip_all_tags($title ?? ($id ? get_post_field('post_title', $id) : ''))) === '') {
        $problems[] = 'a title';
    }
    $default = (int) get_option('default_category');
    $chosen = array_filter(array_map('intval', $categories ?? ($id ? wp_get_post_categories($id) : [])), function ($c) use ($default) {
        $term = get_term($c, 'category');
        return $c > 0 && $c !== $default && $term && !is_wp_error($term) && $term->slug !== 'uncategorized';
    });
    if (!$chosen) {
        $problems[] = 'a kind of post (News, Article, Op-ed or Blog)';
    }
    $thumbnail = $thumbnail ?? ($id ? (int) get_post_thumbnail_id($id) : 0);
    if (!$thumbnail) {
        $problems[] = 'a featured image';
    } elseif (trim((string) get_post_meta($thumbnail, '_wp_attachment_image_alt', true)) === '') {
        $problems[] = 'alt text for the featured image';
    }
    return $problems;
}

function aak_and_list(array $items): string
{
    return count($items) > 1 ? implode(', ', array_slice($items, 0, -1)) . ' and ' . end($items) : (string) reset($items);
}

// The editor saves through the REST API: refuse to publish (or schedule, or
// update a live post) until the post is ready, saying what's missing. Drafts
// save as usual.
add_filter('rest_pre_insert_post', function ($prepared, $request) {
    $id = (int) ($prepared->ID ?? 0);
    $status = $prepared->post_status ?? ($id ? get_post_status($id) : 'draft');
    if (!in_array($status, ['publish', 'future'], true)) {
        return $prepared;
    }
    $categories = $request->has_param('categories') ? (array) $request['categories'] : null;
    $thumbnail = $request->has_param('featured_media') ? (int) $request['featured_media'] : null;
    $title = isset($prepared->post_title) ? (string) $prepared->post_title : null;
    $problems = aak_publish_problems($id, $categories, $thumbnail, $title);
    if ($problems) {
        return new WP_Error(
            'aak_not_ready',
            'Not published yet: add ' . aak_and_list($problems) . ' first. "Ready to publish?" in the panel on the right shows what’s missing.',
            ['status' => 400]
        );
    }
    return $prepared;
}, 10, 2);

/* ---------------------------------------------------------------------------
 * The editor: only the blocks aak.or.ke shows (anything else would vanish
 * from the published article), no tags, formats or block directory, and the
 * "Ready to publish?" panel (assets/editor.js).
 */
add_filter('allowed_block_types_all', function ($allowed, $context) {
    if (!isset($context->post) || $context->post->post_type !== 'post') {
        return $allowed;
    }
    return [
        'core/paragraph',
        'core/heading',
        'core/list',
        'core/list-item',
        'core/quote',
        'core/pullquote',
        'core/image',
        'core/embed',
        'core/table',
        'core/separator',
    ];
}, 10, 2);

add_action('init', function () {
    unregister_taxonomy_for_object_type('post_tag', 'post');
    remove_post_type_support('post', 'post-formats');
    remove_post_type_support('post', 'custom-fields');
}, 20);
add_action('after_setup_theme', function () {
    remove_theme_support('post-formats');
    remove_theme_support('core-block-patterns');
}, 100);
add_filter('should_load_remote_block_patterns', '__return_false');
// No ready-made patterns either: a theme's are page designs, built from blocks
// aak.or.ke doesn't show. The layouts above are the starting points.
add_action('init', function () {
    if (!class_exists('WP_Block_Patterns_Registry')) {
        return;
    }
    foreach (WP_Block_Patterns_Registry::get_instance()->get_all_registered() as $pattern) {
        unregister_block_pattern($pattern['name']);
    }
}, PHP_INT_MAX);
remove_action('enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets');
add_filter('block_editor_settings_all', function ($settings, $context) {
    if (isset($context->post) && $context->post->post_type === 'post') {
        // Openverse's free photos: their licences need crediting, which the site doesn't do.
        $settings['enableOpenverseMediaCategory'] = false;
    }
    return $settings;
}, 10, 2);

add_action('enqueue_block_editor_assets', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== 'post') {
        return;
    }
    $file = AAK_CONNECTOR_DIR . '/assets/editor.js';
    wp_enqueue_script(
        'aak-editor',
        plugins_url('assets/editor.js', AAK_CONNECTOR_DIR . '/aak-site-connector.php'),
        ['wp-plugins', 'wp-edit-post', 'wp-editor', 'wp-element', 'wp-components', 'wp-data', 'wp-core-data', 'wp-blocks', 'wp-block-editor', 'wp-dom-ready', 'wp-hooks', 'wp-notices', 'wp-rich-text', 'wp-format-library'],
        (string) filemtime($file),
        true
    );
    $kinds = [];
    foreach (aak_layouts() as $key => $layout) {
        $id = aak_layout_category_id($key);
        if ($id) {
            $kinds[] = ['id' => $id, 'label' => $layout['label'], 'hint' => $layout['hint']];
        }
    }
    wp_localize_script('aak-editor', 'aakEditor', [
        'kinds' => $kinds,
        'defaultCategory' => (int) get_option('default_category'),
        'site' => aak_site_url(),
        'simple' => aak_simple_screens(),
    ]);
});

/* ---------------------------------------------------------------------------
 * The simpler back office: the menu, the bar along the top and the dashboard
 * show only what writing for aak.or.ke needs. Hiding isn't a lock: what each
 * person may do is still set by their role.
 */
add_action('admin_menu', function () {
    if (!aak_simple_screens()) {
        return;
    }
    global $menu, $submenu;
    $keep = ['index.php', 'edit.php', 'upload.php', 'profile.php', 'aak-certificates'];
    foreach ((array) $menu as $item) {
        $slug = (string) ($item[2] ?? '');
        if ($slug !== '' && !in_array($slug, $keep, true)) {
            remove_menu_page($slug);
        }
    }
    foreach ((array) ($submenu['index.php'] ?? []) as $item) {
        if (($item[2] ?? '') !== 'index.php') {
            remove_submenu_page('index.php', $item[2]);
        }
    }
}, PHP_INT_MAX);

add_action('admin_bar_menu', function ($bar) {
    if (!aak_simple_screens()) {
        return;
    }
    $keep = ['top-secondary', 'my-account', 'user-actions', 'user-info', 'edit-profile', 'logout', 'menu-toggle', 'site-name', 'new-content', 'new-post', 'edit', 'view', 'preview'];
    foreach ($bar->get_nodes() as $node) {
        if (!in_array($node->id, $keep, true)) {
            $bar->remove_node($node->id);
        }
    }
}, PHP_INT_MAX);

// The dashboard: start a post, carry on with a draft, see what's live.
add_action('wp_dashboard_setup', function () {
    if (aak_simple_screens()) {
        global $wp_meta_boxes;
        $wp_meta_boxes['dashboard'] = [];
        remove_action('welcome_panel', 'wp_welcome_panel');
    }
    add_meta_box('aak_write', 'Write for aak.or.ke', 'aak_write_widget', 'dashboard', 'normal', 'high');
}, PHP_INT_MAX);

// On the simpler dashboard, "Write for aak.or.ke" is all there is: give it the full width.
add_filter('get_user_option_screen_layout_dashboard', function ($columns) {
    return aak_simple_screens() ? 1 : $columns;
});

function aak_post_list(array $query, callable $line): void
{
    $posts = get_posts($query + ['post_type' => 'post', 'numberposts' => 5, 'orderby' => 'modified', 'order' => 'DESC']);
    if (!$posts) {
        echo '<p class="aak-empty">None yet.</p>';
        return;
    }
    echo '<ul class="aak-posts">';
    foreach ($posts as $post) {
        echo '<li>' . $line($post) . '</li>';
    }
    echo '</ul>';
}

function aak_write_widget(): void
{
    echo '<div class="aak-write">';
    echo '<p class="aak-lead">What are you writing?</p><div class="aak-kinds">';
    foreach (aak_layouts() as $key => $layout) {
        printf(
            '<a class="aak-kind" href="%s"><strong>%s</strong><span>%s</span></a>',
            esc_url(admin_url('post-new.php?aak_layout=' . $key)),
            esc_html($layout['label']),
            esc_html($layout['hint'])
        );
    }
    echo '</div>';

    $user = get_current_user_id();
    echo '<h3>Your drafts</h3>';
    aak_post_list(['author' => $user, 'post_status' => ['draft', 'pending', 'future']], function ($post) {
        $status = ['pending' => ' · waiting for review', 'future' => ' · scheduled'][$post->post_status] ?? '';
        return sprintf(
            '<a href="%s">%s</a> <span class="aak-meta">edited %s ago%s</span>',
            esc_url(get_edit_post_link($post->ID)),
            esc_html(get_the_title($post) ?: '(no title)'),
            esc_html(human_time_diff(get_post_modified_time('U', true, $post), time())),
            esc_html($status)
        );
    });

    if (current_user_can('edit_others_posts')) {
        echo '<h3>Waiting for review</h3>';
        aak_post_list(['post_status' => 'pending'], function ($post) {
            return sprintf(
                '<a href="%s">%s</a> <span class="aak-meta">by %s</span>',
                esc_url(get_edit_post_link($post->ID)),
                esc_html(get_the_title($post) ?: '(no title)'),
                esc_html(get_the_author_meta('display_name', $post->post_author))
            );
        });
    }

    echo '<h3>Recently published</h3>';
    aak_post_list(['post_status' => 'publish', 'orderby' => 'date'], function ($post) {
        $edit = current_user_can('edit_post', $post->ID)
            ? sprintf(' · <a href="%s">Edit</a>', esc_url(get_edit_post_link($post->ID)))
            : '';
        return sprintf(
            '<a href="%s" target="_blank" rel="noopener">%s ↗</a> <span class="aak-meta">%s, %s%s</span>',
            esc_url(get_permalink($post)),
            esc_html(get_the_title($post)),
            esc_html(get_the_author_meta('display_name', $post->post_author)),
            esc_html(get_the_date('j M Y', $post)),
            $edit
        );
    });

    printf(
        '<p class="aak-foot">Published posts appear on <a href="%s" target="_blank" rel="noopener">aak.or.ke/news</a> within a minute. To take one down, move it to the Bin.</p>',
        esc_url(aak_site_url() . '/news')
    );
    if (current_user_can('manage_aak_certificates')) {
        printf(
            '<p class="aak-foot"><strong>Certificates:</strong> upload event certificate lists under <a href="%s">Certificates</a>.</p>',
            esc_url(admin_url('admin.php?page=aak-certificates'))
        );
    }
    echo '</div>';
}

// The posts list: each post's image and whether it's ready, instead of tags
// and comments.
add_filter('manage_post_posts_columns', function ($columns) {
    unset($columns['tags'], $columns['comments']);
    $out = [];
    foreach ($columns as $key => $label) {
        if ($key === 'title') {
            $out['aak_image'] = '<span class="screen-reader-text">Featured image</span>';
        }
        $out[$key] = $label;
        if ($key === 'title') {
            $out['aak_status'] = 'On aak.or.ke';
        }
    }
    return $out;
});

add_action('manage_post_posts_custom_column', function ($column, $id) {
    if ($column === 'aak_image') {
        $thumb = get_the_post_thumbnail($id, [56, 56], ['alt' => '']);
        echo $thumb ?: '<span class="aak-noimage" title="No featured image"></span>';
    } elseif ($column === 'aak_status') {
        if (get_post_status($id) === 'publish') {
            printf('<a href="%s" target="_blank" rel="noopener">Live ↗</a>', esc_url(get_permalink($id)));
            return;
        }
        $problems = aak_publish_problems((int) $id);
        echo $problems
            ? '<span class="aak-needs">Needs ' . esc_html(aak_and_list($problems)) . '</span>'
            : '<span class="aak-ready">Ready to publish</span>';
    }
}, 10, 2);

add_action('admin_enqueue_scripts', function ($hook) {
    if (!in_array($hook, ['index.php', 'edit.php'], true)) {
        return;
    }
    $file = AAK_CONNECTOR_DIR . '/assets/admin.css';
    wp_enqueue_style('aak-admin', plugins_url('assets/admin.css', AAK_CONNECTOR_DIR . '/aak-site-connector.php'), [], (string) filemtime($file));
});
